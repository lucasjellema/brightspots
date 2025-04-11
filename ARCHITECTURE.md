# Bright Spots Survey Visualization - Architecture Document

This document outlines the architecture and technical design of the Bright Spots Survey Visualization application.

## 1. Application Overview

The Bright Spots Survey Visualization is a client-side web application that processes and visualizes survey data. It's built using vanilla JavaScript with ES Modules, HTML5, and CSS3, with Chart.js for data visualization.

### 1.1 Key Features

- Data processing and parsing from CSV format
- Interactive data visualizations
- Multiple view perspectives (overview, challenges, technologies, products, company-specific)
- Word cloud visualization for text analysis
- Dynamic content rendering
- Support for combining data from multiple sources

## 2. Architecture Design

The application follows a modular architecture with clear separation of concerns:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Data Layer     │────▶│  Processing     │────▶│  Presentation   │
│  (CSV Files)    │     │  Layer          │     │  Layer          │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2.1 Component Structure

- **Data Layer**: CSV files containing survey responses
- **Processing Layer**: JavaScript modules for data loading, parsing, and analysis
- **Presentation Layer**: HTML/CSS/JS for rendering visualizations and user interface

## 3. Module Descriptions

### 3.1 Core Modules

#### 3.1.1 app.js
- Entry point for the application
- Manages navigation between different views
- Initializes the application and loads data
- Handles routing and view switching

#### 3.1.2 dataProcessor.js
- Loads data from local CSV file and/or external URL
- Parses CSV data into structured JavaScript objects
- Processes and transforms data for visualization
- Extracts metrics and insights from raw data
- Combines data from multiple sources when available

### 3.2 View Modules

#### 3.2.1 overviewPage.js
- Renders the main dashboard with key metrics
- Displays summary visualizations of survey data
- Renders word cloud visualization
- Shows new customer themes and emerging technologies

#### 3.2.2 challengesPage.js
- Visualizes challenges and themes from the survey
- Renders bar charts showing interest levels
- Displays detailed information about each challenge
- Shows new customer themes related to challenges

#### 3.2.3 technologiesPage.js
- Visualizes technologies and concepts from the survey
- Renders bar charts showing interest levels
- Displays detailed information about each technology
- Shows emerging technologies mentioned by respondents

#### 3.2.4 productsPage.js
- Visualizes products and suppliers from the survey
- Renders bar charts showing interest levels
- Displays detailed information about each product

#### 3.2.5 companyPage.js
- Displays company-specific survey responses
- Shows submission dates and respondent information
- Renders interest levels for each category
- Displays company-specific themes and comments

#### 3.2.6 wordCloud.js
- Processes text data to extract meaningful words
- Filters out stop words and common terms
- Calculates word frequencies
- Renders interactive word cloud visualization
- Provides tooltips showing companies mentioning each word

## 4. Data Flow

1. **Data Loading**: The application loads CSV data from local file and/or external URL
2. **Data Parsing**: CSV data is parsed into structured JavaScript objects
3. **Data Processing**: Raw data is processed to extract insights and metrics
4. **Visualization**: Processed data is visualized using Chart.js and custom rendering
5. **Interaction**: User interactions (clicks, hovers) trigger additional data display

## 5. Key Technical Implementations

### 5.1 CSV Parsing
The application includes a custom CSV parser that handles complex CSV structures with quoted fields and line breaks within fields.

### 5.2 Data Aggregation
Survey responses are aggregated to calculate metrics like:
- Average interest scores
- Response counts by category
- Company-specific insights

### 5.3 Word Cloud Generation
The word cloud implementation:
- Processes text to remove stop words
- Calculates word frequencies
- Associates words with companies
- Renders words with size based on frequency
- Provides interactive tooltips

### 5.4 Chart Rendering
Charts are rendered using Chart.js with custom configurations for:
- Stacked bar charts for interest levels
- Tooltips showing company information
- Color schemes and styling

### 5.5 External Data Integration
The application can combine data from:
- Local CSV file (default source)
- External URL specified via query parameter

## 6. User Interface Components

### 6.1 Navigation
- Tab-based navigation for switching between views
- Company selector for filtering to specific companies

### 6.2 Dashboards
- Overview dashboard with key metrics
- Category-specific dashboards (challenges, technologies, products)
- Company-specific dashboard

### 6.3 Visualizations
- Bar charts for quantitative data
- Word cloud for qualitative text data
- Tables for detailed information

## 7. Future Enhancement Opportunities

- Advanced filtering capabilities
- Data export functionality
- More advanced text analysis
- Comparative analysis between companies
- Time-based trend analysis
- Backend integration for dynamic data loading
