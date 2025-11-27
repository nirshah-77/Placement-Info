import React, { useState, useEffect } from 'react';
import StudentList from './StudentList';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { jwtDecode } from "jwt-decode";
import { authService } from '../services/authService';

const PlacementDashboard = () => {
    const [stats, setStats] = useState({
        totalPlaced: 0,
        avgPackage: 0,
        topRecruiter: '-',
        maxValue: 0,
        placementRate: 0,
        historicalData: []
    });

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null); // 'totalPlaced', 'avgPackage', 'placementRate'
    const [userRole, setUserRole] = useState('employee'); // Default to employee to show everything by default

    useEffect(() => {
        const token = authService.getToken();
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role) {
                    setUserRole(decoded.role);
                }
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);

    const handleStatsCalculated = (newStats) => {
        setStats(newStats);
    };
    // ... (rest of the file)

    // ... inside return ...
    {/* StudentList is always mounted to calculate stats, but we pass isHidden prop if guest */ }
    <div style={{ marginTop: '3rem' }}>
        <StudentList onStatsCalculated={handleStatsCalculated} isHidden={userRole === 'guest'} />
    </div>

    const handleCardClick = (metric) => {
        if (metric === 'topRecruiter') return; // No history for top recruiter yet
        setSelectedMetric(metric);
        setShowHistoryModal(true);
    };

    const getMetricLabel = (metric) => {
        switch (metric) {
            case 'totalPlaced': return 'Total Placements';
            case 'avgPackage': return 'Average Package (LPA)';
            case 'placementRate': return 'Placement Rate (%)';
            default: return '';
        }
    };

    const getMetricColor = (metric) => {
        switch (metric) {
            case 'totalPlaced': return '#3b82f6';
            case 'avgPackage': return '#22c55e';
            case 'placementRate': return '#ec4899';
            default: return '#8884d8';
        }
    };

    const statCards = [
        { key: 'totalPlaced', title: "Total Placements", value: stats.totalPlaced.toLocaleString(), change: "This Year", icon: "📈", color: "blue" },
        { key: 'avgPackage', title: "Average Package", value: `${stats.avgPackage} LPA`, change: "This Year", icon: "💰", color: "green" },
        { key: 'topRecruiter', title: "Top Recruiter", value: stats.topRecruiter, change: `Value: ${stats.maxValue} LPA`, icon: "🏆", color: "purple" },
        { key: 'placementRate', title: "Placement Rate", value: `${stats.placementRate}%`, change: "This Year", icon: "🎯", color: "pink" },
    ];

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <h1>Dashboard</h1>
                <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0' }}>Welcome back, here's what's happening today.</p>
            </div>

            {/* Summary Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="card"
                        onClick={() => handleCardClick(stat.key)}
                        style={{
                            height: 'auto',
                            borderLeft: `4px solid var(--${stat.color === 'blue' ? 'primary' : stat.color === 'pink' ? 'secondary' : 'text-main'})`,
                            cursor: stat.key !== 'topRecruiter' ? 'pointer' : 'default',
                            transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => { if (stat.key !== 'topRecruiter') e.currentTarget.style.transform = 'translateY(-5px)' }}
                        onMouseLeave={(e) => { if (stat.key !== 'topRecruiter') e.currentTarget.style.transform = 'translateY(0)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(241, 245, 249, 0.5)', padding: '10px', borderRadius: '12px', fontSize: '1.5rem' }}>
                                {stat.icon}
                            </div>
                            <span style={{
                                background: stat.change.includes('+') ? '#dcfce7' : '#f1f5f9',
                                color: stat.change.includes('+') ? '#166534' : '#64748b',
                                padding: '4px 8px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                                {stat.title}
                            </h3>
                            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                {stat.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Student List & Filters Section */}
            <div style={{ marginTop: '3rem' }}>
                <StudentList onStatsCalculated={handleStatsCalculated} isHidden={userRole === 'guest'} />
            </div>

            {/* History Modal */}
            {showHistoryModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }} onClick={() => setShowHistoryModal(false)}>
                    <div style={{
                        background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '800px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--text-main)' }}>{getMetricLabel(selectedMetric)} - History</h2>
                            <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {/* Chart */}
                        <div style={{ height: '300px', marginBottom: '2rem' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar dataKey={selectedMetric} fill={getMetricColor(selectedMetric)} radius={[4, 4, 0, 0]}>
                                        {stats.historicalData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={getMetricColor(selectedMetric)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-light)' }}>Year</th>
                                    <th style={{ padding: '12px', textAlign: 'right', color: 'var(--text-light)' }}>{getMetricLabel(selectedMetric)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.historicalData.map((row, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{row.year}</td>
                                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: getMetricColor(selectedMetric) }}>
                                            {selectedMetric === 'avgPackage' ? `${row[selectedMetric]} LPA` :
                                                selectedMetric === 'placementRate' ? `${row[selectedMetric]}%` :
                                                    row[selectedMetric]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlacementDashboard;
