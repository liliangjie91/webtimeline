import {makeListByGroup, bindAddEntityHandlers} from './entity_utils.js'
import {mapEntityFields, mapGroupKeyMain} from './entity_config.js';

let allEntity = [];
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)(?:\/([a-zA-Z_]+))?/);
const storyId = match[1];
const entityType = match[2] ?? 'character';

const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const groupKey = mapGroupKeyMain[entityType] ?? 'chara';
// console.log('entityFields', entityFields);
const apiUrl = `/api/story/${storyId}/${entityType}`;
// console.log('apiUrl', apiUrl);
fetch(apiUrl)
  .then(res => res.json())
  .then(entitys =>{
    allEntity = entitys;
    makeListByGroup(allEntity, storyId, entityType, groupKey);
})

bindAddEntityHandlers(entityFields, storyId, entityType);