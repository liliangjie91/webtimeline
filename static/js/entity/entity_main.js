import {makeListByGroup, bindAddEntityHandlers} from './entity_utils.js'
import {mapEntityFields, mapGroupKeyMain, mapStoryTOCUrl} from './entity_config.js';

let allEntity = [];
// let data;
const match = window.location.pathname.match(/^\/story\/([a-zA-Z_]+)?/);
const entityType = match[1] ?? 'character';
const params = new URLSearchParams(window.location.search);
const storyId = entityType=== 'story' ? '0' : params.get('story_id');
const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const groupKey = mapGroupKeyMain[entityType] ?? 'category';

const apiUrl = `/api/story/${entityType}?story_id=${storyId}`;
fetch(apiUrl)
  .then(res => res.json())
  .then(entitys =>{
    allEntity = entitys;
    makeListByGroup(allEntity, storyId, entityType, groupKey);
})
if (entityType === 'story') {
  document.getElementById('novel-toc').classList.add('hidden');
} else{
  const novalBtn = document.getElementById("novel-toc-link");
  novalBtn.href = mapStoryTOCUrl[storyId] ?? `/static/novel/${storyId}/text/text00001.html`;
}

bindAddEntityHandlers(entityFields, storyId, entityType);