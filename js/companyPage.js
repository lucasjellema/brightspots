/**
 * Company page module - renders company-specific responses
 */

// Render the company page with company selector and initial state
export function renderCompanyPage(data) {
    if (!data) return;
    
    // Populate company selector
    populateCompanySelector(data);
    
    // Set up event listener for company selection
    setupCompanySelector(data);
}

// Populate the company selector dropdown
function populateCompanySelector(data) {
    const companySelector = document.getElementById('company-selector');
    if (!companySelector) return;
    
    // Clear existing options except the first one
    while (companySelector.options.length > 1) {
        companySelector.remove(1);
    }
    
    // Get unique companies and sort alphabetically (case-insensitive)
    const companies = [...new Set(data.rawData.map(row => row['Jouw bedrijf']).filter(Boolean))]
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    
    // Add options for each company
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelector.appendChild(option);
    });
}

// Set up event listener for company selection
function setupCompanySelector(data) {
    const companySelector = document.getElementById('company-selector');
    if (!companySelector) return;
    
    companySelector.addEventListener('change', () => {
        const selectedCompany = companySelector.value;
        if (selectedCompany) {
            renderCompanyDetails(data, selectedCompany);
            renderCompanyResponses(data, selectedCompany);
        } else {
            // Clear company details if no company is selected
            clearCompanyDetails();
        }
    });
}

// Render company details
function renderCompanyDetails(data, companyName) {
    const companyDetails = document.getElementById('company-details');
    if (!companyDetails) return;
    
    // Filter responses for the selected company
    const companyResponses = data.rawData.filter(row => row['Jouw bedrijf'] === companyName);
    
    // Get respondent names
    const respondents = companyResponses.map(row => row['Jouw naam'] || row['Name'] || 'Anonymous').filter(Boolean);
    
    // Create HTML for company details
    let detailsHTML = `
        <div class="company-details">
            <h3>${companyName}</h3>
            <p><strong>Number of Respondents:</strong> ${companyResponses.length}</p>
            <div class="respondent-details">
                <h4>Survey Submissions:</h4>
                ${companyResponses.map(response => {
                    const respondentName = response['Jouw naam'] || 'Anonymous';
                    const submissionDate = response['Completion time'] || 'Unknown date';
                    return `<p><strong>${respondentName}:</strong> Submitted on ${submissionDate}</p>`;
                }).join('')}
            </div>
        </div>
        
        <div class="company-summary">
            <h4>New Help Requests and Focus Areas</h4>
            <div class="scrollable-text">
                ${companyResponses.map((row, index) => {
                    const question = row['newCustomerThemes'];
                    if (!question) return '';
                    const respondent = row['Jouw naam'] || row['Name'] || `Respondent ${index + 1}`;
                    return `<p><strong>${respondent}:</strong> ${question}</p>`;
                }).join('')}
            </div>
            
            <h4>Emerging Products, Suppliers and Technologies</h4>
            <div class="scrollable-text">
                ${companyResponses.map((row, index) => {
                    const tech = row['emergingTechVendorProduct'];
                    if (!tech) return '';
                    const respondent = row['Jouw naam'] || row['Name'] || `Respondent ${index + 1}`;
                    return `<p><strong>${respondent}:</strong> ${tech}</p>`;
                }).join('')}
            </div>
        </div>
    `;
    
    companyDetails.innerHTML = detailsHTML;
}

// Clear company details when no company is selected
function clearCompanyDetails() {
    const companyDetails = document.getElementById('company-details');
    if (companyDetails) {
        companyDetails.innerHTML = '<p>Select a company to view details.</p>';
    }
    
    const companyResponses = document.getElementById('company-responses');
    if (companyResponses) {
        companyResponses.innerHTML = '';
    }
}



// Render detailed company responses table
function renderCompanyResponses(data, companyName) {
    const tableContainer = document.getElementById('company-responses');
    if (!tableContainer) return;
    
    // Filter responses for the selected company
    const companyResponses = data.rawData.filter(row => row['Jouw bedrijf'] === companyName);
    
    if (companyResponses.length === 0) {
        tableContainer.innerHTML = '<p>No responses found for this company.</p>';
        return;
    }
    
    // Helper function to get interest level weight for sorting
    const getInterestWeight = (level) => {
        switch (level) {
            case 'Sterke, concrete interesse': return 4;
            case 'Redelijke interesse': return 3;
            case 'Vage interesse': return 2;
            case 'Niets over gehoord': return 1;
            default: return 0;
        }
    };
    
    // Create HTML for the free-form responses section
    let freeFormHTML = '';
    
    // Add free-form responses section if there are multiple respondents
    if (companyResponses.length > 1) {
        freeFormHTML = `
            <h4>All Respondents' Free-form Answers</h4>
            <table>
                <thead>
                    <tr>
                        <th>Respondent</th>
                        <th>New Help Requests & Focus Areas</th>
                        <th>Emerging Products & Technologies</th>
                    </tr>
                </thead>
                <tbody>
                    ${companyResponses.map((response, index) => {
                        const respondent = response['Jouw naam'] || response['Name'] || `Respondent ${index + 1}`;
                        const helpRequests = response['newCustomerThemes'] || '-';
                        const emergingTech = response['emergingTechVendorProduct'] || '-';
                        
                        return `
                            <tr>
                                <td><strong>${respondent}</strong></td>
                                <td>${helpRequests}</td>
                                <td>${emergingTech}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Create categories for the interest levels table
    const categories = {
        'Challenges & Themes': Object.keys(companyResponses[0]).filter(key => 
            key.startsWith('Wat zijn uitdagingen en thema\'s waar je klanten over hoort?')),
        'Technologies & Concepts': Object.keys(companyResponses[0]).filter(key => 
            key.startsWith('TechAndConcepts')),
        'Products & Suppliers': Object.keys(companyResponses[0]).filter(key => 
            key.startsWith('Wat zijn concrete producten en leveranciers waar je klanten over hoort?'))
    };
    
    // Create HTML for the interest levels table
    let interestTableHTML = '';
    
    // For each category, create a section in the table
    Object.entries(categories).forEach(([categoryName, columns]) => {
        interestTableHTML += `
            <h4>${categoryName}</h4>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Interest Level</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        // Create an array of items with their interest levels for sorting
        const items = columns.map(column => {
            // Extract the item name from the column header
            const itemName = column.split('.')[1] || column;
            
            // Get the interest level from the first response
            const interestLevel = companyResponses[0][column] || 'Not specified';
            
            return {
                name: itemName,
                level: interestLevel,
                weight: getInterestWeight(interestLevel)
            };
        });
        
        // Sort items by interest level (hottest to coolest)
        items.sort((a, b) => b.weight - a.weight);
        
        // Add rows to the table
        items.forEach(item => {
            interestTableHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td class="interest-level ${getInterestLevelClass(item.level)}">${item.level}</td>
                </tr>
            `;
        });
        
        interestTableHTML += `
                </tbody>
            </table>
        `;
    });
    
    // Combine both tables
    tableContainer.innerHTML = freeFormHTML + interestTableHTML;
}

// Helper function to get CSS class for interest level
function getInterestLevelClass(interestLevel) {
    switch (interestLevel) {
        case 'Sterke, concrete interesse':
            return 'strong-interest';
        case 'Redelijke interesse':
            return 'reasonable-interest';
        case 'Vage interesse':
            return 'vague-interest';
        case 'Niets over gehoord':
            return 'no-interest';
        default:
            return '';
    }
}
