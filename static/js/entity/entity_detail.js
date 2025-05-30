import * as utils from './entity_utils.js';
import {mapEntityFields, mapEntityHiddenElement} from './entity_config.js';

let entityData = {};

const match = window.location.pathname.match(/^\/story\/([a-zA-Z_]+)?/);
const entityType = match[1] ?? 'character';
const params = new URLSearchParams(window.location.search);
const storyId = params.get('story_id');
const entityId = params.get('entity_id');

const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const hiddenFields = mapEntityHiddenElement[entityType] ?? [];

document.addEventListener('DOMContentLoaded', () => {
if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!entityId) {
  document.body.innerHTML = '<h2>缺少项目ID</h2>';
} else {
  fetch(`/api/story/${entityType}?story_id=${storyId}&entity_id=${entityId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('项目不存在');
      }
      return res.json();
    })
    .then(data => {
      entityData = data;
      utils.renderData(entityData, entityFields, storyId, entityType); // 自定义渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
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
// 删除人物
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(entityData.id, storyId, entityType);
  };

// 图片相关
utils.imageClickToOpen(entityType);
document.getElementById("image-upload").addEventListener("change", async (event) => utils.uploadImage(event, storyId, entityId, entityType));
})