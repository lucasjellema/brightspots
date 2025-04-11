/**
 * Overview page module - renders the main dashboard and overview charts
 */
import { renderWordCloud } from './wordCloud.js';

// Render the overview page with survey summary data
export function renderOverview(data) {
    if (!data) return;
    
    // Update metrics
    updateMetrics(data);
    
    // Render top challenges chart
    renderTopChallengesChart(data);
    
    // Render word cloud for customer themes
    renderWordCloud(data);
    
    // Render new customer themes
    renderNewCustomerThemes(data);
    
    // Render emerging tech/vendor/product data
    renderEmergingTechVendorProducts(data);
}

// Update the metrics on the overview page
function updateMetrics(data) {
    // Update total responses
    const totalResponsesElement = document.getElementById('total-responses');
    if (totalResponsesElement) {
        totalResponsesElement.textContent = data.totalResponses;
    }
    
    // Update companies count
    const companiesCountElement = document.getElementById('companies-count');
    if (companiesCountElement) {
        companiesCountElement.textContent = data.companies.length;
    }
    
    // Update survey period
    const surveyPeriodElement = document.getElementById('survey-period');
    if (surveyPeriodElement) {
        const formatDate = (date) => {
            if (!date) return 'Unknown';
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        };
        
        // Only show the period if we have valid dates
        if (data.surveyPeriod.start && data.surveyPeriod.end) {
            surveyPeriodElement.textContent = `${formatDate(data.surveyPeriod.start)} - ${formatDate(data.surveyPeriod.end)}`;
        } else {
            // Remove the survey period section if dates are invalid
            const surveyPeriodSection = document.querySelector('.metric:nth-child(3)');
            if (surveyPeriodSection) {
                surveyPeriodSection.style.display = 'none';
            }
        }
    }
}

// Render new customer themes section
function renderNewCustomerThemes(data) {
    const container = document.querySelector('#overview .chart-container:nth-last-child(2)');
    if (!container) return;
    
    // Check if we have new customer themes data
    if (!data.newCustomerThemes || data.newCustomerThemes.length === 0) {
        container.innerHTML = '<h3>New Customer Themes</h3><p>No data available</p>';
        return;
    }
    
    // Create HTML for the new customer themes
    let themesHTML = `
        <h3>New Customer Themes</h3>
        <div class="themes-container">
    `;
    
    // Group themes by company
    const themesByCompany = {};
    data.newCustomerThemes.forEach(theme => {
        if (!themesByCompany[theme.company]) {
            themesByCompany[theme.company] = [];
        }
        themesByCompany[theme.company].push(theme);
    });
    
    // Add each company's themes
    Object.entries(themesByCompany).forEach(([company, themes]) => {
        themesHTML += `
            <div class="theme-group">
                <h4>${company}</h4>
                <ul>
                    ${themes.map(theme => `
                        <li>
                            <strong>${theme.respondent}:</strong> ${theme.text}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    themesHTML += '</div>';
    
    // Update the container
    container.innerHTML = themesHTML;
}

// Render emerging tech/vendor/product section
function renderEmergingTechVendorProducts(data) {
    const container = document.querySelector('#overview .chart-container:last-child');
    if (!container) return;
    
    // Check if we have emerging tech data
    if (!data.emergingTechVendorProducts || data.emergingTechVendorProducts.length === 0) {
        container.innerHTML = '<h3>Emerging Technologies, Vendors & Products</h3><p>No data available</p>';
        return;
    }
    
    // Create HTML for the emerging tech data
    let techHTML = `
        <h3>Emerging Technologies, Vendors & Products</h3>
        <div class="themes-container">
    `;
    
    // Group by company
    const techByCompany = {};
    data.emergingTechVendorProducts.forEach(tech => {
        if (!techByCompany[tech.company]) {
            techByCompany[tech.company] = [];
        }
        techByCompany[tech.company].push(tech);
    });
    
    // Add each company's tech data
    Object.entries(techByCompany).forEach(([company, techItems]) => {
        techHTML += `
            <div class="theme-group">
                <h4>${company}</h4>
                <ul>
                    ${techItems.map(tech => `
                        <li>
                            <strong>${tech.respondent}:</strong> ${tech.text}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    });
    
    techHTML += '</div>';
    
    // Update the container
    container.innerHTML = techHTML;
}

// Render the top challenges chart
function renderTopChallengesChart(data) {
    const ctx = document.getElementById('top-challenges-chart');
    if (!ctx) return;
    
    // Get top 5 challenges by average interest score
    const topChallenges = data.challenges.slice(0, 5);
    
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
    if (window.overviewChart) {
        window.overviewChart.destroy();
    }
    
    window.overviewChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Challenges'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Responses'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 5 Challenges by Interest Level'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
