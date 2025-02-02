// Array to store quotes
const Quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "You only live once, but if you do it right, once is enough.", category: "Motivation" },
    { text: "It is better to be hated for what you are than to be loved for what you are not.", category: "Inspiration" },
    { text: "Without music, life would be a mistake.", category: "Happiness" },
    { text: "If you tell the truth, you don't have to remember anything.", category: "Wellness" },
  ];
  
  // Save quotes to localStorage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(Quotes));
  }
  
  // Display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * Quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>"${Quotes[randomIndex].text}"</p><em>— ${Quotes[randomIndex].category}</em>`;
  }
  
  // Create the form for adding new quotes
  function createAddQuoteForm() {
    const form = document.createElement("div");
    form.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(form);
  }
  
  // Add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;
  
    if (quoteText.trim() && quoteCategory.trim()) {
      Quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
      alert("Quote added successfully!");
    } else {
      alert("Please enter both a quote and a category!");
    }
  }
  
  // Export quotes to JSON
  function exportToJsonFile() {
    const dataStr = JSON.stringify(Quotes);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
    alert("Quotes exported successfully!");
  }
  
  // Import quotes from JSON
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      Quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initialize the application
  document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote();
    createAddQuoteForm();
  });