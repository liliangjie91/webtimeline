import { loadInfoDict } from './character_utils.js';
let characterDict = {};

const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  loadInfoDict(storyId).then(data => {
    characterDict = data;
    // console.log('角色字典加载成功', characterDict);
    // 此处可以调用渲染函数或做其他操作
  });
});

// 角色添加功能
export function bindAddCharacterHandlers() {
    document.getElementById('add-character-btn').onclick = () => {
      document.getElementById('add-character-popup').classList.remove('hidden');
    };
  
    document.getElementById('add-character-popup-close').onclick = () => {
      document.getElementById('add-character-popup').classList.add('hidden');
    };
  
    document.getElementById('add-character-form').onsubmit = (e) => {
      e.preventDefault(); // 阻止表单默认提交
      const name0 = document.getElementById('new-character-name').value.trim();
      if (name0 in characterDict) {
        alert('角色名已存在，请更换角色名');
        return;
      }
      const sep = /[,，、;；\s]+/
      const characterData = {
          createTime: Date.now(),
          updateTime: Date.now(),
          name: name0,
          aliases: document.getElementById('new-character-aliases').value.trim().split(sep).map(s => s.trim()).join(','),
          zi: document.getElementById('new-character-zi').value.trim(),
          birth: document.getElementById('new-character-birth').value,  // date 类型
          firstAge: parseInt(document.getElementById('new-character-firstAge').value) || null,
          firstChapter: parseInt(document.getElementById('new-character-firstChapter').value) || null,
          hobby: document.getElementById('new-character-hobby').value.trim().split(sep).map(s => s.trim()).join(','),
          nature: document.getElementById('new-character-nature').value.trim().split(sep).map(s => s.trim()).join(','),
          addr: document.getElementById('new-character-addr').value.trim(),
          role: document.getElementById('new-character-role').value.trim().split(sep).map(s => s.trim()).join(','),
          chara: document.getElementById('new-character-chara').value.trim(),
          job: document.getElementById('new-character-job').value.trim().split(sep).map(s => s.trim()).join(','),
          body: document.getElementById('new-character-body').value.trim(),
          note: document.getElementById('new-character-note').value.trim(),
          description: document.getElementById('new-character-description').value.trim(),
          mainEvents: document.getElementById('new-character-mainEvents').value.trim().replaceAll('；',';'),
          related: document.getElementById('new-character-related').value.trim().replaceAll('，',',').replaceAll('；',';').replaceAll('：',':'),
      };
      
      fetch(`/story/${storyId}/character/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
      }).then(() => {
        location.reload(); // 简化操作，重新加载页面
      });
    };
  }
  const characterFields = [
    'name', 'aliases', 'gender','zi', 'birth', 'firstAge', 'firstChapter',
    'hobby', 'nature', 'addr', 'role', 'chara', 'job', 'body', 'note', 'description', 'mainEvents','related'
  ];