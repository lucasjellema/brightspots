// Main application file
import { loadData, processData } from './dataProcessor.js';
import { renderOverview } from './overviewPage.js';
import { renderChallenges } from './challengesPage.js';
import { renderTechnologies } from './technologiesPage.js';
import { renderProducts } from './productsPage.js';
import { renderCompanyPage } from './companyPage.js';
import { renderSearchPage } from './searchPage.js';

// Global state
let surveyData = null;
let processedData = null;

// Initialize the application
async function initApp() {
    try {
        // Load and process the data
        surveyData = await loadData('../data/brightspots.csv');
        processedData = processData(surveyData);
        
        // Initialize all pages
        renderOverview(processedData);
        renderChallenges(processedData);
        renderTechnologies(processedData);
        renderProducts(processedData);
        renderCompanyPage(processedData);
        renderSearchPage(processedData);
        
        // Set up navigation
        setupNavigation();
        
        // Set up filters
        setupFilters();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        document.querySelector('main').innerHTML = `
            <div class="error-message">
                <h2>Error Loading Data</h2>
                <p>There was a problem loading the survey data. Please try again later.</p>
                <p>Technical details: ${error.message}</p>
            </div>
        `;
    }
}

// Set up navigation between pages
function setupNavigation() {
    const navLinks = document.querySelectorAll('#main-nav a');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target page
            const targetPageId = link.getAttribute('data-page');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPageId) {
                    page.classList.add('active');
                }
            });
        });
    });
}

// Set up filter event listeners
function setupFilters() {
    // Challenges filter
    const challengesFilter = document.getElementById('interest-filter');
    if (challengesFilter) {
        challengesFilter.addEventListener('change', () => {
            renderChallenges(processedData, challengesFilter.value);
        });
    }
    
    // Technologies filter
    const techFilter = document.getElementById('tech-interest-filter');
    if (techFilter) {
        techFilter.addEventListener('change', () => {
            renderTechnologies(processedData, techFilter.value);
        });
    }
    
    // Products filter
    const productFilter = document.getElementById('product-interest-filter');
    if (productFilter) {
        productFilter.addEventListener('change', () => {
            renderProducts(processedData, productFilter.value);
        });
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
