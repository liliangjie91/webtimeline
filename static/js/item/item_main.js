import {bindAddEntityHandlers, makeListByGroup} from '../character/character_utils.js'

let allItems = [];
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const entityType = 'item';
const itemFieldsForAdd = [
  "name","aliases","firstChapter","category","tags","owner","price","note","description","mainEvents"
];
const apiUrl = `/api/story/${storyId}/${entityType}`;
// console.log('apiUrl', apiUrl);
fetch(apiUrl)
  .then(res => res.json())
  .then(items =>{
    allItems = items;
    makeListByGroup(allItems, storyId, entityType, 'category');
})

bindAddEntityHandlers(itemFieldsForAdd, storyId, entityType);