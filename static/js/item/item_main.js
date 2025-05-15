
import { bindAddItemHandlers } from './item_add.js';

let allItems = [];
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const apiUrl = `/api/story/${storyId}/item`;
// console.log('apiUrl', apiUrl);
fetch(apiUrl)
  .then(res => res.json())
  .then(items =>{
    allItems = items;
    makeListByGroup(allItems);
})

function makeListByGroup(allItems){
  const grouped = allItems.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  const allKeys = Object.keys(grouped);
  const ul = document.getElementById('item-list');
  ul.innerHTML = '';
  allKeys.forEach(k=>{
    const div = document.createElement('div');
    const div01 = document.createElement('div');
    const div02 = document.createElement('ul');
    div.className = "item-sublist";
    div01.innerHTML = `<b>${k}</b>`
    div01.className = "item-nametitle";
    div02.className = "item-namelist";
    const li = document.createElement('li');
    const subItems = grouped[k];
    subItems.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/story/${storyId}/item?id=${c.id}">${c.name}</a>`;
      // li.innerHTML = `<a href="/story/${storyId}/item?id=${c.id}" target="_blank">${c.name}</a>`;
      // li.innerHTML = `<a href="/item/${c.id}" target="_blank">${c.name}</a>: ${c.description}`;
      div02.appendChild(li);
    });
    div.appendChild(div01)
    div.appendChild(div02)
    ul.appendChild(div)
  });
}

bindAddItemHandlers();