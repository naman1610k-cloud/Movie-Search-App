const key = `937b58fd`

const input = document.getElementById("searchInput");
const btn = document.getElementById("btn");
const results = document.getElementById("result");
const loading = document.getElementById("loading");

let timer;
let currentPage = 1;


const getData = async () => {
    let val = input.value;

    // reset page when new search typed manually
    if (!results.dataset.query || results.dataset.query !== val) {
        currentPage = 1;
        results.dataset.query = val;
    }

    if (!val) return

    try {
        loading.style.display = "block";
        results.innerHTML = "";


        for (let i = 0; i < 8; i++) {
            results.innerHTML += `<div class="skeleton"></div>`;
        }

        const URL = `https://www.omdbapi.com/?apikey=${key}&s=${val}&page=${currentPage}`
        let res = await fetch(URL);
        let data = await res.json();

        loading.style.display = "none";
        results.innerHTML = "";


        if (!data.Search) {
            results.innerHTML = "<p>No results found</p>";
            return;
        }

        data.Search.forEach(movie => {                           //Render Cards
            const poster = movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image";

            const card = `
            <div class = "card" data-id="${movie.imdbID}">
                <img src = "${poster}" alt = "movie"></img>
                <h2>${movie.Title}</h2>
                <p>${movie.Year}</p>
            </div>
            `;
            results.innerHTML += card
        });

        // ✅ pagination buttons
        results.innerHTML += `
        <div class="pagination">
            <button id="prevPage">Prev</button>
            <span>Page ${currentPage}</span>
            <button id="nextPage">Next</button>
        </div>
`;

        // ✅ ADD — save state
        localStorage.setItem("lastResults", JSON.stringify(data.Search));
        localStorage.setItem("lastQuery", val);
        localStorage.setItem("lastPage", currentPage);

    } catch (err) {
        loading.style.display = "none";
        results.innerHTML = "<p>Something went wrong</p>";
        console.error(err);
    }
}

results.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;

    const id = card.dataset.id;
    window.location.href = `../DetailPage/movie.html?id=${id}`;
});


input.addEventListener("input", () => {
    if (!input.value.trim()) {
        results.innerHTML = "";
    }
});

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getData();
    }
});

input.addEventListener("input", () => {                      // Debounce search
    clearTimeout(timer);

    if (!input.value.trim()) {
        results.innerHTML = "";
        return;
    }

    timer = setTimeout(() => {
        getData();
    }, 500);
});


btn.addEventListener("click", getData)


window.addEventListener("load", () => {
    const saved = localStorage.getItem("lastResults");

    if (!saved) {
        input.value = "batman";
        getData()
    }
})
// ✅ ADD — restore state on page load
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("lastResults");
    const lastQuery = localStorage.getItem("lastQuery");
    const savedPage = localStorage.getItem("lastPage");   // ✅ ADD

    if (!saved) return;

    if (savedPage) {
        currentPage = Number(savedPage);
    }

    input.value = lastQuery || "";

    const movies = JSON.parse(saved);

    movies.forEach(movie => {
        const card = `
        <div class = "card" data-id="${movie.imdbID}">
            <img src = "${movie.Poster}" alt = "movie"></img>
            <h2>${movie.Title}</h2>
            <p>${movie.Year}</p>
        </div>
        `;
        results.innerHTML += card
    });

    // ✅ restore pagination UI
    results.innerHTML += `
    <div class="pagination">
        <button id="prevPage">Prev</button>
        <span>Page ${currentPage}</span>
        <button id="nextPage">Next</button>
    </div>
`;
});

// ✅ pagination click
results.addEventListener("click", (e) => {
    if (e.target.id === "nextPage") {
        currentPage++;
        getData();
    }

    if (e.target.id === "prevPage" && currentPage > 1) {
        currentPage--;
        getData();
    }
});
