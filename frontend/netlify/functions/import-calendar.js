import axios from 'axios';

export const handler = async (event, context) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { icsUrl } = JSON.parse(event.body);

        if (!icsUrl) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'URL del calendario requerida' })
            };
        }

        console.log('[Netlify Function] Descargando:', icsUrl);

        const response = await axios.get(icsUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/calendar, text/plain, */*'
            }
        });

        const icsData = response.data;

        if (!icsData || (typeof icsData === 'string' && !icsData.includes('BEGIN:VCALENDAR'))) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'La URL no devolvió un calendario válido. Asegúrate de copiar el enlace de "URL de calendario".' })
            };
        }

        const events = parseICS(icsData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                tasks: events,
                total: events.length
            })
        };

    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error al procesar el calendario: ' + error.message })
        };
    }
};

function parseICS(icsText) {
    const events = [];
    const DAYS_MAP = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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

        let cleanTitle = summary
            .replace(/^Vencimiento de /i, '')
            .replace(/\s+/g, ' ')
            .trim();

        let cleanDesc = description
            ? description
                .replace(/\\n/g, ' ')
                .replace(/\\, /g, ',')
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

    events.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    return events;
}

function extractField(block, fieldName) {
    const regex = new RegExp(`^${fieldName}[;:](.*)$`, 'm');
    const match = block.match(regex);
    if (!match) return '';
    let value = match[1];
    if (value.includes(':')) {
        value = value.split(':').pop();
    }
    return value.trim();
}

function parseICSDate(dateStr) {
    try {
        const clean = dateStr.replace(/[^0-9TZ]/g, '');
        if (clean.length >= 15) {
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
            const year = parseInt(clean.substring(0, 4));
            const month = parseInt(clean.substring(4, 6)) - 1;
            const day = parseInt(clean.substring(6, 8));
            return new Date(year, month, day, 9, 0, 0);
        }
    } catch (_e) { }
    return null;
}
