/**
 * Data processing module for the Bright Spots survey data
 */

// Load the CSV data from either local file or URL parameter if provided
export async function loadData(filePath) {
    try {
        // Check if URL parameter exists
        const urlParams = new URLSearchParams(window.location.search);
        const datafileUrl = urlParams.get('datafilePAR');
        
        // If URL parameter exists, use only that data source
        if (datafileUrl) {
            try {
                // Load data from URL parameter
                console.log(`Loading data from external URL: ${datafileUrl}`);
                const externalResponse = await fetch(datafileUrl);
                
                if (!externalResponse.ok) {
                    throw new Error(`Failed to load external data: ${externalResponse.status} ${externalResponse.statusText}`);
                }
                
                const externalCsvText = await externalResponse.text();
                const externalData = parseCSV(externalCsvText);
                console.log(`Loaded ${externalData.length} rows from external source`);
                
                return externalData;
            } catch (externalError) {
                console.error('Error loading external data:', externalError);
                throw externalError; // Re-throw the error to be handled by the caller
            }
        } else {
            // No URL parameter, load from local file
            console.log('No external data URL provided, using local data file');
            const localResponse = await fetch(filePath);
            
            if (!localResponse.ok) {
                throw new Error(`Failed to load local data: ${localResponse.status} ${localResponse.statusText}`);
            }
            
            const localCsvText = await localResponse.text();
            const localData = parseCSV(localCsvText);
            console.log(`Loaded ${localData.length} rows from local file`);
            
            return localData;
        }
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Parse CSV text into structured data
function parseCSV(csvText) {
    // First, normalize line endings
    const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Extract headers (first line)
    const headerLine = normalizedText.split('\n')[0];
    const headers = headerLine.split(';');
    
    // Now process the rest of the text to handle quoted values with line breaks
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    let expectedFields = headers.length;
    
    // Skip the header line
    const contentText = normalizedText.substring(headerLine.length + 1);
    
    for (let i = 0; i < contentText.length; i++) {
        const char = contentText[i];
        const nextChar = contentText[i + 1] || '';
        
        // Handle quotes
        if (char === '"') {
            inQuotes = !inQuotes;
            currentField += char;
        }
        // Handle field separators (semicolons)
        else if (char === ';' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        }
        // Handle line breaks
        else if (char === '\n' && !inQuotes) {
            // Add the last field of the current row
            currentRow.push(currentField);
            currentField = '';
            
            // Check if this is a complete row (has the expected number of fields)
            if (currentRow.length === expectedFields) {
                // Process the row
                const rowObject = {};
                headers.forEach((header, index) => {
                    rowObject[header] = currentRow[index] || '';
                });
                rows.push(rowObject);
                
                // Reset for the next row
                currentRow = [];
            } else if (currentRow.length > 0) {
                // This is likely a line break within a row that wasn't in quotes
                // We'll add the fields we have so far to the row object
                // and continue with the next line
                currentRow = [];
            }
        }
        // Handle all other characters
        else {
            currentField += char;
        }
    }
    
    // Handle the last field and row if there are any
    if (currentField) {
        currentRow.push(currentField);
    }
    
    if (currentRow.length > 0) {
        // Process the last row
        const rowObject = {};
        headers.forEach((header, index) => {
            rowObject[header] = currentRow[index] || '';
        });
        rows.push(rowObject);
    }
    
    return rows;
}

// Helper function to split CSV line handling quoted values
// This is kept for reference but no longer used in the main parsing logic
function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
            current += char;
        } else if (char === ';' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last value
    result.push(current);
    
    return result;
}

// Process the raw data into a more usable format
export function processData(rawData) {
    if (!rawData || !rawData.length) {
        throw new Error('No data to process');
    }
    
    // Extract survey period
    const startDates = [];
    const endDates = [];
    
    // Parse dates in European format (DD-MM-YYYY)
    rawData.forEach(row => {
        if (row['Start time']) {
            const [day, month, yearTime] = row['Start time'].split('-');
            if (day && month && yearTime) {
                const [year, time] = yearTime.split(' ');
                if (year && time) {
                    const [hours, minutes] = time.split(':');
                    const date = new Date(year, month - 1, day, hours, minutes);
                    if (!isNaN(date.getTime())) startDates.push(date);
                }
            }
        }
        
        if (row['Completion time']) {
            const [day, month, yearTime] = row['Completion time'].split('-');
            if (day && month && yearTime) {
                const [year, time] = yearTime.split(' ');
                if (year && time) {
                    const [hours, minutes] = time.split(':');
                    const date = new Date(year, month - 1, day, hours, minutes);
                    if (!isNaN(date.getTime())) endDates.push(date);
                }
            }
        }
    });
    
    const surveyPeriod = {
        start: startDates.length > 0 ? new Date(Math.min(...startDates.map(d => d.getTime()))) : null,
        end: endDates.length > 0 ? new Date(Math.max(...endDates.map(d => d.getTime()))) : null
    };
    
    // Extract companies
    const companies = [...new Set(rawData.map(row => row['Jouw bedrijf']).filter(Boolean))];
    
    // Process challenges data
    const challengesColumns = Object.keys(rawData[0]).filter(key => 
        key.startsWith('Wat zijn uitdagingen en thema\'s waar je klanten over hoort?')
    );
    
    const challenges = challengesColumns.map(column => {
        // Extract the challenge name from the column header
        const challengeName = column.split('.')[1] || column;
        
        // Count interest levels
        const interestCounts = countInterestLevels(rawData, column);
        
        // Collect companies with their interest levels for this challenge
        const companiesWithInterest = {};
        rawData.forEach(row => {
            const company = row['Jouw bedrijf'];
            const interestLevel = row[column];
            if (company && interestLevel) {
                if (!companiesWithInterest[interestLevel]) {
                    companiesWithInterest[interestLevel] = [];
                }
                if (!companiesWithInterest[interestLevel].includes(company)) {
                    companiesWithInterest[interestLevel].push(company);
                }
            }
        });
        
        return {
            name: challengeName,
            interestCounts,
            totalResponses: rawData.length,
            averageInterestScore: calculateAverageInterestScore(interestCounts),
            companiesWithInterest
        };
    });
    
    // Process technologies data
    const technologiesColumns = Object.keys(rawData[0]).filter(key => 
        key.startsWith('TechAndConcepts')
    );
    
    const technologies = technologiesColumns.map(column => {
        // Extract the technology name from the column header
        const technologyName = column.split('.')[1] || column;
        
        // Count interest levels
        const interestCounts = countInterestLevels(rawData, column);
        
        // Collect companies with their interest levels for this technology
        const companiesWithInterest = {};
        rawData.forEach(row => {
            const company = row['Jouw bedrijf'];
            const interestLevel = row[column];
            if (company && interestLevel) {
                if (!companiesWithInterest[interestLevel]) {
                    companiesWithInterest[interestLevel] = [];
                }
                if (!companiesWithInterest[interestLevel].includes(company)) {
                    companiesWithInterest[interestLevel].push(company);
                }
            }
        });
        
        return {
            name: technologyName,
            interestCounts,
            totalResponses: rawData.length,
            averageInterestScore: calculateAverageInterestScore(interestCounts),
            companiesWithInterest
        };
    });
    
    // Process products data
    const productsColumns = Object.keys(rawData[0]).filter(key => 
        key.startsWith('Wat zijn concrete producten en leveranciers waar je klanten over hoort?')
    );
    
    const products = productsColumns.map(column => {
        // Extract the product name from the column header
        const productName = column.split('.')[1] || column;
        
        // Count interest levels
        const interestCounts = countInterestLevels(rawData, column);
        
        // Collect companies with their interest levels for this product
        const companiesWithInterest = {};
        rawData.forEach(row => {
            const company = row['Jouw bedrijf'];
            const interestLevel = row[column];
            if (company && interestLevel) {
                if (!companiesWithInterest[interestLevel]) {
                    companiesWithInterest[interestLevel] = [];
                }
                if (!companiesWithInterest[interestLevel].includes(company)) {
                    companiesWithInterest[interestLevel].push(company);
                }
            }
        });
        
        return {
            name: productName,
            interestCounts,
            totalResponses: rawData.length,
            averageInterestScore: calculateAverageInterestScore(interestCounts),
            companiesWithInterest
        };
    });
    
    // Process new customer themes data
    const newCustomerThemes = rawData.map(row => {
        const themeText = row['newCustomerThemes'];
        return {
            company: row['Jouw bedrijf'] || 'Unknown',
            respondent: row['Jouw naam'] || row['Name'] || 'Anonymous',
            text: themeText || '',
            hasContent: Boolean(themeText && themeText.trim())
        };
    }).filter(item => item.hasContent);
    
    // Process emerging tech/vendor/product data
    const emergingTechVendorProducts = rawData.map(row => {
        const techText = row['emergingTechVendorProduct'];
        return {
            company: row['Jouw bedrijf'] || 'Unknown',
            respondent: row['Jouw naam'] || row['Name'] || 'Anonymous',
            text: techText || '',
            hasContent: Boolean(techText && techText.trim())
        };
    }).filter(item => item.hasContent);
    
    // Return the processed data
    return {
        rawData,
        surveyPeriod,
        companies,
        totalResponses: rawData.length,
        challenges: challenges.sort((a, b) => b.averageInterestScore - a.averageInterestScore),
        technologies: technologies.sort((a, b) => b.averageInterestScore - a.averageInterestScore),
        products: products.sort((a, b) => b.averageInterestScore - a.averageInterestScore),
        newCustomerThemes,
        emergingTechVendorProducts
    };
}

// Helper function to count interest levels for a column
function countInterestLevels(data, column) {
    const counts = {
        'Sterke, concrete interesse': 0,
        'Redelijke interesse': 0,
        'Vage interesse': 0,
        'Niets over gehoord': 0
    };
    
    data.forEach(row => {
        const value = row[column];
        if (value && counts.hasOwnProperty(value)) {
            counts[value]++;
        }
    });
    
    return counts;
}

// Helper function to calculate average interest score
function calculateAverageInterestScore(interestCounts) {
    // Assign weights to each interest level
    const weights = {
        'Sterke, concrete interesse': 3,
        'Redelijke interesse': 2,
        'Vage interesse': 1,
        'Niets over gehoord': 0
    };
    
    // Calculate weighted sum
    let weightedSum = 0;
    let totalCount = 0;
    
    for (const [level, count] of Object.entries(interestCounts)) {
        weightedSum += weights[level] * count;
        totalCount += count;
    }
    
    // Return average score (0 if no data)
    return totalCount > 0 ? weightedSum / totalCount : 0;
}
