// script.js
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  ];
  
  let lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = quotes[randomIndex].text;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');
  
    const newQuote = {
      text: newQuoteText.value,
      category: newQuoteCategory.value,
    };
  
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Update categories in dropdown
    newQuoteText.value = "";
    newQuoteCategory.value = "";
    filterQuotes(); // Refresh quotes display after adding
  }
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.text = category;
      categoryFilter.appendChild(option);
    });
  
    categoryFilter.value = lastSelectedCategory; // Set to last selected category
  }
  
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    lastSelectedCategory = selectedCategory;
    localStorage.setItem('lastSelectedCategory', lastSelectedCategory);
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear current quotes
  
    const filteredQuotes = selectedCategory === 'all'
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
  
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('p'); // Or any element you prefer
      quoteElement.textContent = quote.text;
      quoteDisplay.appendChild(quoteElement);
    });
  
    if (filteredQuotes.length === 0) {
        const noQuotesMessage = document.createElement('p');
        noQuotesMessage.textContent = "No quotes found in this category.";
        quoteDisplay.appendChild(noQuotesMessage);
    }
  }
  
  
  
  // JSON Import/Export
  function exportToJson() {
    const jsonString = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = importedQuotes; // Replace current quotes with imported ones
        saveQuotes();
        populateCategories(); // Update categories
        filterQuotes();     // Update displayed quotes
        alert('Quotes imported successfully!');
      } catch (error) {
        alert('Error importing quotes. Invalid JSON format.');
        console.error("JSON parse error:", error);
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  
  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    showRandomQuote();
    populateCategories();
    filterQuotes();
  
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
    // Add input fields and button for adding quotes
    const addQuoteDiv = document.createElement('div');
    addQuoteDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
      <button onclick="exportToJson()">Export Quotes to JSON</button>
      <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.insertBefore(addQuoteDiv, document.body.lastChild); // Insert before the script tag
  
      // Server Sync Simulation (using setTimeout for simplicity)
      setInterval(() => {
          // In a real application, this would fetch data from a server
          const serverQuotes = JSON.parse(localStorage.getItem('serverQuotes')) || []; //Simulate fetching data
          if (JSON.stringify(serverQuotes) !== JSON.stringify(quotes)) {
            quotes = serverQuotes; // Server data takes precedence (simple conflict resolution)
            saveQuotes();
            populateCategories();
            filterQuotes();
            alert("Quotes updated from 'server'."); // Notify user (Improve this in a real app)
          }
  
      }, 5000); // Check every 5 seconds (adjust as needed)
  
      // Simulate server data changes (for demonstration purposes)
      setTimeout(() => {
          const sampleServerQuotes = [
              { text: "Server Quote 1", category: "Server" },
              { text: "Server Quote 2", category: "Server" },
              { text: "Another quote", category: "Inspiration"}
          ];
          localStorage.setItem('serverQuotes', JSON.stringify(sampleServerQuotes));
      }, 10000); // Simulate a server update after 10 seconds
  });