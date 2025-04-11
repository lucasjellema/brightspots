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
                ${filteredChallenges.map(challenge => `
                    <tr>
                        <td>${challenge.name}</td>
                        <td>${challenge.interestCounts['Sterke, concrete interesse']} (${Math.round(challenge.interestCounts['Sterke, concrete interesse'] / challenge.totalResponses * 100)}%)</td>
                        <td>${challenge.interestCounts['Redelijke interesse']} (${Math.round(challenge.interestCounts['Redelijke interesse'] / challenge.totalResponses * 100)}%)</td>
                        <td>${challenge.interestCounts['Vage interesse']} (${Math.round(challenge.interestCounts['Vage interesse'] / challenge.totalResponses * 100)}%)</td>
                        <td>${challenge.interestCounts['Niets over gehoord']} (${Math.round(challenge.interestCounts['Niets over gehoord'] / challenge.totalResponses * 100)}%)</td>
                        <td>${challenge.averageInterestScore.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Update the table container
    tableContainer.innerHTML = tableHTML;
}
