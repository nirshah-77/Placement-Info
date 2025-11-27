import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
    const navigate = useNavigate();

    const modules = [
        { id: 'MOD-01', title: 'Student Admission', status: 'OFFLINE' },
        { id: 'MOD-02', title: 'Faculty Management', status: 'OFFLINE' },
        { id: 'MOD-03', title: 'Human Resources', status: 'OFFLINE' },
        { id: 'MOD-04', title: 'Admin Control', status: 'OFFLINE' },
        { id: 'MOD-05', title: 'Accounts & Finance', status: 'OFFLINE' },
        { id: 'MOD-06', title: 'Hostel Management', status: 'OFFLINE' },
        { id: 'MOD-07', title: 'Placement & Alumni', status: 'ONLINE', active: true, route: '/placement' },
    ];

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>System Dashboard</h1>
                    <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0' }}>Overview of installed ERP modules</p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '2rem',
                marginTop: '2rem'
            }}>
                {modules.map((mod) => (
                    <div
                        key={mod.id}
                        className="card"
                        style={{
                            cursor: mod.active ? 'pointer' : 'not-allowed',
                            opacity: mod.active ? 1 : 0.7,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onClick={() => mod.active && navigate(mod.route)}
                    >
                        {/* Active Indicator Strip */}
                        {mod.active && (
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600' }}>{mod.id}</span>
                            <span style={{
                                fontSize: '0.7rem',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                background: mod.status === 'ONLINE' ? '#dcfce7' : '#f1f5f9',
                                color: mod.status === 'ONLINE' ? '#166534' : '#94a3b8',
                                fontWeight: '700',
                                letterSpacing: '0.5px'
                            }}>
                                {mod.status}
                            </span>
                        </div>



                        <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)' }}>{mod.title}</h3>

                        {mod.active ? (
                            <button className="btn btn-primary" style={{ width: '100%', borderRadius: '8px', padding: '10px' }}>
                                Access Module &rarr;
                            </button>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '0.9rem', fontWeight: '500', padding: '10px 0' }}>
                                <span>🔒</span> Restricted Access
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainDashboard;
