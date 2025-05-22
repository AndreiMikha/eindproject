import './style.css';

const API_URL = 'https://rickandmortyapi.com/api/character';
const characterList = document.getElementById('character-list');
const searchInput = document.getElementById('search');
const statusFilter = document.getElementById('status-filter');
const speciesFilter = document.getElementById('species-filter');
const sortOrderSelect = document.getElementById('sort-order');
const favoritesFilter = document.getElementById('favorites-filter');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let allCharacters = [];
let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);

async function fetchCharacters() {
  const response = await fetch(API_URL);
  const data = await response.json();
  allCharacters = data.results;
  update(); // trigger eerste render
}

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify([...favorites]));
}

function renderCharacters(characters) {
  characterList.innerHTML = '';
  if (characters.length === 0) {
    characterList.innerHTML = '<p style="text-align:center;">Geen resultaten gevonden.</p>';
    return;
  }

  characters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'character-card';
    card.innerHTML = `
      <img src="${char.image}" alt="${char.name}">
      <h3>${char.name}</h3>
      <p>Status: ${char.status}</p>
      <p>Species: ${char.species}</p>
      <p>Location: ${char.location.name}</p>
      <button class="fav-btn">${favorites.has(char.id) ? '★ Verwijder' : '☆ Favoriet'}</button>
    `;

    const favBtn = card.querySelector('.fav-btn');
    favBtn.addEventListener('click', () => {
      if (favorites.has(char.id)) {
        favorites.delete(char.id);
      } else {
        favorites.add(char.id);
      }
      saveFavorites();
      update(); // opnieuw renderen met huidige filters
    });

    characterList.appendChild(card);
  });
}

function filterCharacters(characters) {
  let result = characters;

  const search = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const species = speciesFilter.value;
  const onlyFavs = favoritesFilter.checked;

  if (search) {
    result = result.filter(char => char.name.toLowerCase().includes(search));
  }

  if (status) {
    result = result.filter(char => char.status === status);
  }

  if (species) {
    result = result.filter(char => char.species === species);
  }

  if (onlyFavs) {
    result = result.filter(char => favorites.has(char.id));
  }

  return result;
}

function sortCharacters(characters, order) {
  const sorted = [...characters];
  if (order === 'name-asc') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (order === 'name-desc') {
    sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
  return sorted;
}

function update() {
  const filtered = filterCharacters(allCharacters);
  const sorted = sortCharacters(filtered, sortOrderSelect.value);
  renderCharacters(sorted);
}

// Dark mode
function initDarkMode() {
  const prefersDark = localStorage.getItem('dark-mode') === 'true';
  document.body.classList.toggle('dark', prefersDark);
  darkModeToggle.checked = prefersDark;

  darkModeToggle.addEventListener('change', () => {
    const enabled = darkModeToggle.checked;
    document.body.classList.toggle('dark', enabled);
    localStorage.setItem('dark-mode', enabled);
  });
}

// Event listeners
[searchInput, statusFilter, speciesFilter, sortOrderSelect, favoritesFilter].forEach(el => {
  el.addEventListener('input', update);
});

initDarkMode();
fetchCharacters();
