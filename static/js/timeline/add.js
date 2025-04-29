export function bindAddHandlers() {
    document.getElementById('add-event-btn').onclick = () => {
      document.getElementById('add-popup').classList.remove('hidden');
    };
  
    document.getElementById('add-popup-close').onclick = () => {
      document.getElementById('add-popup').classList.add('hidden');
    };
  
    document.getElementById('add-event-form').onsubmit = (e) => {
      e.preventDefault();
      const curend = document.getElementById('new-end').value
      const curstart = document.getElementById('new-start').value
      if (isNaN(Date.parse(curstart))) {
        alert('开始时间格式不正确');
        return;
      }
      const sep = /[,，、;；\s]+/
      const newEvent = {
        id: Date.now(),
        title: document.getElementById('new-title').value,
        start: document.getElementById('new-start').value || clickedDate.toISOString().slice(0, 10),
        end: (curend && curend.trim() && !isNaN(Date.parse(curend))) ? curend : null,
        location: document.getElementById('new-location').value,
        keyCharacter: document.getElementById('new-key-character').value.split(sep).map(s => s.trim()).join(','),
        characters: document.getElementById('new-people').value.split(sep).map(s => s.trim()).join(','),
        story: document.getElementById('new-story').value,
        category: document.getElementById('new-category').value.split(sep).map(s => s.trim()).join(','),
        tags: document.getElementById('new-tags').value.split(sep).map(s => s.trim()).join(','),
        season: document.getElementById('new-season').value,
        specialDay: document.getElementById('new-special-day').value,
        weather: document.getElementById('new-weather').value,
        group: document.getElementById('new-group').value,
        chapter: parseInt(document.getElementById('new-chapter').value, 10) || 0, //  document.getElementById('new-chapter').value,
        note: document.getElementById('new-note').value
      };
  
      fetch('/event/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      }).then(() => {
        location.reload(); // 简化操作，重新加载页面
      });
    };
  }

export function handleAddEventFromDoubleClick(props) {
  const date = props.time;
  const group = props.group;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  document.getElementById('new-start').value = `${year}-${month}-${day}`;
  // document.getElementById('new-start').value = clickedDate.toISOString().slice(0, 16);
  document.getElementById('new-group').value = group || '';
  document.getElementById('add-popup').classList.remove('hidden');
}