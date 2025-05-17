import * as utils from '../character/character_utils.js';

let itemData = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');
const aimType = 'item';
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
      utils.renderData(itemData, itemFields, storyId, aimType); // 自定义渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
    utils.toggleEditable(true, itemFields, hiddenFields, aimType);
};
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
    utils.toggleEditable(false, itemFields, hiddenFields, aimType);
};
// 保存编辑
document.getElementById('save-btn').onclick = () => {
    const updateData = updateItem();
    utils.eventSaveData(updateData, itemData.id, storyId, aimType)
  };
// 删除
document.getElementById('delete-btn').onclick = () => {
    utils.eventDeleteData(itemData.id, storyId, aimType)
}

// 更新item
function updateItem() {
    let updateData = {};
    itemFields.forEach(field => {
        const element = document.getElementById(`detail-item-${field}`);
        if (!element) return;
        let newValue = element.innerText.trim();
        if (newValue === undefined || newValue === null || newValue === '-') {
            return;
        }
        newValue = newValue.trim().replaceAll('；', ';').replaceAll('，', ',').replaceAll('：', ':');
        
        const oldValue = (itemData[field] || '').toString().trim();
        if (newValue !== oldValue) {
            updateData[field] = field === 'firstAge' || field === 'firstChapter'
                ? parseInt(newValue) || null
                : newValue;
        }
    });

    return updateData;
}

// 图片相关
utils.imageClickToOpen(aimType)
document.getElementById("image-upload").addEventListener("change", (event) => utils.uploadImage(event,storyId, itemId, aimType));
