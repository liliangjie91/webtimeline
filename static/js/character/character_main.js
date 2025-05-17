import {makeListByGroup, bindAddEntityHandlers} from './character_utils.js'

let allCharacters = [];
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const entityType = 'character';
const characterFields = [
  'name', 'aliases', 'gender','zi', 'birth', 'firstAge', 'firstChapter',
  'hobby', 'nature', 'addr', 'role', 'chara', 'job', 'body', 'note', 'description', 'mainEvents','related'
];
const apiUrl = `/api/story/${storyId}/${entityType}`;
// console.log('apiUrl', apiUrl);
fetch(apiUrl)
  .then(res => res.json())
  .then(characters =>{
    allCharacters = characters;
    makeListByGroup(allCharacters, storyId, entityType, 'chara');
})

bindAddEntityHandlers(characterFields, storyId, entityType);