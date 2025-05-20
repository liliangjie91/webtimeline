import * as utils from './entity_utils.js';
import {mapEntityFields, mapEntityHiddenElement} from './entity_config.js';

let entityData = {};

const match = window.location.pathname.match(/^\/story\/(\d+)(?:\/([a-zA-Z_]+))?/);
const storyId = match[1];
const entityType = match[2] ?? 'character';
const params = new URLSearchParams(window.location.search);
const entityId = params.get('id');

const entityFields = mapEntityFields[entityType] ?? mapEntityFields['character'];
const hiddenFields = mapEntityHiddenElement[entityType] ?? mapEntityHiddenElement['character'];

if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!entityId) {
  document.body.innerHTML = '<h2>缺少项目ID</h2>';
} else {
  fetch(`/api/story/${storyId}/${entityType}/${entityId}`)
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
  utils.toggleEditable(true, entityFields, hiddenFields);
  };
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
  utils.toggleEditable(false, entityFields, hiddenFields);
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