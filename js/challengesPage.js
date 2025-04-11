/**
 * Challenges page module - renders the challenges data and visualizations
 */

// Render the challenges page
export function renderChallenges(data) {
    if (!data) return;
    
    // Render challenges chart
    renderChallengesChart(data);

    // Render new customer themes
    renderNewCustomerThemes(data);
    
    // Render challenges table
    renderChallengesTable(data);
    }

// Render the challenges chart
function renderChallengesChart(data) {
    const ctx = document.getElementById('challenges-chart');
    if (!ctx) return;
    
    // Sort challenges by average interest score
    let filteredChallenges = [...data.challenges];
    filteredChallenges.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
    // Take top 10 challenges
    const topChallenges = filteredChallenges.slice(0, 10);
    
    // Prepare data for the chart
    const chartData = {
        labels: topChallenges.map(challenge => challenge.name),
        datasets: [
            {
                label: 'Strong Interest',
                data: topChallenges.map(challenge => challenge.interestCounts['Sterke, concrete interesse']),
                backgroundColor: '#e74c3c',
                borderWidth: 1
            },
            {
                label: 'Reasonable Interest',
                data: topChallenges.map(challenge => challenge.interestCounts['Redelijke interesse']),
                backgroundColor: '#3498db',
                borderWidth: 1
            },
            {
                label: 'Vague Interest',
                data: topChallenges.map(challenge => challenge.interestCounts['Vage interesse']),
                backgroundColor: '#f39c12',
                borderWidth: 1
            },
            {
                label: 'Nothing Heard',
                data: topChallenges.map(challenge => challenge.interestCounts['Niets over gehoord']),
                backgroundColor: '#95a5a6',
                borderWidth: 1
            }
        ]
    };
    
    // Create the chart
    if (window.challengesChart) {
        window.challengesChart.destroy();
    }
    
    window.challengesChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',  // Horizontal bar chart
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Responses'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Challenges'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Challenges by Interest Level'
                },
                tooltip: {
                    mode: 'point',
                    intersect: true,
                    callbacks: {
                        title: function(context) {
                            // Get just the challenge name without interest level
                            const challengeIndex = context[0].dataIndex;
                            return topChallenges[challengeIndex].name;
                        },
                        label: function(context) {
                            // Get the interest level and count
                            const interestLevel = context.dataset.label;
                            return `${interestLevel}: ${context.raw}`;
                        },
                        afterLabel: function(context) {
                            // Get the challenge and interest level
                            const challengeIndex = context.dataIndex;
                            const challenge = topChallenges[challengeIndex];
                            const interestLevel = context.dataset.label;
                            
                            // Map chart label to data interest level
                            const interestLevelMap = {
                                'Strong Interest': 'Sterke, concrete interesse',
                                'Reasonable Interest': 'Redelijke interesse',
                                'Vague Interest': 'Vage interesse',
                                'Nothing Heard': 'Niets over gehoord'
                            };
                            
                            const dataInterestLevel = interestLevelMap[interestLevel];
                            
                            // Get companies with this interest level for this challenge
                            const companies = challenge.companiesWithInterest[dataInterestLevel] || [];
                            
                            if (companies.length === 0) {
                                return [];
                            }
                            
                            // Return a formatted list of companies
                            return [
                                '\nCompanies:',
                                ...companies.map(company => `- ${company}`)
                            ];
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Render new customer themes section
function renderNewCustomerThemes(data) {
    const container = document.getElementById('customer-themes-container');
    if (!container || !data.newCustomerThemes) return;
    
    // Group themes by company
    const themesByCompany = {};
    data.newCustomerThemes.forEach(item => {
        if (item.hasContent) {
            if (!themesByCompany[item.company]) {
                themesByCompany[item.company] = [];
            }
            themesByCompany[item.company].push(item);
        }
    });
    
    // Create HTML for the themes
    let themesHTML = '';
    
    // Sort companies alphabetically
    const sortedCompanies = Object.keys(themesByCompany).sort();
    
    sortedCompanies.forEach(company => {
        themesHTML += `
            <div class="theme-company">
                <h4>${company}</h4>
                <ul>
        `;
        
        themesByCompany[company].forEach(item => {
            themesHTML += `
                <li>
                    <div class="theme-content">
                        <p><strong>${item.respondent}:</strong> ${item.text}</p>
                    </div>
                </li>
            `;
        });
        
        themesHTML += `
                </ul>
            </div>
        `;
    });
    
    // Update the container
    container.innerHTML = themesHTML;
}

// Render the challenges table
function renderChallengesTable(data) {
    const tableContainer = document.getElementById('challenges-table');
    if (!tableContainer) return;
    
    // Sort challenges by average interest score
    let filteredChallenges = [...data.challenges];
    filteredChallenges.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
    // Helper function to store company data in a data attribute
    function storeCompanyData(companies) {
        if (!companies || companies.length === 0) {
            return 'data-companies="[]"';
        }
        
        // Store the company names as a JSON string in a data attribute
        return `data-companies='${JSON.stringify(companies)}'`;  
    }
    
    // Create table HTML
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Challenge</th>
                    <th>Strong Interest</th>
                    <th>Reasonable Interest</th>
                    <th>Vague Interest</th>
                    <th>Nothing Heard</th>
                    <th>Average Score</th>
                </tr>
            </thead>
            <tbody>
                ${filteredChallenges.map(challenge => {
                    // Get companies for each interest level
                    const strongInterestCompanies = challenge.companiesWithInterest['Sterke, concrete interesse'] || [];
                    const reasonableInterestCompanies = challenge.companiesWithInterest['Redelijke interesse'] || [];
                    const vagueInterestCompanies = challenge.companiesWithInterest['Vage interesse'] || [];
                    const nothingHeardCompanies = challenge.companiesWithInterest['Niets over gehoord'] || [];
                    
                    return `
                    <tr>
                        <td>${challenge.name}</td>
                        <td>
                            <span class="percentage-tooltip" ${storeCompanyData(strongInterestCompanies)}>
                            ${challenge.interestCounts['Sterke, concrete interesse']} 
                                (${Math.round(challenge.interestCounts['Sterke, concrete interesse'] / challenge.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            <span class="percentage-tooltip" ${storeCompanyData(reasonableInterestCompanies)}>
                            ${challenge.interestCounts['Redelijke interesse']} 
                                (${Math.round(challenge.interestCounts['Redelijke interesse'] / challenge.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            <span class="percentage-tooltip" ${storeCompanyData(vagueInterestCompanies)}>
                            ${challenge.interestCounts['Vage interesse']} 
                                (${Math.round(challenge.interestCounts['Vage interesse'] / challenge.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            <span class="percentage-tooltip" ${storeCompanyData(nothingHeardCompanies)}>
                            ${challenge.interestCounts['Niets over gehoord']} 
                                (${Math.round(challenge.interestCounts['Niets over gehoord'] / challenge.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>${challenge.averageInterestScore.toFixed(2)}</td>
                    </tr>
                `}).join('')}
            </tbody>
        </table>
    `;
    
    // Update the table container
    tableContainer.innerHTML = tableHTML;
    
    // Initialize tooltips and add click handlers for company links
    initializeTooltips(tableContainer);
}

// Initialize custom tooltips and add click handlers for company links
function initializeTooltips(container) {
    // Find all elements with company data
    const tooltipTriggers = container.querySelectorAll('.percentage-tooltip');
    
    // Create tooltip element if it doesn't exist
    let tooltipEl = document.getElementById('custom-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'custom-tooltip';
        tooltipEl.className = 'custom-tooltip';
        document.body.appendChild(tooltipEl);
        
        // Add event listener to the tooltip itself to keep it visible when hovered
        tooltipEl.addEventListener('mouseenter', () => {
            tooltipEl.classList.add('active');
        });
        
        tooltipEl.addEventListener('mouseleave', () => {
            tooltipEl.classList.remove('active');
            tooltipEl.classList.remove('visible');
        });
    }
    
    // Track the current active trigger
    let currentTrigger = null;
    
    // Add event listeners to all tooltip triggers
    tooltipTriggers.forEach(trigger => {
        // Show tooltip on mouseenter
        trigger.addEventListener('mouseenter', (e) => {
            const tooltip = e.target.closest('.percentage-tooltip');
            if (!tooltip) return;
            
            // Set current trigger
            currentTrigger = tooltip;
            
            // Get companies data
            const companiesData = tooltip.getAttribute('data-companies');
            if (!companiesData) return;
            
            try {
                // Parse the JSON data
                const companies = JSON.parse(companiesData);
                
                if (companies.length === 0) {
                    tooltipEl.innerHTML = '<p>No companies</p>';
                } else {
                    // Create HTML for clickable company links
                    const linksHTML = companies.map(company => 
                        `<a href="#" class="company-link" data-company="${company}">${company}</a>`
                    ).join('');
                    
                    tooltipEl.innerHTML = linksHTML;
                }
                
                // Position tooltip
                const rect = tooltip.getBoundingClientRect();
                tooltipEl.style.top = `${window.scrollY + rect.bottom + 5}px`;
                tooltipEl.style.left = `${window.scrollX + rect.left}px`;
                
                // Show tooltip
                tooltipEl.classList.add('visible');
                
                // Add click handlers to company links
                const companyLinks = tooltipEl.querySelectorAll('.company-link');
                companyLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const company = link.getAttribute('data-company');
                        if (company) {
                            // Hide tooltip before navigating
                            tooltipEl.classList.remove('visible');
                            tooltipEl.classList.remove('active');
                            
                            // Navigate to company page and select the company
                            navigateToCompanyPage(company);
                        }
                    });
                });
            } catch (error) {
                console.error('Error parsing companies data:', error);
            }
        });
        
        // When leaving the trigger, check if we're moving to the tooltip
        trigger.addEventListener('mouseleave', () => {
            // Only hide if not moving to the tooltip itself
            setTimeout(() => {
                if (!tooltipEl.classList.contains('active')) {
                    tooltipEl.classList.remove('visible');
                }
            }, 100); // Small delay to allow moving to tooltip
        });
    });
}

// Navigate to company page and select the specified company
function navigateToCompanyPage(company) {
    // Find the company page nav link - it's in the main-nav and has data-page="company"
    const companyNavLink = document.querySelector('#main-nav a[data-page="company"]');
    if (!companyNavLink) {
        console.error('Company page navigation link not found');
        return;
    }
    
    // Simulate a click on the company page nav link
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    companyNavLink.dispatchEvent(clickEvent);
    
    // Select the company in the dropdown after a short delay
    setTimeout(() => {
        const companySelector = document.getElementById('company-selector');
        if (!companySelector) {
            console.error('Company selector not found');
            return;
        }
        
        // Find the option with the matching company name
        let found = false;
        for (let i = 0; i < companySelector.options.length; i++) {
            if (companySelector.options[i].text === company) {
                companySelector.selectedIndex = i;
                found = true;
                
                // Trigger change event to update the company view
                const changeEvent = new Event('change', {
                    bubbles: true,
                    cancelable: true
                });
                companySelector.dispatchEvent(changeEvent);
                break;
            }
        }
        
        if (!found) {
            console.warn(`Company "${company}" not found in selector options`);
        }
    }, 300); // Increased delay to ensure the company page is fully loaded
}
