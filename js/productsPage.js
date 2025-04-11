/**
 * Products page module - renders the products data and visualizations
 */

// Render the products page
export function renderProducts(data) {
    if (!data) return;
    
    // Render products chart
    renderProductsChart(data);
    
    // Render products table
    renderProductsTable(data);
}

// Render the products chart
function renderProductsChart(data) {
    const ctx = document.getElementById('products-chart');
    if (!ctx) return;
    
    // Sort products by average interest score
    let filteredProducts = [...data.products];
    filteredProducts.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
    // Take top 10 products
    const topProducts = filteredProducts.slice(0, 10);
    
    // Prepare data for the chart
    const chartData = {
        labels: topProducts.map(product => product.name),
        datasets: [
            {
                label: 'Strong Interest',
                data: topProducts.map(product => product.interestCounts['Sterke, concrete interesse']),
                backgroundColor: '#e74c3c',
                borderWidth: 1
            },
            {
                label: 'Reasonable Interest',
                data: topProducts.map(product => product.interestCounts['Redelijke interesse']),
                backgroundColor: '#3498db',
                borderWidth: 1
            },
            {
                label: 'Vague Interest',
                data: topProducts.map(product => product.interestCounts['Vage interesse']),
                backgroundColor: '#f39c12',
                borderWidth: 1
            },
            {
                label: 'Nothing Heard',
                data: topProducts.map(product => product.interestCounts['Niets over gehoord']),
                backgroundColor: '#95a5a6',
                borderWidth: 1
            }
        ]
    };
    
    // Create the chart
    if (window.productsChart) {
        window.productsChart.destroy();
    }
    
    window.productsChart = new Chart(ctx, {
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
                        text: 'Products & Suppliers'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Top 10 Products by Interest Level'
                },
                tooltip: {
                    mode: 'point',
                    intersect: true,
                    callbacks: {
                        title: function(context) {
                            // Get just the product name without interest level
                            const productIndex = context[0].dataIndex;
                            return topProducts[productIndex].name;
                        },
                        label: function(context) {
                            // Get the interest level and count
                            const interestLevel = context.dataset.label;
                            return `${interestLevel}: ${context.raw}`;
                        },
                        afterLabel: function(context) {
                            // Get the product and interest level
                            const productIndex = context.dataIndex;
                            const product = topProducts[productIndex];
                            const interestLevel = context.dataset.label;
                            
                            // Map chart label to data interest level
                            const interestLevelMap = {
                                'Strong Interest': 'Sterke, concrete interesse',
                                'Reasonable Interest': 'Redelijke interesse',
                                'Vague Interest': 'Vage interesse',
                                'Nothing Heard': 'Niets over gehoord'
                            };
                            
                            const dataInterestLevel = interestLevelMap[interestLevel];
                            
                            // Get companies with this interest level for this product
                            const companies = product.companiesWithInterest[dataInterestLevel] || [];
                            
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

// Render the products table
function renderProductsTable(data) {
    const tableContainer = document.getElementById('products-table');
    if (!tableContainer) return;
    
    // Sort products by average interest score
    let filteredProducts = [...data.products];
    filteredProducts.sort((a, b) => b.averageInterestScore - a.averageInterestScore);
    
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
                    <th>Product / Supplier</th>
                    <th>Strong Interest</th>
                    <th>Reasonable Interest</th>
                    <th>Vague Interest</th>
                    <th>Nothing Heard</th>
                    <th>Average Score</th>
                </tr>
            </thead>
            <tbody>
                ${filteredProducts.map(product => {
                    // Get companies for each interest level
                    const strongInterestCompanies = product.companiesWithInterest['Sterke, concrete interesse'] || [];
                    const reasonableInterestCompanies = product.companiesWithInterest['Redelijke interesse'] || [];
                    const vagueInterestCompanies = product.companiesWithInterest['Vage interesse'] || [];
                    const nothingHeardCompanies = product.companiesWithInterest['Niets over gehoord'] || [];
                    
                    return `
                    <tr>
                        <td>${product.name}</td>
                        <td>
                            ${product.interestCounts['Sterke, concrete interesse']} 
                            <span class="percentage-tooltip" ${storeCompanyData(strongInterestCompanies)}>
                                (${Math.round(product.interestCounts['Sterke, concrete interesse'] / product.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            ${product.interestCounts['Redelijke interesse']} 
                            <span class="percentage-tooltip" ${storeCompanyData(reasonableInterestCompanies)}>
                                (${Math.round(product.interestCounts['Redelijke interesse'] / product.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            ${product.interestCounts['Vage interesse']} 
                            <span class="percentage-tooltip" ${storeCompanyData(vagueInterestCompanies)}>
                                (${Math.round(product.interestCounts['Vage interesse'] / product.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>
                            ${product.interestCounts['Niets over gehoord']} 
                            <span class="percentage-tooltip" ${storeCompanyData(nothingHeardCompanies)}>
                                (${Math.round(product.interestCounts['Niets over gehoord'] / product.totalResponses * 100)}%)
                            </span>
                        </td>
                        <td>${product.averageInterestScore.toFixed(2)}</td>
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
