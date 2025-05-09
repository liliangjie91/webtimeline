
import { bindAddCharacterHandlers } from './character_add.js';

let allCharacters = [];
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const apiUrl = `/api/story/${storyId}/character`;
// console.log('apiUrl', apiUrl);
fetch(apiUrl)
  .then(res => res.json())
  .then(characters =>{
    allCharacters = characters;
    makeListByGroup(allCharacters);
})

function makeListByGroup(allCharacters){
  const grouped = allCharacters.reduce((acc, item) => {
    const key = item.chara;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  const allKeys = Object.keys(grouped);
  const ul = document.getElementById('character-list');
  ul.innerHTML = '';
  allKeys.forEach(k=>{
    const div = document.createElement('div');
    const div01 = document.createElement('div');
    const div02 = document.createElement('ul');
    div.className = "character-sublist";
    div01.innerHTML = `<b>${k}</b>`
    div01.className = "character-nametitle";
    div02.className = "character-namelist";
    const li = document.createElement('li');
    const subCharacters = grouped[k];
    subCharacters.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/story/${storyId}/character?id=${c.id}" target="_blank">${c.name}</a>`;
      // li.innerHTML = `<a href="/character/${c.id}" target="_blank">${c.name}</a>: ${c.description}`;
      div02.appendChild(li);
    });
    div.appendChild(div01)
    div.appendChild(div02)
    ul.appendChild(div)
  });
}

bindAddCharacterHandlers();