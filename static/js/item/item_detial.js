import * as utils from '../character/character_utils.js';

let itemData = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');
const entityType = 'item';
const itemFields = [
  "name","aliases","firstChapter","category","tags","owner","price","note","description","mainEvents",'related'
];

const hiddenFields = [
 'detail-item-div-related'
];

if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!itemId) {
  document.body.innerHTML = '<h2>缺少物品ID</h2>';
} else {
  fetch(`/api/story/${storyId}/item/${itemId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('物品不存在');
      }
      return res.json();
    })
    .then(data => {
      itemData = data;
      utils.renderData(itemData, itemFields, storyId, entityType); // 自定义渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
    utils.toggleEditable(true, itemFields, hiddenFields, entityType);
};
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
    utils.toggleEditable(false, itemFields, hiddenFields, entityType);
};
// 保存编辑
document.getElementById('save-btn').onclick = () => {
    const updateData = utils.updateEntity(itemData, itemFields, entityType);
    utils.eventSaveData(updateData, itemData.id, storyId, entityType)
  };
// 删除
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(itemData.id, storyId, entityType)
}

// 图片相关
utils.imageClickToOpen(entityType)
document.getElementById("image-upload").addEventListener("change", (event) => utils.uploadImage(event,storyId, itemId, entityType));
