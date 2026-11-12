const listings = [
    { id: 1, title: "Casio fx-991EX Calculator", price: 4500, category: "Electronics", condition: "Good" },
    { id: 2, title: "Introduction to Algorithms (CLRS)", price: 3500, category: "Books", condition: "Like new" },
    { id: 3, title: "Logitech Wireless Mouse", price: 1800, category: "Electronics", condition: "Good" },
    { id: 4, title: "Discrete Mathematics by Rosen", price: 2200, category: "Books", condition: "Fair" },
    { id: 5, title: "Study Table with Drawer", price: 6000, category: "Furniture", condition: "Good" },
    { id: 6, title: "Geometry Box Set", price: 600, category: "Stationery", condition: "Like new" },
];

// Load saved favourites from localStorage (Stretch goal)
const savedFavs = JSON.parse(localStorage.getItem("favs") || "[]");
const favorites = new Set(savedFavs);

// Select DOM elements
const grid = document.querySelector("#listing-grid");
const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const sortSelect = document.querySelector("#sort");
const resultCount = document.querySelector("#result-count");
const favCount = document.querySelector("#fav-count");
const savedTotal = document.querySelector("#saved-total");
const themeToggle = document.querySelector("#theme-toggle");

const formatPrice = (n) => `Rs ${n.toLocaleString("en-PK")}`;

// Safe highlight helper without using innerHTML (Stretch goal)
function setHighlightedTitle(element, text, query) {
    element.textContent = "";
    if (!query) {
        element.textContent = text;
        return;
    }
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerQuery);

    if (matchIndex === -1) {
        element.textContent = text;
        return;
    }

    const before = text.slice(0, matchIndex);
    const match = text.slice(matchIndex, matchIndex + query.length);
    const after = text.slice(matchIndex + query.length);

    const mark = document.createElement("mark");
    mark.textContent = match;

    element.append(before, mark, after);
}

function createCard(listing, currentQuery = "") {
    const article = document.createElement("article");
    article.className = "card";
    article.dataset.id = listing.id;

    const img = document.createElement("img");
    img.src = `https://placehold.co/400x300?text=${encodeURIComponent(listing.category)}`;
    img.alt = listing.title;
    img.width = 400;
    img.height = 300;

    const body = document.createElement("div");
    body.className = "card-body";

    const h3 = document.createElement("h3");
    setHighlightedTitle(h3, listing.title, currentQuery);

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(listing.price);

    const meta = document.createElement("p");
    meta.className = "meta muted";
    meta.textContent = `${listing.category} • ${listing.condition}`;

    const isFav = favorites.has(listing.id);
    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn btn";
    favBtn.type = "button";
    favBtn.setAttribute("aria-pressed", isFav);
    favBtn.textContent = isFav ? "❤️ Saved" : "🤍 Save";

    body.append(h3, price, meta, favBtn);
    article.append(img, body);
    return article;
}

function updateSavedStats() {
    favCount.textContent = favorites.size;

    // Calculate total value of saved items using reduce
    const total = listings
        .filter((l) => favorites.has(l.id))
        .reduce((sum, l) => sum + l.price, 0);

    savedTotal.textContent = `Total value of saved items: ${formatPrice(total)}`;
}

function render(items, currentQuery = "") {
    if (items.length === 0) {
        const emptyMsg = document.createElement("p");
        emptyMsg.className = "empty-message";
        emptyMsg.textContent = "No listings match your search";
        grid.replaceChildren(emptyMsg);
    } else {
        grid.replaceChildren(...items.map((item) => createCard(item, currentQuery)));
    }

    resultCount.textContent = `${items.length} item(s) found`;
    updateSavedStats();
}

function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categorySelect.value;
    const sortBy = sortSelect.value;

    // 1. Filter by search text AND category
    const filtered = listings.filter((l) => {
        const matchesQuery =
            l.title.toLowerCase().includes(query) ||
            l.category.toLowerCase().includes(query);
        const matchesCategory =
            selectedCategory === "All" || l.category === selectedCategory;

        return matchesQuery && matchesCategory;
    });

    // 2. Sort without mutating the original array using toSorted()
    let sorted = filtered;
    if (sortBy === "price-asc") {
        sorted = filtered.toSorted((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        sorted = filtered.toSorted((a, b) => b.price - a.price);
    } else {
        // Newest (by id descending or default order)
        sorted = filtered.toSorted((a, b) => b.id - a.id);
    }

    render(sorted, query);
}

// Event listeners for search, category, and sort
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// Favourites with event delegation
grid.addEventListener("click", (event) => {
    const button = event.target.closest(".fav-btn");
    if (!button) return;

    const id = Number(button.closest(".card").dataset.id);
    if (favorites.has(id)) {
        favorites.delete(id);
    } else {
        favorites.add(id);
    }

    // Persist in localStorage
    localStorage.setItem("favs", JSON.stringify([...favorites]));

    // Re-render current filtered view and update saved total immediately
    applyFilters();
});

// Dark-mode toggle
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const root = document.documentElement;
        const isDark = root.dataset.theme === "dark";
        root.dataset.theme = isDark ? "light" : "dark";
        themeToggle.textContent = isDark ? "🌙" : "☀️";
    });
}

// Initial render
applyFilters();