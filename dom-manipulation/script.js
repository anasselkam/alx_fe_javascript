// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><em>— ${randomQuote.category}</em>`;
    saveLastViewedQuote(randomQuote);
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotes();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      populateCategories();
      showRandomQuote();
    } else {
      alert("Please fill in both fields!");
    }
  }
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Load quotes from localStorage
  function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
      quotes = JSON.parse(storedQuotes);
    }
  }
  
  // Save the last viewed quote to sessionStorage
  function saveLastViewedQuote(quote) {
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
  }
  
  // Export quotes to JSON
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Import quotes from JSON
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      populateCategories();
      showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Populate categories dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    categoryFilter.innerHTML =
      '<option value="all">All Categories</option>' +
      categories.map((cat) => `<option value="${cat}">${cat}</option>`).join("");
  }
  
  // Filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes =
      selectedCategory === "all"
        ? quotes
        : quotes.filter((quote) => quote.category === selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = filteredQuotes
      .map((quote) => `<p>"${quote.text}"</p><em>— ${quote.category}</em>`)
      .join("");
    saveSelectedCategory(selectedCategory);
  }
  
  // Save the selected category to localStorage
  function saveSelectedCategory(category) {
    localStorage.setItem("selectedCategory", category);
  }
  
  // Load the selected category from localStorage
  function loadSelectedCategory() {
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";
    document.getElementById("categoryFilter").value = selectedCategory;
    filterQuotes();
  }
  
  // Fetch quotes from server (simulated using JSONPlaceholder)
  async function fetchQuotesFromServer() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.map((post) => ({ text: post.title, category: "Server" }));
  }
  
  // Sync quotes with server and resolve conflicts
  async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];
    const mergedQuotes = [...localQuotes, ...serverQuotes];
    const uniqueQuotes = Array.from(new Set(mergedQuotes.map((q) => q.text))).map(
      (text) => mergedQuotes.find((q) => q.text === text)
    );
    quotes = uniqueQuotes;
    saveQuotes();
    populateCategories();
    showRandomQuote();
    showNotification("Quotes synced with server!");
  }
  
  // Show a notification
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.innerText = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "lightgreen";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Load quotes, categories, and selected category on page load
  loadQuotes();
  populateCategories();
  loadSelectedCategory();
  showRandomQuote();
  
  // Sync quotes periodically (every 60 seconds)
  setInterval(syncQuotes, 60000);