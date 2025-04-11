/**
 * Word Cloud module for visualizing words from newCustomerThemes
 */

// Generate and render the word cloud
export function renderWordCloud(data) {
    if (!data || !data.newCustomerThemes || data.newCustomerThemes.length === 0) return;
    
    // Get the container
    const container = document.getElementById('word-cloud-container');
    if (!container) return;
    
    // Process the text to extract words and their frequencies
    const wordData = processTextForWordCloud(data.newCustomerThemes);
    
    // Create the word cloud HTML
    createWordCloudHTML(container, wordData);
}

// Process text data to extract words and their frequencies
function processTextForWordCloud(themeData) {
    // Combine all theme texts
    const allText = themeData.map(item => item.text.toLowerCase()).join(' ');
    
    // Define stop words (common words to exclude)
    const stopWords = new Set([
        'de', 'het', 'een', 'en', 'van', 'in', 'op', 'voor', 'met', 'door', 'naar', 'is', 'zijn', 'was',
        'wordt', 'worden', 'te', 'om', 'dat', 'die', 'deze', 'dit', 'er', 'niet', 'ook', 'maar', 'als',
        'dan', 'nog', 'al', 'bij', 'zo', 'toch', 'of', 'aan', 'over', 'uit', 'nu', 'dus', 'wel', 'kan',
        'the', 'and', 'to', 'of', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you',
        'it', 'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'have', 'more', 'an', 'was', 'we',
        'will', 'can', 'all', 'there', 'their', 'what', 'so', 'if', 'they', 'would', 'make', 'just',
        'has', 'our', 'do', 'no', 'about', 'which', 'when', 'one', 'should', 'very', 'some', 'like',
        'now', 'how', 'than', 'other', 'only', 'then', 'its', 'also', 'into', 'any', 'these', 'could',
        'first', 'see', 'been', 'who', 'had', 'may', 'after', 'use', 'two', 'most', 'us', 'time',
        'waar', 'hoe', 'wat', 'wie', 'wanneer', 'waarom', 'welke', 'veel', 'meer', 'moet', 'moeten',
        'zal', 'zullen', 'zou', 'zouden', 'ik', 'je', 'jij', 'hij', 'zij', 'wij', 'jullie', 'zij',
        'hen', 'hun', 'haar', 'mijn', 'jouw', 'zijn', 'haar', 'ons', 'onze', 'zich', 'zelf'

        ,'vanuit',
        'verwacht',
        'etc',
        'vraag',
        'nieuwe',
        'processen',
        'kunnen',
        'inzet',
        'steeds',
        'onder',
        'doen',
        'alleen',
        'geen',
        'low',
        'vragen',
        'werken',
        'echte',
        'krijgen',
        'diensten',
        'content',
        'hier',
        'huidige',
        'druk',
        'staan',
        'lang',
        'hierbij',
        'terug',
        'jaar',
        'minder',
        'gericht',
        'vlak',
        'opzetten',
        'key',
        'toepassingen',
        'rondom',
        'blijft',
        'data',
        'leveren',
        'lijkt',
        'practice',
        'speelt',
        'klant',
        'inzetten',
        'kijken',
        'ecosysteem',
        'aanbieden',
        'markt',
        'apps',
        'vooral',
        'meerdere',
        'best',
        'public',
        'business',
        'komen',
        'vaak',
        'gaan',
        'zowel',
        'qua',

        "het",
        "algemene",
        "probleem",
        "komt",
        "urenfabriek",
        "houdbaar?",
        "situatie",
        "zorgt",
        "eindigheid",
        "optie",
        "rijkere",
        "landen",
        "aanpassen",
        "model",
        "staat",
        "voorop",
        "wellicht",
        "modellen",
        "waarbij",
        "geworden",
        "stroming",
        "realiseren",
        "verjongen",
        "komend",
        "spelen",
        "geld",
        "mij",
        "betreft",
        "opties",
        "jong",

        "jonge",
        "bedrijven",
        "basis",
        "let",
        "factory",
        "back",
        "henry",
        "ford",
        "1920's",
        "stap",
        "maken",
        "mag",
        "voorzichtige",
        "tezamen",
        "bovenstaande",
        "pad",
        "snel",
        "ontwikkelen",
        "uitdagingen",
        "kansen",
        "manier",
        "waarop",
        "blijvend",
        "veranderen",
        "enkele",
        "belangrijkste",
        "trends",
        "komende",
        "impact",
        "focus"
    ]);
    
    // Split text into words, remove punctuation, and filter out stop words and short words
    const words = allText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ')
                         .split(/\s+/)
                         .filter(word => word.length > 2 && !stopWords.has(word) && isNaN(word));
    
    // Count word frequencies
    const wordFrequencies = {};
    words.forEach(word => {
        if (wordFrequencies[word]) {
            wordFrequencies[word].count++;
        } else {
            wordFrequencies[word] = { 
                word: word, 
                count: 1,
                companies: new Set()
            };
        }
    });
    
    // Associate words with companies
    themeData.forEach(item => {
        const text = item.text.toLowerCase();
        const company = item.company;
        
        Object.keys(wordFrequencies).forEach(word => {
            if (text.includes(word)) {
                wordFrequencies[word].companies.add(company);
            }
        });
    });
    
    // Convert to array and sort by frequency
    const wordArray = Object.values(wordFrequencies);
    wordArray.forEach(item => {
        item.companies = Array.from(item.companies);
    });
    
    // Sort by count (descending)
    wordArray.sort((a, b) => b.count - a.count);
    
    // Take top 100 words
    return wordArray.slice(0, 100);
}

