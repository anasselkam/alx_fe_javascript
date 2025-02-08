const Quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "You only live once, but if you do it right, once is enough.", category: "Motivation" },
  { text: "It is better to be hated for what you are than to be loved for what you are not.", category: "Inspiration" },
  { text: "Without music, life would be a mistake.", category: "Happiness" },
  { text: "If you tell the truth, you don't have to remember anything.", category: "Wellness" },
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(Quotes));
  populateCategories();
}

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * Quotes.length);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = Quotes[randomIndex].text;
  sessionStorage.setItem("lastViewedQuote", Quotes[randomIndex].text);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

document.addEventListener("DOMContentLoaded", () => {
  const lastViewedQuote = sessionStorage.getItem("lastViewedQuote");
  document.getElementById("quoteDisplay").innerHTML = lastViewedQuote || Quotes[0].text;
  populateCategories();
  restoreLastSelectedCategory();
  fetchQuotesFromServer();
  syncQuotes();
});

async function addQuote() {
  const quoteText = document.getElementById("newQuoteText");
  const quoteCategory = document.getElementById("newQuoteCategory");

  if (quoteText.value.trim() && quoteCategory.value.trim()) {
      const newQuote = { text: quoteText.value, category: quoteCategory.value };
      Quotes.push(newQuote);
      saveQuotes();
      await postQuoteToServer(newQuote);
      quoteText.value = "";
      quoteCategory.value = "";
      alert("Quote added successfully");
  } else {
      alert("Please enter both a quote and a category");
  }
}

async function postQuoteToServer(quote) {
  try {
      await fetch("https://jsonplaceholder.typicode.com/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quote)
      });
      console.log("Quote posted to server");
  } catch (error) {
      console.error("Error posting quote to server:", error);
  }
}

function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = "<option value='all'>All</option>";
  const categories = [...new Set(Quotes.map(q => q.category))];
  categories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  const filteredQuotes = selectedCategory === "all" ? Quotes : Quotes.filter(q => q.category === selectedCategory);
  document.getElementById("quoteDisplay").innerHTML = filteredQuotes.length ? filteredQuotes[0].text : "No quotes available";
}

document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

function restoreLastSelectedCategory() {
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  document.getElementById("categoryFilter").value = selectedCategory;
  filterQuotes();
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(Quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById("exportJson").addEventListener("click", exportToJsonFile);

document.getElementById("importFile").addEventListener("change", importFromJsonFile);

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
      try {
          const importedQuotes = JSON.parse(event.target.result);
          Quotes.push(...importedQuotes);
          saveQuotes();
          syncWithServer();
          alert("Quotes imported successfully!");
      } catch (error) {
          alert("Invalid JSON file");
      }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const serverQuotes = await response.json();
      if (serverQuotes.length) {
          localStorage.setItem("serverQuotes", JSON.stringify(serverQuotes));
          alert("Quotes fetched from server!");
      }
  } catch (error) {
      console.error("Error fetching quotes from server:", error);
  }
}

async function syncWithServer() {
  try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      const serverQuotes = await response.json();
      if (serverQuotes.length) {
          localStorage.setItem("serverQuotes", JSON.stringify(serverQuotes));
          alert("Quotes synced with server!");
      }
  } catch (error) {
      console.error("Error syncing with server:", error);
  }
}

setInterval(syncWithServer, 30000);


document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote()
  createAddQuoteForm()
})