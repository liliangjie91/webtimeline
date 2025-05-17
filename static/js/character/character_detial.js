import * as utils from './character_utils.js';

let characterData = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const params = new URLSearchParams(window.location.search);
const characterId = params.get('id');
const entityType = 'character';
const characterFields = [
  'name', 'aliases', 'gender','zi', 'birth', 'firstAge', 'firstChapter',
  'hobby', 'nature', 'addr', 'role', 'chara', 'job', 'body', 'note', 'description', 'mainEvents','related'
];
const hiddenFields = [
  'detail-character-div-related','detail-character-div-body'
];

if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!characterId) {
  document.body.innerHTML = '<h2>缺少角色ID</h2>';
} else {
  fetch(`/api/story/${storyId}/character/${characterId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('角色不存在');
      }
      return res.json();
    })
    .then(data => {
      characterData = data;
      utils.renderData(characterData, characterFields, storyId, entityType); // 自定义渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
  utils.toggleEditable(true, characterFields, hiddenFields);
  };
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
  utils.toggleEditable(false, characterFields, hiddenFields);
  };
// 保存编辑
document.getElementById('save-btn').onclick = () => {
    const updateData = utils.updateEntity(characterData, characterFields, entityType);
    utils.eventSaveData(updateData, characterData.id, storyId, entityType)
  };
// 删除人物
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(characterData.id, storyId, entityType);
  };

// 图片相关
utils.imageClickToOpen(entityType);
document.getElementById("image-upload").addEventListener("change", async (event) => utils.uploadImage(event, storyId, characterId, entityType));