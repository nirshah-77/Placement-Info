import { useState } from 'react';

const PlacementHistory = () => {
  // 1. Mock Data: Recent Placements (The main table)
  const [history] = useState([
    { id: 1, name: "Amit Shah", roll: "MT2024001", org: "Google", ctc: "35.00 LPA", domain: "M.Tech CSE", year: 2024 },
    { id: 2, name: "Sara Smith", roll: "IMT2024055", org: "Microsoft", ctc: "42.50 LPA", domain: "iM.Tech ECE", year: 2024 },
    { id: 3, name: "Rahul Verma", roll: "MT2024012", org: "Amazon", ctc: "28.00 LPA", domain: "M.Tech CSE", year: 2023 },
    { id: 4, name: "Priya Sharma", roll: "IMT2023022", org: "Infosys", ctc: "12.00 LPA", domain: "iM.Tech ECE", year: 2023 },
    { id: 5, name: "Vikas Kumar", roll: "MT2024033", org: "Google", ctc: "38.00 LPA", domain: "M.Tech CSE", year: 2024 },
  ]);

  // 2. Mock Data: Alumni Network (Old students working there)
  const [alumniData] = useState([
    { id: 101, name: "Rohan Das", gradYear: 2020, org: "Google", position: "Senior Software Engineer", email: "rohan@google.com" },
    { id: 102, name: "Meera Iyer", gradYear: 2019, org: "Google", position: "Tech Lead", email: "meera@google.com" },
    { id: 103, name: "John Doe", gradYear: 2021, org: "Microsoft", position: "SDE II", email: "john@microsoft.com" },
  ]);

  // State for filters and modal
  const [filters, setFilters] = useState({ year: '', domain: '', organization: '' });
  const [selectedOrg, setSelectedOrg] = useState(null); // Stores the string name of the org (e.g., "Google")

  // Handle Filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    console.log(`Filter Changed: ${name} = ${value}`);
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredHistory = history.filter(record => {
    // console.log(`Filtering: Year=${filters.year}, Domain=${filters.domain}, Org=${filters.organization}`);
    return (
      (filters.year === '' || record.year.toString() === filters.year) &&
      (filters.domain === '' || record.domain.includes(filters.domain)) &&
      (filters.organization === '' || record.org.includes(filters.organization))
    );
  });

  // Dropdown lists
  const uniqueYears = [...new Set(history.map(item => item.year))].sort((a, b) => b - a);
  const uniqueDomains = [...new Set(history.map(item => item.domain))].sort();
  const uniqueOrganizations = [...new Set(history.map(item => item.org))].sort();

  // -- DATA FOR MODAL --
  // Filter history for the *selected* Org
  const modalPlacementHistory = history.filter(r => r.org === selectedOrg);
  // Filter alumni for the *selected* Org
  const modalAlumni = alumniData.filter(a => a.org === selectedOrg);

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Placement Records</h1>
          <p style={{ margin: '5px 0 0', color: 'var(--text-secondary)' }}>Manage and view student placement data</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline">Export CSV</button>
          <button className="btn btn-primary">+ Add Record</button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters">
        <span style={{ fontWeight: '500', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>FILTER BY:</span>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="">Year: All</option>
          {uniqueYears.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
        <select name="domain" value={filters.domain} onChange={handleFilterChange}>
          <option value="">Domain: All</option>
          {uniqueDomains.map(domain => <option key={domain} value={domain}>{domain}</option>)}
        </select>
        <select name="organization" value={filters.organization} onChange={handleFilterChange}>
          <option value="">Org: All</option>
          {uniqueOrganizations.map(org => <option key={org} value={org}>{org}</option>)}
        </select>
        <button
          className="btn btn-outline"
          onClick={() => setFilters({ year: '', domain: '', organization: '' })}
          style={{ marginLeft: 'auto', fontSize: '0.8rem' }}
        >
          Clear Filters
        </button>
      </div>

      {/* Main Data Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Domain</th>
              <th>Organization</th>
              <th>CTC (Package)</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((record) => (
                <tr key={record.id}>
                  <td style={{ fontWeight: '500' }}>{record.name}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{record.roll}</td>
                  <td><span className="status-badge badge-blue">{record.domain}</span></td>
                  <td>
                    <span
                      className="org-link"
                      onClick={() => setSelectedOrg(record.org)}
                    >
                      {record.org}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#166534' }}>{record.ctc}</td>
                  <td>{record.year}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fda4af', borderRadius: '8px' }}>
                  <strong>No records found matching current filters.</strong>
                  <br />
                  Try adjusting your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- ORGANIZATION DETAIL MODAL --- */}
      {selectedOrg && (
        <div className="modal-backdrop" onClick={() => setSelectedOrg(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedOrg}</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Organization Overview</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedOrg(null)}>&times;</button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">

              {/* Section 1: Placement History */}
              <div className="section-title">Recent Placements (History)</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Domain</th>
                      <th>Package</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modalPlacementHistory.map(p => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.domain}</td>
                        <td style={{ color: '#166534', fontWeight: '500' }}>{p.ctc}</td>
                        <td>{p.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Section 2: Alumni Network */}
              <div className="section-title" style={{ marginTop: '2rem' }}>Alumni Network (Currently Working)</div>
              {modalAlumni.length > 0 ? (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Alumni Name</th>
                        <th>Current Position</th>
                        <th>Graduation Year</th>
                        <th>Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalAlumni.map(a => (
                        <tr key={a.id}>
                          <td style={{ fontWeight: '500' }}>{a.name}</td>
                          <td>{a.position}</td>
                          <td><span className="status-badge badge-green">Batch of {a.gradYear}</span></td>
                          <td>
                            <a href={`mailto:${a.email}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                              Email
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  No alumni contact information available for this organization.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementHistory;
