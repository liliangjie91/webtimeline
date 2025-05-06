import { loadCharacterDict } from '../character/character_utils.js';
let selectedItem;
let dataRef;
let characterDict = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];

// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  loadCharacterDict(storyId).then(data => {
    characterDict = data;
  });
});


function makelinkinspan(spanName, textNames) {
  spanName.innerHTML = ''; // 先清空
  if (textNames && textNames.trim() !== '') {
    const names = Array.from(new Set(textNames.split(',').map(name => name.trim()))); // 按逗号切割、去掉空格并去重
    names.forEach((name, index) => {
      if (name) {
        if (characterDict[name]) {
          // 如果字典里有这个名字
          const link = document.createElement('a');
          link.href = `/story/${storyId}/character?id=${characterDict[name]}`; // 用ID跳转
          link.textContent = name;
          link.style.textDecoration = 'none';
          link.target = '_blank'; // 在新标签页打开
          link.style.color = '#007bff';
          link.style.margin = '0';
          spanName.appendChild(link);
        } else {
          // 如果没有，就直接显示名字
          const span = document.createElement('span');
          span.textContent = name;
          span.style.padding = '0';
          spanName.appendChild(span);
        }
        if (index < names.length - 1) {
          const comma = document.createElement('span');
          comma.textContent = ',';
          comma.style.padding = '0';
          spanName.appendChild(comma);
        }
      }
    });
  } else {
    spanName.innerText = '';
  }
}

export function bindPopupHandlers() {
  document.getElementById('popup-close').onclick = () => {
    document.getElementById('popup').classList.add('hidden');
  };

  // 开始编辑
  document.getElementById('edit-btn').onclick = () => {
    // document.querySelector('.modal-content').classList.add('editing');
    toggleEditable(true);
  };

  // 保存编辑
  document.getElementById('save-btn').onclick = () => {
    // document.querySelector('.modal-content').classList.remove('editing');
    const sep = /[,，、;；\s]+/
    const updated = { ...selectedItem };
    updated.content = document.getElementById('popup-title').innerText;
    updated.title = document.getElementById('popup-title').innerText;
    updated.start = document.getElementById('popup-start').innerText;
    const curend = document.getElementById('popup-end').innerText;
    updated.end = (curend.trim() && !isNaN(Date.parse(curend))) ? curend : null; // 结束时间特殊处理
    updated.location = document.getElementById('popup-location').innerText;
    updated.keyCharacter = document.getElementById('popup-key-character').innerText.split(sep).map(s => s.trim()).join(',');
    updated.characters = document.getElementById('popup-characters').innerText.split(sep).map(s => s.trim()).join(',');
    updated.story = document.getElementById('popup-story').innerText;
    updated.category = document.getElementById('popup-category').innerText.split(sep).map(s => s.trim()).join(',');
    updated.tags = document.getElementById('popup-tags').innerText.split(sep).map(s => s.trim()).join(',');
    // console.log(document.getElementById('popup-tags').innerText.split(sep).map(s => s.trim()));
    updated.chapter = document.getElementById('popup-chapter').innerText;
    updated.season = document.getElementById('popup-season').innerText;
    updated.specialDay = document.getElementById('popup-special-day').innerText;
    updated.weather = document.getElementById('popup-weather').innerText;
    updated.group = document.getElementById('popup-group').innerText;
    updated.note = document.getElementById('popup-note').innerText;

    fetch(`/story/${storyId}/event/${selectedItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).then(() => {
      dataRef.update(updated);
      toggleEditable(false);
      loadCharacterDict()
      document.getElementById('popup').classList.add('hidden');
    //   location.reload();
      // 设置时间线显示的窗口范围
    //   timeline.setWindow(dataRef.start, dataRef.end || dataRef.start);
    });
  };

  // 删除事件
  document.getElementById('delete-btn').onclick = () => {
    if (confirm("确定删除这个事件吗？")) {
      fetch(`/story/${storyId}/event/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem.id })
      }).then(() => {
        dataRef.remove(selectedItem.id);
        document.getElementById('popup').classList.add('hidden');
        // location.reload();
      });
    }
  };
}

function dateFormat(dateObj){
  if (dateObj.getHours() === 0 && dateObj.getMinutes() == 0) {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
}

// 显示弹出窗口
export function showPopup(item, dataSet) {
  selectedItem = item;
  dataRef = dataSet;
  document.getElementById('popup-start').innerText = dateFormat(new Date(item.start));
  document.getElementById('popup-end').innerText = item.end ? dateFormat(new Date(item.end)) : '(无需)';

  document.getElementById('popup-title').innerText = item.title || '(无标题)';
  document.getElementById('popup-location').innerText = item.location || '';
  // 主角链接处理
  makelinkinspan(document.getElementById('popup-key-character'), item.keyCharacter || '');
  document.getElementById('popup-characters').innerText = item.characters || '';
  document.getElementById('popup-story').innerText = item.story || '';
  document.getElementById('popup-category').innerText = item.category || '';
  document.getElementById('popup-tags').innerText = item.tags || '';
  document.getElementById('popup-chapter').innerText = item.chapter || '';
  document.getElementById('popup-season').innerText = item.season || '';
  document.getElementById('popup-special-day').innerText = item.specialDay || '';
  document.getElementById('popup-weather').innerText = item.weather || '';
  document.getElementById('popup-group').innerText = item.group || '';
  document.getElementById('popup-note').innerText = item.note || '';
  // 如有原文链接，显示按钮
  if (item.url) {
    const linkBtn = document.getElementById('view-original-btn');
    linkBtn.href = item.url;
    linkBtn.classList.remove('hidden');
  } else {
    document.getElementById('view-original-btn').classList.add('hidden');
  }

  document.getElementById('popup').classList.remove('hidden');
}

function toggleEditable(editing) {
  // const toggle = val => document.getElementById(val).contentEditable = editing;
  const toggle = val => {
    const element = document.getElementById(val);
    element.contentEditable = editing;

    // 禁用自动滚动行为
    element.addEventListener('focus', (e) => {
      e.preventDefault(); // 阻止默认滚动行为
    });
  };
  ['popup-title', 'popup-start','popup-end', 'popup-location', 'popup-key-character', 'popup-characters', 'popup-story','popup-category','popup-tags'].forEach(toggle);
  ['popup-chapter','popup-season','popup-special-day','popup-weather','popup-group','popup-note'].forEach(toggle);
  document.getElementById('edit-btn').classList.toggle('hidden', editing);
  document.getElementById('save-btn').classList.toggle('hidden', !editing);
}