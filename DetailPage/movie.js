const key = "937b58fd";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const container = document.getElementById("movieDetail");

async function loadMovie() {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${key}&i=${id}`);
  const data = await res.json();

  container.innerHTML = `
    <div class="detail">
    
        <div class="img-container">
            <img src="${data.Poster}">
        </div>

        <div class="data">
            <h1>${data.Title}</h1>
 
            <div class="other-details">
                <p><b style="color: orange;">Year:</b> ${data.Year}</p>
                <p><b style="color: yellowgreen;">Genre:</b> ${data.Genre}</p>
                <p>${data.Plot}</p>
            </div>

            <div class="clickable">
                <button id="backBtn">Back</button>
                <a target="_blank" href="https://www.youtube.com/results?search_query=${data.Title}+official+trailer">
                    ▶ Watch Trailer
                </a>
            </div>

        </div>

    </div>`;
  document.getElementById("backBtn").addEventListener("click", () => {
    history.back();
  });
}


loadMovie();
