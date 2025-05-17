import * as utils from './character_utils.js';

let characterData = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const params = new URLSearchParams(window.location.search);
const characterId = params.get('id');
const aimType = 'character';
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
      utils.renderData(characterData, characterFields, storyId, aimType); // 自定义渲染函数
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
    const updateData = updateCharacter();
    utils.eventSaveData(updateData, characterData.id, storyId, aimType)
  };
// 删除人物
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(characterData.id, storyId, aimType);
  };

function updateCharacter() {
    let updateData = {};
    characterFields.forEach(field => {
        const element = document.getElementById(`detail-character-${field}`);
        if (!element) return;
        let newValue = element.innerText.trim();
        if (newValue === undefined || newValue === null || newValue === '-') {
            return;
        }
        newValue = newValue.trim().replaceAll('；', ';').replaceAll('，', ',').replaceAll('：', ':');
        
        const oldValue = (characterData[field] || '').toString().trim();
        if (newValue !== oldValue) {
            updateData[field] = field === 'firstAge' || field === 'firstChapter'
                ? parseInt(newValue) || null
                : newValue;
        }
    });

    return updateData;
}

// 图片相关
utils.imageClickToOpen(aimType);
document.getElementById("image-upload").addEventListener("change", async (event) => utils.uploadImage(event, storyId, characterId, aimType));