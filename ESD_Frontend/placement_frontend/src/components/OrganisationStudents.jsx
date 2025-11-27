import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import '../styles/StudentList.css';

const OrganisationStudents = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrg, setSelectedOrg] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccessAndFetch = async () => {
            const token = localStorage.getItem('user');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const decoded = jwtDecode(token);
                if (decoded.role === 'guest') {
                    navigate('/dashboard'); // Redirect guests to dashboard
                    return;
                }

                const response = await axios.get('http://localhost:9191/organisation/students', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Process data to group by organization
                const groupedData = {};
                response.data.forEach(row => {
                    const orgName = row[1];
                    const orgAddress = row[2];
                    const student = {
                        firstName: row[3],
                        lastName: row[4],
                        email: row[5],
                        rollno: row[6]
                    };

                    if (!groupedData[orgName]) {
                        groupedData[orgName] = {
                            address: orgAddress,
                            students: []
                        };
                    }
                    groupedData[orgName].students.push(student);
                });

                setData(groupedData);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setError("Failed to fetch data or unauthorized access");
                setLoading(false);
            }
        };

        checkAccessAndFetch();
    }, [navigate]);

    const orgs = Object.keys(data).sort();

    if (loading) return <div className="student-list-container"><div className="no-data">Loading...</div></div>;
    if (error) return <div className="student-list-container"><div className="error-message">{error}</div></div>;

    return (
        <div className="student-list-container">
            <h1 className="header">Organisation Students</h1>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="filter-group">
                    <label>Organisation:</label>
                    <select
                        className="filter-dropdown"
                        value={selectedOrg}
                        onChange={(e) => setSelectedOrg(e.target.value)}
                    >
                        <option value="">All</option>
                        {orgs.map(org => <option key={org} value={org}>{org}</option>)}
                    </select>
                </div>
                <button
                    className="reset-button"
                    onClick={() => {
                        setSelectedOrg('');
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Main Data Table */}
            <div>
                {selectedOrg && data[selectedOrg] ? (
                    <>
                        <h2 className="section-title">
                            {data[selectedOrg].students.length > 0 ? `Students at ${selectedOrg} (${data[selectedOrg].students.length})` : `Students at ${selectedOrg}`}
                        </h2>
                        {data[selectedOrg].students.length > 0 ? (
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Roll Number</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data[selectedOrg].students.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.firstName}</td>
                                            <td>{student.lastName}</td>
                                            <td style={{ fontFamily: 'monospace' }}>{student.rollno}</td>
                                            <td>{student.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-data">
                                No students found for this organization.
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-data">
                        Please select an organization from the dropdown above to view students.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganisationStudents;
