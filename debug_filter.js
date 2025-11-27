const history = [
    { id: 1, name: "Amit Shah", roll: "MT2024001", org: "Google", ctc: "35.00 LPA", domain: "M.Tech CSE", year: 2024 },
    { id: 2, name: "Sara Smith", roll: "IMT2024055", org: "Microsoft", ctc: "42.50 LPA", domain: "iM.Tech ECE", year: 2024 },
    { id: 3, name: "Rahul Verma", roll: "MT2024012", org: "Amazon", ctc: "28.00 LPA", domain: "M.Tech CSE", year: 2023 },
    { id: 4, name: "Priya Sharma", roll: "IMT2023022", org: "Infosys", ctc: "12.00 LPA", domain: "iM.Tech ECE", year: 2023 },
    { id: 5, name: "Vikas Kumar", roll: "MT2024033", org: "Google", ctc: "38.00 LPA", domain: "M.Tech CSE", year: 2024 },
];

const testFilter = (filters) => {
    console.log("Testing filters:", filters);
    const filtered = history.filter(record => {
        const yearMatch = filters.year === '' || record.year === parseInt(filters.year);
        const domainMatch = filters.domain === '' || record.domain.includes(filters.domain);
        const orgMatch = filters.organization === '' || record.org.includes(filters.organization);

        // console.log(`Record ${record.id}: Year=${yearMatch}, Domain=${domainMatch}, Org=${orgMatch}`);
        return yearMatch && domainMatch && orgMatch;
    });
    console.log("Result count:", filtered.length);
    if (filtered.length === 0) console.log("Result: []");
    else console.log("Result IDs:", filtered.map(r => r.id));
    console.log("---");
};

// Test Case 1: No filters (Should be 5)
testFilter({ year: '', domain: '', organization: '' });

// Test Case 2: Filter by Year 2024 (Should be 3)
testFilter({ year: '2024', domain: '', organization: '' });

// Test Case 3: Filter by Year 2025 (Should be 0)
testFilter({ year: '2025', domain: '', organization: '' });

// Test Case 4: Filter by Domain 'M.Tech CSE' (Should be 3)
testFilter({ year: '', domain: 'M.Tech CSE', organization: '' });

// Test Case 5: Filter by Org 'Google' (Should be 2)
testFilter({ year: '', organization: 'Google', domain: '' });

// Test Case 6: Filter by Org 'NonExistent' (Should be 0)
testFilter({ year: '', organization: 'NonExistent', domain: '' });
