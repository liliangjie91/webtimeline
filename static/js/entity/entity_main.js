import {makeListByGroup, bindAddEntityHandlers} from './entity_utils.js'
import {mapEntityFields, mapGroupKeyMain, mapStoryTOCUrl} from './entity_config.js';

let allEntity = [];
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)(?:\/([a-zA-Z_]+))?/);
const storyId = match[1];
const entityType = match[2] ?? 'character';

const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const groupKey = mapGroupKeyMain[entityType] ?? 'category';

const apiUrl = `/api/story/${storyId}/${entityType}`;
fetch(apiUrl)
  .then(res => res.json())
  .then(entitys =>{
    allEntity = entitys;
    makeListByGroup(allEntity, storyId, entityType, groupKey);
})
const novalBtn = document.getElementById("novel-toc-link");
novalBtn.href = mapStoryTOCUrl[storyId] ?? `/static/novel/${storyId}/text/text00001.html`;
bindAddEntityHandlers(entityFields, storyId, entityType);