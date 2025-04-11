# Bright Spots Survey Visualization

A static web application to visualize and explore findings from the Bright Spots survey using vanilla web technologies (JavaScript, ES Modules, HTML, CSS). The application provides interactive dashboards and visualizations to help analyze survey data about emerging customer demands, technologies, and market trends.

## Features

- **Overview Dashboard**: Key metrics and summary of survey results with word cloud visualization
- **Challenges & Themes**: Detailed visualization of challenges and themes identified in the survey
- **Technologies & Concepts**: Analysis of emerging technologies and concepts
- **Products & Suppliers**: Insights into products and suppliers mentioned in the survey
- **Company-Specific Views**: Detailed breakdown of responses by company
- **Word Cloud Visualization**: Visual representation of frequently mentioned customer themes
- **Interactive Tooltips**: Hover over percentage values to see and navigate to specific companies
- **Global Search**: Search across all survey data and navigate directly to company-specific views
- **External Data Integration**: Support for loading additional data via URL parameter
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # CSS styles for the application
├── js/
│   ├── app.js              # Main application file and navigation
│   ├── dataProcessor.js    # Data loading and processing
│   ├── overviewPage.js     # Overview page rendering
│   ├── challengesPage.js   # Challenges page rendering
│   ├── technologiesPage.js # Technologies page rendering
│   ├── productsPage.js     # Products page rendering
│   ├── companyPage.js      # Company-specific page rendering
│   ├── searchPage.js       # Global search functionality
│   └── wordCloud.js        # Word cloud generation and rendering
├── data/
│   └── brightspots.csv     # Survey data in CSV format
├── ARCHITECTURE.md         # Detailed architecture documentation
└── GITHUB_PUBLISHING_GUIDE.md # Guide for publishing to GitHub Pages
```

## Data Integration

The application can load data from one of two possible sources:

1. **Local CSV File**: If no parameters are provided, the application loads data from the local `brightspots.csv` file
2. **External URL**: If the `datafilePAR` query parameter is provided, the application will exclusively load data from that URL, ignoring the local file

Example: `http://your-server/index.html?datafilePAR=https://example.com/external-data.csv`

## Key Features in Detail

### Interactive Tooltips
When hovering over percentage values in data tables across the application, tooltips display the specific companies that contributed to that data point. These tooltips allow direct navigation to company-specific views by clicking on any company name.

### Global Search
The search functionality allows users to find specific terms across all survey data. Search results show:
- Which company mentioned the search term
- In which category (Challenge, Technology, or Product) it was mentioned
- The exact field and value where the match was found
- Highlighted search terms for easy identification

Users can click on company names in search results to navigate directly to that company's detailed page.

## Setup

This is a static web application that requires a web server to run properly (due to CORS restrictions when loading the CSV file).

### Running Locally

You can use any local web server to run the application. Here are a few options:

#### Using Python (if installed)

```bash
# Python 3
python -m http.server

# Python 2
python -m SimpleHTTPServer
```

#### Using Node.js (if installed)

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run the server
http-server
```

Then open your browser and navigate to `http://localhost:8000` (or the port specified by your web server).

## Data Structure

The application expects the CSV data to be in the format provided in the `data/brightspots.csv` file, with semicolon-separated values and specific column headers for challenges, technologies, and products.

## Technologies Used

- **HTML5**: Structure of the web application
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Application logic and data processing
- **ES Modules**: For modular code organization
- **Chart.js**: For data visualization
