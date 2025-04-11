/**
 * Search page module - provides functionality to search across all survey data
 */

// Render the search page and set up event listeners
export function renderSearchPage(data) {
    if (!data) return;
    
    // Set up search button click handler
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    
    if (searchButton && searchInput) {
        // Handle search button click
        searchButton.addEventListener('click', () => {
            performSearch(data, searchInput.value);
        });
        
        // Handle enter key press in search input
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(data, searchInput.value);
            }
        });
    }
}

// Perform search across all data
function performSearch(data, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        showNoResults('Please enter a search term');
        return;
    }
    
    searchTerm = searchTerm.trim().toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    
    if (!resultsContainer) return;
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Array to store all search results
    const searchResults = [];
    
    // Search through raw data for all companies
    data.rawData.forEach(row => {
        const company = row['Jouw bedrijf'];
        if (!company) return;
        
        // Search through all fields in the row
        for (const [key, value] of Object.entries(row)) {
            // Skip empty values or non-string values
            if (!value || typeof value !== 'string') continue;
            
            // Check if the value contains the search term
            if (value.toLowerCase().includes(searchTerm)) {
                // Determine category based on column name
                let category = 'Other';
                
                if (key.includes('Challenge') || key.includes('uitdagingen')) {
                    category = 'Challenge & Theme';
                } else if (key.includes('Technologie') || key.includes('TechAndConcepts')) {
                    category = 'Technology & Concept';
                } else if (key.includes('Product') || key.includes('leveranciers')) {
                    category = 'Product & Supplier';
                }
                
                // Add to search results
                searchResults.push({
                    company: company,
                    category: category,
                    field: key,
                    value: value,
                    searchTerm: searchTerm
                });
            }
        }
    });
    
    // Display search results
    if (searchResults.length > 0) {
        // Sort results by company name
        searchResults.sort((a, b) => a.company.localeCompare(b.company));
        
        // Create results HTML
        searchResults.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result';
            
            // Create header with company and category
            const header = document.createElement('div');
            header.className = 'search-result-header';
            
            // Company name (clickable)
            const companyElement = document.createElement('span');
            companyElement.className = 'search-result-company';
            companyElement.textContent = result.company;
            companyElement.addEventListener('click', () => {
                navigateToCompanyPage(result.company);
            });
            
            // Category
            const categoryElement = document.createElement('span');
            categoryElement.className = 'search-result-category';
            categoryElement.textContent = result.category;
            
            header.appendChild(companyElement);
            header.appendChild(categoryElement);
            
            // Create content with highlighted search term
            const content = document.createElement('div');
            content.className = 'search-result-content';
            
            // Field name
            const fieldElement = document.createElement('div');
            fieldElement.className = 'search-result-field';
            fieldElement.textContent = `Field: ${formatFieldName(result.field)}`;
            
            // Value with highlighted search term
            const valueElement = document.createElement('div');
            valueElement.className = 'search-result-value';
            valueElement.innerHTML = highlightSearchTerm(result.value, result.searchTerm);
            
            content.appendChild(fieldElement);
            content.appendChild(valueElement);
            
            // Add header and content to result element
            resultElement.appendChild(header);
            resultElement.appendChild(content);
            
            // Add result to container
            resultsContainer.appendChild(resultElement);
        });
    } else {
        showNoResults(`No results found for "${searchTerm}"`);
    }
}

// Format field name to be more readable
function formatFieldName(fieldName) {
    // Remove common prefixes
    let formatted = fieldName
        .replace('Wat zijn uitdagingen en thema\'s waar je klanten over hoort?.', '')
        .replace('TechAndConcepts.', '')
        .replace('Wat zijn concrete producten en leveranciers waar je klanten over hoort?.', '');
    
    // If the field is still the same, just return it
    if (formatted === fieldName) {
        return fieldName;
    }
    
    return formatted;
}

// Highlight search term in text
function highlightSearchTerm(text, searchTerm) {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// Escape special characters in string for use in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Show no results message
function showNoResults(message) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = `<div class="no-results">${message}</div>`;
}

// Navigate to company page and select the specified company
function navigateToCompanyPage(company) {
    // Find the company page nav link
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
