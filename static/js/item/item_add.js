import { loadInfoDict } from '../character/character_utils.js';
let itemDict = {};

const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  loadInfoDict(storyId, 'item').then(data => {
    itemDict = data;
    // console.log('角色字典加载成功', itemDict);
    // 此处可以调用渲染函数或做其他操作
  });
});

// 角色添加功能
export function bindAddItemHandlers() {
    document.getElementById('add-item-btn').onclick = () => {
      document.getElementById('add-item-popup').classList.remove('hidden');
    };
  
    document.getElementById('add-item-popup-close').onclick = () => {
      document.getElementById('add-item-popup').classList.add('hidden');
    };
  
    document.getElementById('add-item-form').onsubmit = (e) => {
      e.preventDefault(); // 阻止表单默认提交
      const name0 = document.getElementById('new-item-name').value.trim();
      if (name0 in itemDict) {
        alert('物品已存在，请更换物品');
        return;
      }
      const sep = /[,，、;；\s]+/
      const itemData = {
          createTime: Date.now(),
          updateTime: Date.now(),
          name: name0,
          aliases: document.getElementById('new-item-aliases').value.trim().split(sep).map(s => s.trim()).join(','),
          firstChapter: parseInt(document.getElementById('new-item-firstChapter').value) || null,
          category: document.getElementById('new-item-category').value.trim(),
          tags: document.getElementById('new-item-tags').value.trim().split(sep).map(s => s.trim()).join(','),
          owner: document.getElementById('new-item-owner').value.trim().split(sep).map(s => s.trim()).join(','),
          price: document.getElementById('new-item-price').value.trim(),
          note: document.getElementById('new-item-note').value.trim(),
          description: document.getElementById('new-item-description').value.trim(),
          mainEvents: document.getElementById('new-item-mainEvents').value.trim().replaceAll('；',';'),
      };
      
      fetch(`/story/${storyId}/item/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      }).then(() => {
        location.reload(); // 简化操作，重新加载页面
      });
    };
  }