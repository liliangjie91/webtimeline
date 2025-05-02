
import { bindAddCharacterHandlers } from './character_add.js';

let allCharacters = [];
// let data;

fetch('/api/character')
  .then(res => res.json())
  .then(characters =>{
    allCharacters = characters;
    const ul = document.getElementById('character-list');
    ul.innerHTML = '';

    allCharacters.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/character/${c.id}" target="_blank">${c.name}</a>`;
      // li.innerHTML = `<a href="/character/${c.id}" target="_blank">${c.name}</a>: ${c.description}`;
      ul.appendChild(li);
    });
})

bindAddCharacterHandlers();