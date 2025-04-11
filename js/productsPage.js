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
                ${filteredProducts.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.interestCounts['Sterke, concrete interesse']} (${Math.round(product.interestCounts['Sterke, concrete interesse'] / product.totalResponses * 100)}%)</td>
                        <td>${product.interestCounts['Redelijke interesse']} (${Math.round(product.interestCounts['Redelijke interesse'] / product.totalResponses * 100)}%)</td>
                        <td>${product.interestCounts['Vage interesse']} (${Math.round(product.interestCounts['Vage interesse'] / product.totalResponses * 100)}%)</td>
                        <td>${product.interestCounts['Niets over gehoord']} (${Math.round(product.interestCounts['Niets over gehoord'] / product.totalResponses * 100)}%)</td>
                        <td>${product.averageInterestScore.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    // Update the table container
    tableContainer.innerHTML = tableHTML;
}
