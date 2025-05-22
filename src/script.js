import './style.css';

async function fetchCharacters() {
  try {
    console.log('Fetching characters...');
    const response = await fetch('https://rickandmortyapi.com/api/character');
    console.log('Response received:', response);
    const data = await response.json();
    console.log('Data parsed:', data);
    renderCharacters(data.results);
  } catch (error) {
    console.error('Error fetching characters:', error);
  }
}

function renderCharacters(characters) {
  const container = document.getElementById('character-list');
  container.innerHTML = '';

  characters.forEach(char => {
    const charElement = document.createElement('div');
    charElement.classList.add('character-card');
    charElement.innerHTML = `
      <img src="${char.image}" alt="${char.name}" />
      <h3>${char.name}</h3>
      <p>Status: ${char.status}</p>
      <p>Species: ${char.species}</p>
      <p>Location: ${char.location.name}</p>
    `;
    container.appendChild(charElement);
  });
}

fetchCharacters();