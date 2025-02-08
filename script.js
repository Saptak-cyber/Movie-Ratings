const searchButton = document.getElementById('search-btn');
const movieSearch = document.getElementById('movie-search');
const movieInfo = document.getElementById('movie-info');
const suggestionsList = document.getElementById('suggestions-list'); // Add an element for suggestions

// Replace with your actual OMDb API key
const omdbApiKey = '3e47cc2f'; // Only the API key

// Function to fetch movie suggestions
const getMovieSuggestions = async (query) => {
  if (!query) {
    suggestionsList.innerHTML = ''; // Clear suggestions if no input
    return;
  }

  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=${omdbApiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
      const suggestions = data.Search;
      suggestionsList.innerHTML = suggestions
        .map((movie) => `<li class="suggestion-item" data-id="${movie.imdbID}">${movie.Title} (${movie.Year})</li>`)
        .join('');
    } else {
      suggestionsList.innerHTML = '<li>No suggestions found.</li>';
    }
  } catch (error) {
    console.error('Error fetching movie suggestions:', error);
  }
};

// Event listener for input to fetch movie suggestions
movieSearch.addEventListener('input', (event) => {
  const query = event.target.value.trim();
  getMovieSuggestions(query);
});

// Event listener for clicking on a suggestion
suggestionsList.addEventListener('click', async (event) => {
  const imdbID = event.target.dataset.id;
  
  if (imdbID) {
    try {
      const response = await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
      const movieData = await response.json();

      // Display the selected movie details
      movieInfo.innerHTML = `
        <div class="movie">
          <img src="${movieData.Poster}" alt="${movieData.Title}">
          <div class="movie-details">
            <h2>${movieData.Title} (${movieData.Year})</h2>
            <p><strong>Genre:</strong> ${movieData.Genre}</p>
            <p><strong>Plot:</strong> ${movieData.Plot}</p>
            <p><strong>IMDb Rating:</strong> ${movieData.imdbRating}</p>
            <p><strong>Rotten Tomatoes Rating:</strong> ${movieData.Ratings && movieData.Ratings.find(rating => rating.Source === 'Rotten Tomatoes') ? movieData.Ratings.find(rating => rating.Source === 'Rotten Tomatoes').Value : 'Not available'}</p>
          </div>
        </div>
      `;
      suggestionsList.innerHTML = ''; // Clear suggestions after selection
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }
});
