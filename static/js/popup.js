let selectedItem;
let dataRef;

export function bindPopupHandlers() {
  document.getElementById('popup-close').onclick = () => {
    document.getElementById('popup').classList.add('hidden');
  };

  document.getElementById('edit-btn').onclick = () => {
    // document.querySelector('.modal-content').classList.add('editing');
    toggleEditable(true);
  };

  document.getElementById('save-btn').onclick = () => {
    // document.querySelector('.modal-content').classList.remove('editing');
    const sep = /[,，、;；\s]+/
    const updated = { ...selectedItem };
    updated.content = document.getElementById('popup-title').innerText;
    updated.title = document.getElementById('popup-title').innerText;
    updated.start = document.getElementById('popup-start').innerText;
    updated.location = document.getElementById('popup-location').innerText;
    updated.keyCharacter = document.getElementById('popup-key-character').innerText.split(sep).map(s => s.trim());
    updated.characters = document.getElementById('popup-characters').innerText.split(sep).map(s => s.trim());
    updated.story = document.getElementById('popup-story').innerText;
    updated.category = document.getElementById('popup-category').innerText.split(sep).map(s => s.trim());
    updated.tags = document.getElementById('popup-tags').innerText.split(sep).map(s => s.trim());
    // console.log(document.getElementById('popup-tags').innerText.split(sep).map(s => s.trim()));
    updated.chapter = document.getElementById('popup-chapter').innerText;
    updated.season = document.getElementById('popup-season').innerText;
    updated.specialDay = document.getElementById('popup-special-day').innerText;
    updated.weather = document.getElementById('popup-weather').innerText;
    updated.group = document.getElementById('popup-group').innerText;
    updated.note = document.getElementById('popup-note').innerText;

    fetch('/update_event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    }).then(() => {
      dataRef.update(updated);
      toggleEditable(false);
      document.getElementById('popup').classList.add('hidden');
    //   location.reload();
      // 设置时间线显示的窗口范围
    //   timeline.setWindow(dataRef.start, dataRef.end || dataRef.start);
    });
  };

  document.getElementById('delete-btn').onclick = () => {
    if (confirm("确定删除这个事件吗？")) {
      fetch('/delete_event', {
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

export function showPopup(item, dataSet) {
  selectedItem = item;
  dataRef = dataSet;
  const dateObj = new Date(item.start);
  const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  document.getElementById('popup-title').innerText = item.title || '(无标题)';
  document.getElementById('popup-start').innerText = formattedDate;
  document.getElementById('popup-location').innerText = item.location || '';
  document.getElementById('popup-key-character').innerText = item.keyCharacter || '';
  document.getElementById('popup-characters').innerText = item.characters?.join(', ') || '';
  document.getElementById('popup-story').innerText = item.story || '';
  document.getElementById('popup-category').innerText = item.category || '';
  document.getElementById('popup-tags').innerText = item.tags?.join(', ') || '';
  document.getElementById('popup-chapter').innerText = item.chapter || '';
  document.getElementById('popup-season').innerText = item.season || '';
  document.getElementById('popup-special-day').innerText = item.specialDay || '';
  document.getElementById('popup-weather').innerText = item.weather || '';
  document.getElementById('popup-group').innerText = item.group || '';
  document.getElementById('popup-note').innerText = item.note || '';
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
  ['popup-title', 'popup-start', 'popup-location', 'popup-key-character', 'popup-characters', 'popup-story','popup-category','popup-tags'].forEach(toggle);
  ['popup-chapter','popup-season','popup-special-day','popup-weather','popup-group','popup-note'].forEach(toggle);
  document.getElementById('edit-btn').classList.toggle('hidden', editing);
  document.getElementById('save-btn').classList.toggle('hidden', !editing);
}