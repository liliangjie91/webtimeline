let characterDict = {};

function loadCharacterDict() {
  fetch('/api/character_dict')
    .then(response => response.json())
    .then(data => {
      characterDict = data;
      // console.log('角色字典加载成功', characterDict);
    })
    .catch(error => {
      console.error('角色字典加载失败:', error);
    });
}
// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', loadCharacterDict);

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
      const characterData = {
          create_time: Date.now(),
          update_time: Date.now(),
          name: name0,
          aliases: document.getElementById('new-character-aliases').value.trim(),
          zi: document.getElementById('new-character-zi').value.trim(),
          birth: document.getElementById('new-character-birth').value,  // date 类型
          first_age: parseInt(document.getElementById('new-character-first-age').value) || null,
          first_chapter: parseInt(document.getElementById('new-character-first-chapter').value) || null,
          hobby: document.getElementById('new-character-hobby').value.trim(),
          nature: document.getElementById('new-character-nature').value.trim(),
          addr: document.getElementById('new-character-addr').value.trim(),
          role: document.getElementById('new-character-role').value.trim(),
          chara: document.getElementById('new-character-chara').value.trim(),
          job: document.getElementById('new-character-job').value.trim(),
          note: document.getElementById('new-character-note').value.trim(),
          main_events: document.getElementById('new-character-main-events').value.trim()
      };
      
      fetch('/character/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(characterData)
      }).then(() => {
        location.reload(); // 简化操作，重新加载页面
      });
    };
  }