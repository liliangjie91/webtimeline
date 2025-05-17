
import { bindAddCharacterHandlers } from './character_add.js';
import {makeListByGroup} from './character_utils.js'

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
    makeListByGroup(allCharacters, storyId, 'character', 'chara');
})

bindAddCharacterHandlers();