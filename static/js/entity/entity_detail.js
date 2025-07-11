import * as utils from './entity_utils.js';
import {mapEntityFields, mapEntityHiddenElement} from './entity_config.js';
import { initTimelineSimple } from '../timeline/timeline_init.js';

let entityData = {};

const match = window.location.pathname.match(/^\/story\/([a-zA-Z_]+)?/);
const entityType = match[1] ?? 'character';
const params = new URLSearchParams(window.location.search);
const storyId = params.get('story_id');
const entityId = params.get('entity_id');
const rTitle = params.get('title');
const rId = params.get('rid');

const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const hiddenFields = mapEntityHiddenElement[entityType] ?? [];
let targetUrl = `/api/story/${entityType}?story_id=${storyId}&entity_id=${entityId}`
if (rId){
  targetUrl = `/api/story/${entityType}?story_id=${storyId}&rid=${rId}`
}

document.addEventListener('DOMContentLoaded', () => {
if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!entityId && !rId) {
  document.body.innerHTML = '<h2>缺少项目ID</h2>';
} else {
  fetch(targetUrl)
    .then(res => {
      if (!res.ok) {
        if (entityType==='relation' && rTitle){
          const hrefYes = `/story/relation/list?story_id=${storyId}`;
          const hrefNo = `/story/network?story_id=${storyId}`;
          sessionStorage.setItem('template_entity', JSON.stringify({ title: rTitle, story_id: storyId, hrefYes:hrefYes, hrefNo:hrefNo }));
          window.location.href = '/blank';
        }else{
          throw new Error('项目不存在');
        }
      }
      return res.json();
    })
    .then(data => {
      entityData = data;
      utils.renderData(entityData, entityFields, storyId, entityType, entityId); // 自定义渲染函数
    })
    .then(() => {
      if (entityType === 'character' || entityType === 'relation') {
        // 加载人物时间线
        const extCharaName = entityType === 'character' ? entityData.name : entityData.title;
        const apiUrl = `/api/story/event?story_id=${storyId}&character_name=${encodeURIComponent(extCharaName)}`;
        fetch(apiUrl)
          .then(res => res.json())
          .then(events => {initTimeline4Character(events,extCharaName)});
        }
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

function initTimeline4Character(events,extCharaName){
    if (events.length > 0){
      document.getElementById('sub-timeline-container').classList.remove('hidden');
      if (entityData.birth){
        // 计算年龄
        events.forEach(element => {
          const age = utils.calculateAge(element.start, entityData.birth);
          element.title = element.end ? `${element.title} | ${age}岁起` :  `${element.title} | ${age}岁`;
        });
      }
      document.getElementById('sub-timeline-title').innerHTML = `<h4>  ${extCharaName}时间线</h4>`;
      initTimelineSimple(events);
    }
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
  utils.toggleEditable(true, entityFields, hiddenFields, entityType);
  };
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
  utils.toggleEditable(false, entityFields, hiddenFields, entityType);
  };
// 保存编辑
document.getElementById('save-btn').onclick = () => {
    const updateData = utils.updateEntity(entityData, entityFields, entityType);
    utils.eventSaveData(updateData, entityData.id, storyId, entityType)
  };
// 删除
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(entityData.id, storyId, entityType);
  };

// 以此为模版新建
document.getElementById('template-create-btn').onclick = () => {
  sessionStorage.setItem('template_entity', JSON.stringify(entityData));
  window.location.href = `/story/${entityType}/list?story_id=${storyId}`;
};

// 图片相关
utils.imageClickToOpen(entityType);
document.getElementById("image-upload").addEventListener("change", async (event) => utils.uploadImage(event, storyId, entityId, entityType));
})