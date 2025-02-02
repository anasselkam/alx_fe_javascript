const Quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "You only live once, but if you do it right, once is enough.", category: "Motivation" },
    { text: "It is better to be hated for what you are than to be loved for what you are not.", category: "Inspiration" },
    { text: "Without music, life would be a mistake.", category: "Happiness" },
    { text: "If you tell the truth, you don't have to remember anything.", category: "Wellness" },
]
function saveQuotes(){
    localStorage.setItem(JSON.stringify(Quotes))
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * Quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = Quotes[randomIndex].text;
}

document.getElementById("newQuote").addEventListener("click",showRandomQuote)

function createAddQuoteForm(){
    createAddQuoteForm.createElement("form")
    document.body.appendChild(createAddQuoteForm)
}


function addQuote() {
    
    const quoteText = document.getElementById("newQuoteText");
    const quoteCategory = document.getElementById("newQuoteCategory");

    if (quoteText.value.trim() && quoteCategory.value.trim()) {
        Quotes.push({ text: quoteText.value, category: quoteCategory.value });
        quoteText.value = "";
        quoteCategory.value = "";
        alert("Quote added successfully");
    } else {
        alert("please enter both a quote and a category")
    }

}

document.addEventListener("DOMContentLoaded", () => {
    showRandomQuote()
    createAddQuoteForm()
})