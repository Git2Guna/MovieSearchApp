const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieList = document.getElementById("movieList");

// create favorites container dynamically
const favoritesSection = document.createElement("div");
favoritesSection.id = "favoritesSection";
document.querySelector(".container").appendChild(favoritesSection);

const API_KEY = "Your API here";

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

searchBtn.addEventListener("click", searchMovie);

// initial render of favorites (only if exists)
renderFavorites();

async function searchMovie() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`
        );
        const data = await response.json();

        if (data.Response === "False") {
            movieList.innerHTML = "<p>No movies found</p>";
            return;
        }

        displayMovies(data.Search);
    } catch (error) {
        movieList.innerHTML = "<p>Error fetching movies</p>";
    }
}

function displayMovies(movies) {
    movieList.innerHTML = "";

    movies.forEach(movie => {
        const isFavorite = favorites.some(f => f.imdbID === movie.imdbID);

        movieList.innerHTML += `
      <div class="movie-card">
        <img src="${movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/220x320"
            }" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>

        <button
          class="${isFavorite ? "remove-btn" : "fav-btn"}"
          onclick='toggleFavorite(${JSON.stringify(movie)})'>
          ${isFavorite ? "Remove Favorite" : "Add Favorite"}
        </button>
      </div>
    `;
    });
}

function toggleFavorite(movie) {
    const index = favorites.findIndex(f => f.imdbID === movie.imdbID);

    if (index === -1) {
        favorites.push(movie);
    } else {
        favorites.splice(index, 1);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    renderFavorites();
    searchMovie(); // refresh search results
}

function renderFavorites() {
    // hide section if no favorites
    if (favorites.length === 0) {
        favoritesSection.innerHTML = "";
        favoritesSection.style.display = "none";
        return;
    }

    favoritesSection.style.display = "block";
    favoritesSection.innerHTML = `
  <h2>⭐ Favorites</h2>
  <div class="fav-grid"></div>
`;


    const favGrid = favoritesSection.querySelector(".fav-grid");

    favorites.forEach(movie => {
        favGrid.innerHTML += `
      <div class="movie-card">
        <img src="${movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/220x320"
            }" />
        <h3>${movie.Title}</h3>
        <button class="remove-btn"
          onclick='toggleFavorite(${JSON.stringify(movie)})'>
          Remove Favorite
        </button>
      </div>
    `;
    });
}