// Create the word cloud HTML
function createWordCloudHTML(container, wordData) {
    // Calculate the min and max frequencies
    const minCount = Math.min(...wordData.map(item => item.count));
    const maxCount = Math.max(...wordData.map(item => item.count));
    
    // Create a function to map count to font size (between 12px and 48px)
    const getFontSize = count => {
        const minSize = 12;
        const maxSize = 48;
        if (minCount === maxCount) return (minSize + maxSize) / 2;
        return minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    };
    
    // Create a function to get a color based on count
    const getColor = count => {
        const colors = [
            '#3498db', // blue
            '#2980b9', // darker blue
            '#1abc9c', // teal
            '#16a085', // darker teal
            '#2ecc71', // green
            '#27ae60', // darker green
            '#e74c3c', // red
            '#c0392b', // darker red
            '#9b59b6', // purple
            '#8e44ad', // darker purple
            '#f1c40f', // yellow
            '#f39c12'  // orange
        ];
        
        // Map count to color index
        const index = Math.floor((count - minCount) / (maxCount - minCount) * (colors.length - 1));
        return colors[Math.min(index, colors.length - 1)];
    };
    
    // Create the word cloud HTML
    let html = '<div class="word-cloud">';
    
    wordData.forEach(item => {
        const fontSize = getFontSize(item.count);
        const color = getColor(item.count);
        const companiesText = item.companies.join(', ');
        
        html += `
            <span 
                class="word-cloud-item" 
                style="font-size: ${fontSize}px; color: ${color};"
                data-companies="${companiesText}"
                data-count="${item.count}"
                title="${item.word} (${item.count}): ${companiesText}"
            >
                ${item.word}
            </span>
        `;
    });
    
    html += '</div>';
    
    // Add the word cloud to the container
    container.innerHTML = html;
    
    // Add event listeners for tooltips
    const wordElements = container.querySelectorAll('.word-cloud-item');
    wordElements.forEach(element => {
        element.addEventListener('mouseover', function(e) {
            const word = this.textContent.trim();
            const count = this.getAttribute('data-count');
            const companies = this.getAttribute('data-companies');
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'word-tooltip';
            tooltip.innerHTML = `
                <strong>${word}</strong> (${count})
                <br>
                <span>Companies: ${companies}</span>
            `;
            
            // Position tooltip
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
            
            // Add tooltip to document
            document.body.appendChild(tooltip);
            
            // Store tooltip reference on element
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mousemove', function(e) {
            if (this.tooltip) {
                this.tooltip.style.left = `${e.pageX + 10}px`;
                this.tooltip.style.top = `${e.pageY + 10}px`;
            }
        });
        
        element.addEventListener('mouseout', function() {
            if (this.tooltip) {
                document.body.removeChild(this.tooltip);
                this.tooltip = null;
            }
        });
    });
}
