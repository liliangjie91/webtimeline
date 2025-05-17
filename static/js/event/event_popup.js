import { loadInfoDict } from '../character/character_utils.js';
let selectedItem;
let dataRef;
let characterDict = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
// 事件结构体内含元素
const eventElements = ['title', 'start','end', 'location', 'keyCharacter', 'characters', 'story','category','tags','chapter','season','specialDay','weather','storyLine','note','textUrl']
const hidden_fields = ["popup-textUrl-div"]
// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  loadInfoDict(storyId).then(data => {
    characterDict = data;
  });
});

// 匹配内容改为超链接
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
  // 取消编辑
  document.getElementById('cancel-btn').onclick = () => {
    // document.querySelector('.modal-content').classList.add('editing');
    toggleEditable(false);
    document.getElementById('popup').classList.add('hidden');
  };
  // 保存编辑
  document.getElementById('save-btn').onclick = () => {
    let eventId = selectedItem.id
    if (typeof(selectedItem.id)==='string'){
      eventId = Number(selectedItem.id.split('-')[0])
    }
    const updateData = updateEvent();

    if (Object.keys(updateData).length === 0) {
        alert('没有字段被修改');
        return;
      }
    updateData['id'] = eventId;
    updateData['updateTime'] = Date.now();

    fetch(`/story/${storyId}/event/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).then(() => {
      if (typeof(selectedItem.id)==='string'){
        location.reload();
      }else{
        if ('title' in updateData){
        updateData['content'] = updateData.title;
        }
        dataRef.update(updateData);
        toggleEditable(false);
        document.getElementById('popup').classList.add('hidden');
      //   location.reload();
        // 设置时间线显示的窗口范围
      //   timeline.setWindow(dataRef.start, dataRef.end || dataRef.start);
      }
      
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

function updateEvent() {
  const sep = /[,，、;；\s]+/
  let updateData = {};
  eventElements.forEach(field => {

      const element = document.getElementById(`popup-${field}`);
      if (!element) return;
      let newValue = element.innerText.trim();
      if (newValue === undefined || newValue === null || newValue === '-' || newValue === '(无需)') {
          return;
      }
      newValue = newValue.trim().replaceAll('；', ';').replaceAll('，', ',').replaceAll('：', ':');
      
      if (field === 'end'){
        const curend = document.getElementById('popup-end').innerText;
        newValue = (curend.trim() && !isNaN(Date.parse(curend))) ? curend : null; // 结束时间特殊处理
      }
        
      
      if (field in ['keyCharacter','characters','category','tags']){
        newValue = newValue.split(sep).map(s => s.trim()).join(',')
      }
      let oldValue = (selectedItem[field] || '').toString().trim();
      if (field === 'end' || field === 'start'){
        if (oldValue){
          oldValue = dateFormat(new Date(oldValue))
        }
      }
      if (newValue !== oldValue) {
          updateData[field] = field === 'chapter' ? parseInt(newValue) || null : newValue;
      }
  });

  return updateData;
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
  makelinkinspan(document.getElementById('popup-keyCharacter'), item.keyCharacter || '');
  document.getElementById('popup-characters').innerText = item.characters || '';
  document.getElementById('popup-story').innerText = item.story || '';
  document.getElementById('popup-category').innerText = item.category || '';
  document.getElementById('popup-tags').innerText = item.tags || '';
  document.getElementById('popup-chapter').innerText = item.chapter || '';
  document.getElementById('popup-season').innerText = item.season || '';
  document.getElementById('popup-specialDay').innerText = item.specialDay || '';
  document.getElementById('popup-weather').innerText = item.weather || '';
  document.getElementById('popup-storyLine').innerText = item.storyLine || '';
  document.getElementById('popup-note').innerText = item.note || '';
  document.getElementById('popup-textUrl').innerText = item.textUrl || '';
  // 如有原文链接，显示按钮
  if (item.textUrl) {
    const linkBtn = document.getElementById('view-original-btn');
    linkBtn.href = item.textUrl;
    linkBtn.classList.remove('hidden');
  } else {
    document.getElementById('view-original-btn').classList.add('hidden');
  }

  document.getElementById('popup').classList.remove('hidden');
}

// 设置是否可编辑
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
  const toggleElements = eventElements.map(val => `popup-${val}`);
  toggleElements.forEach(toggle);
  document.getElementById('edit-btn').classList.toggle('hidden', editing);
  document.getElementById('save-btn').classList.toggle('hidden', !editing);
  document.getElementById('cancel-btn').classList.toggle('hidden', !editing);
  hidden_fields.forEach(val => {
    const element = document.getElementById(val);
    if (editing) {
        element.classList.remove('hidden');
    } else {
        element.classList.add('hidden');
    }
});
}