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

document.addEventListener("DOMContentLoaded", () => {
  const templateDataRaw = sessionStorage.getItem('template_entity');
  if (templateDataRaw) {
    const templateData = JSON.parse(templateDataRaw);
    sessionStorage.removeItem('template_entity'); // 用完即清
    document.getElementById(`add-${entityType}-btn`).click();

    // 填充字段
    for (const key in templateData) {
      const inputEl = document.getElementById(`new-${entityType}-${key}`);
      if (inputEl && (inputEl.tagName === 'INPUT' || inputEl.tagName === 'TEXTAREA')) {
        inputEl.value = templateData[key] ?? '';
      }
    }
  }
});

bindAddEntityHandlers(entityFields, storyId, entityType);