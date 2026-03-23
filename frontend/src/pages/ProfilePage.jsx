import React from 'react';
import { User, Shield, LogOut, ChevronRight, Mail, Bell, Moon } from 'lucide-react';

const ProfilePage = () => {
    const settingsGroups = [
        {
            title: 'Datos Personales',
            items: [
                { icon: User, label: 'Nombre de Usuario', value: 'Test User' },
                { icon: Mail, label: 'Correo Electrónico', value: 'testuser_jetski@uma.es', badge: 'Pendiente' },
            ]
        },
        {
            title: 'Preferencias',
            items: [
                { icon: Bell, label: 'Notificaciones', toggle: true },
                { icon: Moon, label: 'Modo Oscuro', toggle: true, checked: true },
            ]
        },
        {
            title: 'Seguridad',
            items: [
                { icon: Shield, label: 'Cambiar Contraseña', action: true },
            ]
        }
    ];

    return (
        <div className="page-content">
            <div className="section-header" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Mi Perfil</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gestiona tu seguridad e información de la cuenta</p>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 700, boxShadow: '0 8px 32px var(--primary-glow)' }}>
                    T
                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '28px', height: '28px', background: 'var(--bg-dark)', borderRadius: '14px', border: '3px solid var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '12px', height: '12px', background: 'var(--success)', borderRadius: '6px' }} />
                    </div>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Test User</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PLAN GRATUITO ACTIVO</p>
            </div>

            {settingsGroups.map((group, idx) => (
                <div key={idx} style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', marginLeft: '4px' }}>
                        {group.title}
                    </h4>
                    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                        {group.items.map((item, i) => (
                            <div
                                key={i}
                                className="profile-item"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px 20px',
                                    borderBottom: i === group.items.length - 1 ? 'none' : '1px solid var(--glass-border)',
                                    cursor: item.action || item.toggle ? 'pointer' : 'default',
                                    transition: 'var(--transition)'
                                }}
                            >
                                <item.icon size={20} color="var(--text-secondary)" />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>{item.label}</p>
                                    {item.value && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.value}</p>}
                                </div>
                                {item.badge && (
                                    <span style={{ fontSize: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{item.badge}</span>
                                )}
                                {item.toggle && (
                                    <div style={{ width: '40px', height: '20px', background: item.checked ? 'var(--primary)' : 'var(--glass-bg)', borderRadius: '10px', position: 'relative', transition: 'var(--transition)' }}>
                                        <div style={{ position: 'absolute', top: '2px', left: item.checked ? '22px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '8px', transition: 'var(--transition)' }} />
                                    </div>
                                )}
                                {item.action && <ChevronRight size={18} color="var(--text-muted)" />}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                className="btn btn-ghost"
                style={{ width: '100%', padding: '16px', marginTop: '12px', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)', gap: '12px' }}
            >
                <LogOut size={20} />
                Cerrar Sesión
            </button>

            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '32px', opacity: 0.5 }}>
                Version 1.0.0 (Alpha Build)
            </p>
        </div>
    );
};

export default ProfilePage;
