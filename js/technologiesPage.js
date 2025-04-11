/**
 * Technologies page module - renders the technologies data and visualizations
 */

// Render the technologies page
export function renderTechnologies(data) {
    if (!data) return;
    
    // Render technologies chart
    renderTechnologiesChart(data);

    
    // Render emerging technologies, vendors & products
    renderEmergingTechnologies(data);
    
    // Render technologies table
    renderTechnologiesTable(data);}

// Render the technologies chart
function renderTechnologiesChart(data) {
    const ctx = document.getElementById('technologies-chart');
    if (!ctx) return;
    
    // Sort technologies by average interest score
    let filteredTechnologies = [...data.technologies];
    filteredTechnologies.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
    // Take top 10 technologies
    const topTechnologies = filteredTechnologies.slice(0, 10);
    
    // Prepare data for the chart
    const chartData = {
        labels: topTechnologies.map(tech => tech.name),
        datasets: [
            {
                label: 'Strong Interest',
                data: topTechnologies.map(tech => tech.interestCounts['Sterke, concrete interesse']),
                backgroundColor: '#e74c3c',
                borderWidth: 1
            },
            {
                label: 'Reasonable Interest',
                data: topTechnologies.map(tech => tech.interestCounts['Redelijke interesse']),
                backgroundColor: '#3498db',
                borderWidth: 1
            },
            {
                label: 'Vague Interest',
                data: topTechnologies.map(tech => tech.interestCounts['Vage interesse']),
                backgroundColor: '#f39c12',
                borderWidth: 1
            },
            {
                label: 'Nothing Heard',
                data: topTechnologies.map(tech => tech.interestCounts['Niets over gehoord']),
                backgroundColor: '#95a5a6',
                borderWidth: 1
            }
        ]
    };
    
    // Create the chart
    if (window.technologiesChart) {
        window.technologiesChart.destroy();
    }
    
    window.technologiesChart = new Chart(ctx, {
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
                        text: 'Technologies & Concepts'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Technologies by Interest Level'
                },
                tooltip: {
                    mode: 'point',
                    intersect: true,
                    callbacks: {
                        title: function(context) {
                            // Get just the technology name without interest level
                            const techIndex = context[0].dataIndex;
                            return topTechnologies[techIndex].name;
                        },
                        label: function(context) {
                            // Get the interest level and count
                            const interestLevel = context.dataset.label;
                            return `${interestLevel}: ${context.raw}`;
                        },
                        afterLabel: function(context) {
                            // Get the technology and interest level
                            const techIndex = context.dataIndex;
                            const tech = topTechnologies[techIndex];
                            const interestLevel = context.dataset.label;
                            
                            // Map chart label to data interest level
                            const interestLevelMap = {
                                'Strong Interest': 'Sterke, concrete interesse',
                                'Reasonable Interest': 'Redelijke interesse',
                                'Vague Interest': 'Vage interesse',
                                'Nothing Heard': 'Niets over gehoord'
                            };
                            
                            const dataInterestLevel = interestLevelMap[interestLevel];
                            
                            // Get companies with this interest level for this technology
                            const companies = tech.companiesWithInterest[dataInterestLevel] || [];
                            
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

// Render emerging technologies, vendors & products section
function renderEmergingTechnologies(data) {
    const container = document.getElementById('emerging-tech-container');
    if (!container || !data.emergingTechVendorProducts) return;
    
    // Group items by company
    const itemsByCompany = {};
    data.emergingTechVendorProducts.forEach(item => {
        if (item.hasContent) {
            if (!itemsByCompany[item.company]) {
                itemsByCompany[item.company] = [];
            }
            itemsByCompany[item.company].push(item);
        }
    });
    
    // Create HTML for the items
    let itemsHTML = '';
    
    // Sort companies alphabetically
    const sortedCompanies = Object.keys(itemsByCompany).sort();
    
    sortedCompanies.forEach(company => {
        itemsHTML += `
            <div class="theme-company">
                <h4>${company}</h4>
                <ul>
        `;
        
        itemsByCompany[company].forEach(item => {
            itemsHTML += `
                <li>
                    <div class="theme-content">
                        <p><strong>${item.respondent}:</strong> ${item.text}</p>
                    </div>
                </li>
            `;
        });
        
        itemsHTML += `
                </ul>
            </div>
        `;
    });
    
    // Update the container
    container.innerHTML = itemsHTML;
}

// Render the technologies table
function renderTechnologiesTable(data) {
    const tableContainer = document.getElementById('technologies-table');
    if (!tableContainer) return;
    
    // Sort technologies by average interest score
    let filteredTechnologies = [...data.technologies];
    filteredTechnologies.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
    // Create table HTML
    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Technology / Concept</th>
                    <th>Strong Interest</th>
                    <th>Reasonable Interest</th>
                    <th>Vague Interest</th>
                    <th>Nothing Heard</th>
                    <th>Average Score</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTechnologies.map(tech => `
                    <tr>
                        <td>${tech.name}</td>
                        <td>${tech.interestCounts['Sterke, concrete interesse']} (${Math.round(tech.interestCounts['Sterke, concrete interesse'] / tech.totalResponses * 100)}%)</td>
                        <td>${tech.interestCounts['Redelijke interesse']} (${Math.round(tech.interestCounts['Redelijke interesse'] / tech.totalResponses * 100)}%)</td>
                        <td>${tech.interestCounts['Vage interesse']} (${Math.round(tech.interestCounts['Vage interesse'] / tech.totalResponses * 100)}%)</td>
                        <td>${tech.interestCounts['Niets over gehoord']} (${Math.round(tech.interestCounts['Niets over gehoord'] / tech.totalResponses * 100)}%)</td>
                        <td>${tech.averageInterestScore.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Update the table container
    tableContainer.innerHTML = tableHTML;
}
