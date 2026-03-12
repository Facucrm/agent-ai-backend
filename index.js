const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ============================================================
// POST /api/uma/import-calendar
// Recibe { icsUrl } y devuelve las tareas parseadas del ICS
// ============================================================
app.post('/api/uma/import-calendar', async (req, res) => {
    const { icsUrl } = req.body;

    if (!icsUrl) {
        return res.status(400).json({ error: 'Se requiere la URL del calendario.' });
    }

    // Validar que la URL sea de Moodle UMA
    if (!icsUrl.includes('.cv.uma.es/') && !icsUrl.includes('moodle')) {
        return res.status(400).json({ error: 'La URL no parece ser de un calendario Moodle válido.' });
    }

    try {
        console.log('[ICS Import] Descargando calendario desde:', icsUrl);

        const response = await axios.get(icsUrl, { timeout: 15000 });
        const icsData = response.data;

        if (!icsData || !icsData.includes('BEGIN:VCALENDAR')) {
            return res.status(400).json({ error: 'La URL no devolvió un calendario válido.' });
        }

        // Parsear eventos del ICS
        const events = parseICS(icsData);
        console.log(`[ICS Import] Se encontraron ${events.length} eventos.`);

        return res.json({
            success: true,
            tasks: events,
            total: events.length,
            message: `Se importaron ${events.length} tareas del Campus Virtual.`
        });

    } catch (err) {
        console.error('[ICS Import Error]', err.message);

        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            return res.status(503).json({
                error: 'No se pudo conectar con el servidor de la UMA.'
            });
        }

        if (err.response && err.response.status === 401) {
            return res.status(401).json({
                error: 'Token de calendario expirado. Genera uno nuevo desde Moodle.'
            });
        }

        return res.status(500).json({
            error: 'Error al importar el calendario: ' + err.message
        });
    }
});

// ============================================================
// Parseador de formato ICS/iCal
// ============================================================
function parseICS(icsText) {
    const events = [];
    const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Desdoblar líneas largas (RFC 5545: continuación con espacio/tab)
    // Moodle a veces usa \r\n, \n, o solo espacios para continuar líneas
    const unfolded = icsText
        .replace(/\r\n[ \t]/g, '')
        .replace(/\r[ \t]/g, '')
        .replace(/\n[ \t]/g, '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n');
    const blocks = unfolded.split('BEGIN:VEVENT');

    for (let i = 1; i < blocks.length; i++) {
        const block = blocks[i].split('END:VEVENT')[0];

        const summary = extractField(block, 'SUMMARY');
        const dtstart = extractField(block, 'DTSTART');
        const dtend = extractField(block, 'DTEND');
        const description = extractField(block, 'DESCRIPTION');
        const categories = extractField(block, 'CATEGORIES');
        const uid = extractField(block, 'UID');

        if (!summary || !dtstart) continue;

        // Parsear fecha
        const date = parseICSDate(dtstart);
        if (!date) continue;

        const endDate = dtend ? parseICSDate(dtend) : null;

        const dayName = DAYS_MAP[date.getDay()];
        const hours = String(date.getHours()).padStart(2, '0');
        const mins = String(date.getMinutes()).padStart(2, '0');

        let endHours, endMins;
        if (endDate && endDate.getTime() !== date.getTime()) {
            endHours = String(endDate.getHours()).padStart(2, '0');
            endMins = String(endDate.getMinutes()).padStart(2, '0');
        } else {
            endHours = String(Math.min(date.getHours() + 1, 23)).padStart(2, '0');
            endMins = mins;
        }

        // Limpiar el título
        let cleanTitle = summary
            .replace(/^Vencimiento de /i, '')
            .replace(/\s+/g, ' ')
            .trim();

        // Limpiar descripción
        let cleanDesc = description
            ? description
                .replace(/\\n/g, ' ')
                .replace(/\\,/g, ',')
                .replace(/<[^>]*>/g, '')
                .substring(0, 120)
                .trim()
            : '';

        events.push({
            id: `uma_${uid || i}`,
            title: `[UMA] ${cleanTitle}`,
            timeStart: `${hours}:${mins}`,
            timeEnd: `${endHours}:${endMins}`,
            day: dayName,
            done: false,
            isUma: true,
            rawDate: date.toISOString(),
            course: categories || '',
            description: cleanDesc
        });
    }

    // Ordenar por fecha
    events.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    return events;
}

function extractField(block, fieldName) {
    // Buscar el campo con o sin parámetros (ej: DTSTART;VALUE=DATE:20260312)
    const regex = new RegExp(`^${fieldName}[;:](.*)$`, 'm');
    const match = block.match(regex);
    if (!match) return '';

    let value = match[1];
    // Si tiene parámetros antes del valor (ej: ;VALUE=DATE:20260312)
    if (value.includes(':')) {
        value = value.split(':').pop();
    }
    return value.trim();
}

function parseICSDate(dateStr) {
    // Formatos: 20260312T090000Z o 20260312T090000 o 20260312
    try {
        const clean = dateStr.replace(/[^0-9TZ]/g, '');

        if (clean.length >= 15) {
            // Con hora: 20260312T090000Z
            const year = parseInt(clean.substring(0, 4));
            const month = parseInt(clean.substring(4, 6)) - 1;
            const day = parseInt(clean.substring(6, 8));
            const hour = parseInt(clean.substring(9, 11));
            const min = parseInt(clean.substring(11, 13));
            const sec = parseInt(clean.substring(13, 15));

            if (clean.endsWith('Z')) {
                return new Date(Date.UTC(year, month, day, hour, min, sec));
            }
            return new Date(year, month, day, hour, min, sec);
        } else if (clean.length >= 8) {
            // Solo fecha: 20260312
            const year = parseInt(clean.substring(0, 4));
            const month = parseInt(clean.substring(4, 6)) - 1;
            const day = parseInt(clean.substring(6, 8));
            return new Date(year, month, day, 9, 0, 0);
        }
    } catch (_e) { /* ignore */ }
    return null;
}

// ============================================================
// Health check
// ============================================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Agent.ai Moodle Bridge', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Agent.ai Moodle Backend corriendo en http://localhost:${PORT}`);
    console.log(`   Endpoints disponibles:`);
    console.log(`   POST /api/uma/import-calendar → Importar calendario ICS`);
    console.log(`   GET  /api/health              → Estado del servidor\n`);
});
