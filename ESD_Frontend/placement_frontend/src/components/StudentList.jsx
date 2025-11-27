import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../services/studentService';
import '../styles/StudentList.css';

function StudentList({ onStatsCalculated, isHidden }) {
  const [allStudentsDetailed, setAllStudentsDetailed] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false);

  // Search and filter states
  const [searchKeyword, setSearchKeyword] = useState('');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [organisationFilter, setOrganisationFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [organisations, setOrganisations] = useState([]);
  const [years, setYears] = useState([]);
  const [domains, setDomains] = useState([]);

  // Sorting state - default to A-Z
  const [sortOrder, setSortOrder] = useState('asc');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // CTC Modal State
  const [showCtcModal, setShowCtcModal] = useState(false);
  const [selectedCtc, setSelectedCtc] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedStudentName, setSelectedStudentName] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError('');
        // Fetch all students with detailed 8-column structure
        // Empty string triggers the trim(:keyword) = '' condition in backend
        const data = await studentService.fetchFilteredStudents('');
        setAllStudentsDetailed(data);
        extractFilterOptions(data);

        // Calculate Stats
        if (onStatsCalculated) {
          calculateAndSendStats(data);
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        let errorMessage = 'Failed to fetch students. Please try again.';

        if (err && typeof err === 'object') {
          if (err.response && err.response.data && err.response.data.message) {
            errorMessage = err.response.data.message;
          } else if (err.message) {
            errorMessage = err.message;
          } else if (typeof err.toString === 'function') {
            errorMessage = err.toString();
          }
        }

        if (errorMessage.includes('Unauthorized') || errorMessage.includes('JWT') || errorMessage.includes('token')) {
          // If hidden (guest), we might expect unauthorized if the backend blocks it.
          // But we fixed the backend to allow guests.
          // However, if the fetch fails for other reasons, handle it.
          if (!isHidden) {
            setError('Please log in to view students.');
            navigate('/login');
          }
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [navigate, isHidden]); // Add isHidden to dependency if needed, though mostly independent

  // ... (calculation functions remain same)



  // ... (rest of render)

  const calculateAndSendStats = (data) => {
    if (!data || data.length === 0) return;

    // 0. Identify Current Year (Max Graduation Year)
    const years = data.map(s => s[5]);
    const currentYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

    // Filter data for Current Year
    const currentYearData = data.filter(s => s[5] === currentYear);
    const placedCurrentYear = currentYearData.filter(s => s[7] === 'Placed');

    // 1. Total Placed (Current Year)
    const totalPlaced = placedCurrentYear.length;

    // 2. Average Package (Current Year)
    const validPackages = placedCurrentYear
      .map(s => parseFloat(s[8]))
      .filter(ctc => !isNaN(ctc) && ctc > 0);

    const avgPackage = validPackages.length > 0
      ? (validPackages.reduce((a, b) => a + b, 0) / validPackages.length).toFixed(2)
      : 0;

    // 3. Top Recruiter (Current Year - Highest Total CTC Value)
    const orgValue = {};
    placedCurrentYear.forEach(s => {
      const org = s[3];
      const ctc = parseFloat(s[8] || 0);
      if (org && ctc > 0) {
        orgValue[org] = (orgValue[org] || 0) + ctc;
      }
    });

    let topRecruiter = '-';
    let maxValue = 0;
    Object.entries(orgValue).forEach(([org, totalCtc]) => {
      if (totalCtc > maxValue) {
        maxValue = totalCtc;
        topRecruiter = org;
      }
    });

    // 4. Placement Rate (Current Year)
    const placementRate = currentYearData.length > 0
      ? Math.round((totalPlaced / currentYearData.length) * 100)
      : 0;

    // 5. Historical Data (Group by Year)
    const history = {};
    data.forEach(s => {
      const year = s[5]; // Graduation Year
      if (!history[year]) {
        history[year] = { total: 0, placed: 0, packages: [] };
      }
      history[year].total += 1;
      if (s[7] === 'Placed') {
        history[year].placed += 1;
        const ctc = parseFloat(s[8]);
        if (!isNaN(ctc) && ctc > 0) {
          history[year].packages.push(ctc);
        }
      }
    });

    const historicalData = Object.keys(history).map(year => {
      const h = history[year];
      const avgPkg = h.packages.length > 0
        ? (h.packages.reduce((a, b) => a + b, 0) / h.packages.length)
        : 0;
      return {
        year: year,
        totalPlaced: h.placed,
        avgPackage: parseFloat(avgPkg.toFixed(2)),
        placementRate: h.total > 0 ? Math.round((h.placed / h.total) * 100) : 0
      };
    }).sort((a, b) => a.year - b.year);

    onStatsCalculated({
      totalPlaced,
      avgPackage,
      topRecruiter,
      maxValue: maxValue.toFixed(2), // Send formatted value
      placementRate,
      historicalData
    });
  };

  // Extract unique values for filter dropdowns
  const extractFilterOptions = (data) => {
    if (!data || data.length === 0) return;

    // Extract unique organisations (from both placement and alumni orgs)
    const uniqueOrgs = new Set();
    // Extract unique years
    const uniqueYears = new Set();
    // Extract unique domains/programs
    const uniqueDomains = new Set();

    data.forEach(student => {
      // student[3] = placement org, student[4] = alumni org
      if (student[3]) uniqueOrgs.add(student[3]);
      if (student[4]) uniqueOrgs.add(student[4]);

      // student[5] = graduation year
      if (student[5]) uniqueYears.add(student[5]);

      // student[2] = program/domain
      if (student[2]) uniqueDomains.add(student[2]);
    });

    setOrganisations(Array.from(uniqueOrgs).sort());
    setYears(Array.from(uniqueYears).sort((a, b) => b - a)); // Most recent first
    setDomains(Array.from(uniqueDomains).sort());
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setFilteredStudents([]);
      setDisplayedStudents([]);
      return;
    }

    try {
      const data = await studentService.fetchFilteredStudents(searchKeyword);
      setFilteredStudents(data);
      setDisplayedStudents(data);
      setHasAppliedFilters(false); // Reset manual filters as search takes precedence
      setError('');
    } catch (err) {
      console.error('Error searching students:', err);
      setError('No students found matching your search.');
      if (err.toString().includes('Unauthorized')) {
        navigate('/login');
      }
    }
  };

  const applyFilters = async () => {
    // Start with either search results or all students
    let dataToFilter = searchKeyword.trim() ? filteredStudents : allStudentsDetailed;

    let results = dataToFilter;

    // Apply placement filter
    if (placementFilter !== 'all') {
      results = results.filter(student => {
        const status = student[7]; // Placement status is at index 7
        return placementFilter === 'placed' ? status === 'Placed' : status === 'Unplaced';
      });
    }



    // Apply organisation filter (matches placement OR alumni org)
    if (organisationFilter !== 'all') {
      results = results.filter(student => {
        const placementOrg = student[3];
        const alumniOrg = student[4];
        return placementOrg === organisationFilter || alumniOrg === organisationFilter;
      });
    }

    // Apply year filter
    if (yearFilter !== 'all') {
      results = results.filter(student => {
        const year = student[5];
        return String(year) === String(yearFilter);
      });
    }

    // Apply domain/program filter
    if (domainFilter !== 'all') {
      results = results.filter(student => {
        const program = student[2];
        return program === domainFilter;
      });
    }

    // Only update displayed students, NOT filteredStudents
    // This preserves the search results for subsequent filter operations
    setDisplayedStudents(results);
    setHasAppliedFilters(true);
    setError('');
  };

  const resetFilters = () => {
    setSearchKeyword('');
    setPlacementFilter('all');
    setOrganisationFilter('all');
    setYearFilter('all');
    setDomainFilter('all');
    setFilteredStudents([]);
    setDisplayedStudents([]);
    setHasAppliedFilters(false);
    setSortOrder('asc');
    setError('');
  };

  // Sorting function - always sorts by first name (index 0 in 8-field structure)
  const sortStudents = (studentsToSort, order) => {
    if (!studentsToSort || studentsToSort.length === 0) {
      return [];
    }

    return [...studentsToSort].sort((a, b) => {
      if (order === 'ctc-desc' || order === 'ctc-asc') {
        const ctcA = parseFloat(a[8] || 0);
        const ctcB = parseFloat(b[8] || 0);
        return order === 'ctc-desc' ? ctcB - ctcA : ctcA - ctcB;
      }

      // Default: Sort by Name
      const nameA = String(a[0] || '').toLowerCase();
      const nameB = String(b[0] || '').toLowerCase();

      if (order === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  };

  const handleOrgClick = (student) => {
    const org = student[3];
    const ctc = student[8]; // CTC is at index 8
    const name = `${student[0]} ${student[1]}`;

    if (org) {
      setSelectedOrg(org);
      setSelectedCtc(ctc || 0); // Default to 0 if missing
      setSelectedStudentName(name);
      setShowCtcModal(true);
    }
  };

  // If hidden, return null (but useEffect still runs and functions are defined)
  if (isHidden) {
    return null;
  }

  // Get data to display
  const getDataToDisplay = () => {
    if (hasAppliedFilters) {
      return sortStudents(displayedStudents, sortOrder);
    }
    if (searchKeyword.trim()) {
      return sortStudents(filteredStudents, sortOrder);
    }
    return sortStudents(allStudentsDetailed, sortOrder);
  };

  const currentData = getDataToDisplay();
  const totalItems = currentData.length;

  if (loading) {
    return (
      <div className="student-list-container">
        <h1 className="header">IIITB Placement History</h1>
        <div className="no-data">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <h1 className="header">IIITB Placement History</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, company, program, year..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Placement Status:</label>
          <select
            className="filter-dropdown"
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="placed">Placed</option>
            <option value="unplaced">Unplaced</option>
          </select>
        </div>



        <div className="filter-group">
          <label>Organisation:</label>
          <select
            className="filter-dropdown"
            value={organisationFilter}
            onChange={(e) => setOrganisationFilter(e.target.value)}
          >
            <option value="all">All</option>
            {organisations.map(org => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Year:</label>
          <select
            className="filter-dropdown"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Domain/Program:</label>
          <select
            className="filter-dropdown"
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
          >
            <option value="all">All</option>
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <button className="filter-button" onClick={applyFilters}>
          Apply Filters
        </button>

        <button className="reset-button" onClick={resetFilters}>
          Reset
        </button>
      </div>

      {/* Sorting Controls */}
      <div className="controls-section">
        <div className="sort-group">
          <label>Sort by Name:</label>
          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Name (A-Z)</option>
            <option value="desc">Name (Z-A)</option>
            <option value="ctc-desc">CTC (High to Low)</option>
            <option value="ctc-asc">CTC (Low to High)</option>
          </select>
        </div>

        <div className="pagination-info">
          Total: {totalItems} students
        </div>
      </div>

      {/* Display Results */}
      {currentData.length > 0 ? (
        <div>
          <h2 className="section-title">
            {displayedStudents.length > 0 ? `Results (${totalItems})` : 'All Students'}
          </h2>
          <table className="students-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Program</th>
                <th>Placement Org</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((student, index) => (
                <tr key={index}>
                  <td>{student[0]}</td>
                  <td>{student[1]}</td>
                  <td>{student[2]}</td>
                  <td>
                    {student[3] ? (
                      <span
                        onClick={() => handleOrgClick(student)}
                        style={{
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          fontWeight: '500',
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px'
                        }}
                        title="Click to view CTC"
                      >
                        {student[3]}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{student[5]}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: student[7] === 'Placed' ? '#dcfce7' : '#f1f5f9',
                      color: student[7] === 'Placed' ? '#166534' : '#64748b',
                    }}>
                      {student[7]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !error && (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fda4af', borderRadius: '8px', marginTop: '1rem' }}>
            <strong>No students found matching your criteria.</strong>
            <br />
            Try adjusting your filters or search keyword.
          </div>
        )
      )}
      {/* CTC Modal */}
      {showCtcModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setShowCtcModal(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>Placement Details</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>Student</p>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>{selectedStudentName}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>Organization</p>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem', color: 'var(--primary)' }}>{selectedOrg}</p>
            </div>

            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#166534', fontSize: '0.9rem', fontWeight: '600' }}>CTC Offered</p>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '1.5rem', color: '#15803d' }}>
                {selectedCtc && parseFloat(selectedCtc) > 0
                  ? `${parseFloat(selectedCtc).toLocaleString()} LPA`
                  : 'Not Available'}
              </p>
            </div>

            <button
              onClick={() => setShowCtcModal(false)}
              style={{
                marginTop: '1.5rem',
                width: '100%',
                padding: '10px',
                background: 'var(--text-main)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
