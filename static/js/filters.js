import { initTimeline } from './timeline.js';

export function updateFilterOptions(events) {
  const container = document.getElementById('filter-group');
  const groups = [...new Set(events.map(e => e.group))];
  container.innerHTML = '';
    // 创建复选框
  const allOption = document.createElement('div');
  allOption.innerHTML = `
    <label><input type="checkbox" value="all" id="filter-all" /> 全部</label>
  `;
  container.appendChild(allOption);

  groups.forEach(group => {
    const option = document.createElement('div');
    option.innerHTML = `
      <label><input type="checkbox" value="${group}" class="filter-option" /> ${group}</label>
    `;
    container.appendChild(option);
  });
  
    // 监听复选框
  document.getElementById('filter-all').onchange = e => {
    const checked = e.target.checked;
    document.querySelectorAll('.filter-option').forEach(cb => cb.checked = checked);
    applyFilters(events);
  };

  document.querySelectorAll('.filter-option').forEach(cb => {
    cb.onchange = () => {
      const allChecked = [...document.querySelectorAll('.filter-option')].every(cb => cb.checked);
      document.getElementById('filter-all').checked = allChecked;
      applyFilters(events);
    };
  });
}

export function applyFilters(events) {
  const selectedGroups = [...document.querySelectorAll('.filter-option:checked')].map(cb => cb.value);
  if (selectedGroups.length === 0) {
    initTimeline([], true);
    return;
  }
  if (document.getElementById('filter-all').checked) {
    initTimeline(events, true);
    return;
  }
  const filtered = events.filter(e => selectedGroups.includes(e.group));
  initTimeline(filtered, true);
}