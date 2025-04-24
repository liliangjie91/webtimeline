let data;
let selectedItem;
let allEvents = [];
let timeline; // 初始时间线（显示所有事件）
let filteredTimeline; // 筛选时间线
// 行为 - 初始化 - 事件时间线
fetch('/events')
  .then(response => response.json())
  .then(events => {
    allEvents = events;
    initTimeline(events);
    updateFilterOptions(events);
  });

// 函数 - 初始化时间线-
function initTimeline(events, isFiltered = false) {
  const container = isFiltered ?
    document.getElementById('visualization-selected') : // 筛选时间线的容器
    document.getElementById('visualization'); // 全局时间线的容器

  // 如果是筛选时间线，先销毁旧的筛选时间线
  if (isFiltered && filteredTimeline) {
    filteredTimeline.destroy();
    filteredTimeline = null;
    if (events.length === 0) {
      return;
    }
  }

  // 创建分组
  const groups = [...new Set(events.map(e => e.group))].map(g => ({ id: g, content: g }));

  // 创建时间线数据集
  const timelineData = new vis.DataSet(events);

  // 初始化时间线
  const timelineInstance = new vis.Timeline(container, timelineData, { groupOrder: 'content' });
  timelineInstance.setGroups(groups);

  // 设置默认的时间窗口（缩放范围）
  if (events.length > 0) {
    const start = new Date(events[0].start); // 第一个事件的开始时间
    const end = new Date(events[events.length - 1].start); // 最后一个事件的开始时间
    const buffer = 7 * 24 * 60 * 60 * 1000; // 添加一周的缓冲时间
    timelineInstance.setWindow(new Date(start.getTime() - buffer), new Date(end.getTime() + buffer));
  }

  // 如果是全局时间线，保存到全局变量 `timeline`
  if (!isFiltered) {
    timeline = timelineInstance;
    data = timelineData; // 保存全局数据集
  } else {
    // 如果是筛选时间线，保存到 `filteredTimeline`
    filteredTimeline = timelineInstance;
  }

  // 绑定事件（仅绑定一次即可）
  timelineInstance.on('select', function (props) {
    const id = props.items[0];
    if (!id) return;
    selectedItem = timelineData.get(id);
    showPopup(selectedItem);
  });

  // 监听时间线的缩放事件，并同步到其他时间线
  timelineInstance.on('rangechange', function (props) {
    const { start, end } = props;

    // 同步到筛选时间线
    if (!isFiltered && filteredTimeline) {
      filteredTimeline.setWindow(start, end, { animation: false });
    }

    // 同步到全局时间线
    if (isFiltered && timeline) {
      timeline.setWindow(start, end, { animation: false });
    }
  });
}

// 函数 - 更新下拉框选项
function updateFilterOptions(events) {
  const container = document.getElementById('filter-group');
  const groups = [...new Set(events.map(e => e.group))];
  // 清空复选框容器
  container.innerHTML = '';
  // 添加 "全部" 选项
  const allOption = document.createElement('div');
  allOption.innerHTML = `
        <label>
            <input type="checkbox" value="all" id="filter-all"/>
            全部
        </label>
    `;
  container.appendChild(allOption);
  // 添加每个分组的复选框
  groups.forEach(group => {
    const option = document.createElement('div');
    option.innerHTML = `
        <label style="margin-right: 10px;">
          <input type="checkbox" value="${group}" class="filter-option" />
          ${group}
        </label>
      `;
    container.appendChild(option);
  });
  // 监听 "全部" 复选框的行为
  document.getElementById('filter-all').onchange = (e) => {
    const checked = e.target.checked;
    document.querySelectorAll('.filter-option').forEach(checkbox => {
      checkbox.checked = checked;
    });
    applyFilters();
  };
  // 监听每个分组复选框的行为
  document.querySelectorAll('.filter-option').forEach(checkbox => {
    checkbox.onchange = () => {
      // 如果有任意一个复选框未选中，则取消 "全部" 的选中状态
      const allChecked = Array.from(document.querySelectorAll('.filter-option')).every(cb => cb.checked);
      document.getElementById('filter-all').checked = allChecked;
      applyFilters();
    };
  });
}

function applyFilters() {
  const selectedGroups = Array.from(document.querySelectorAll('.filter-option:checked')).map(cb => cb.value);
  // 如果没有选中任何分组，清空筛选时间线
  if (selectedGroups.length === 0) {
      initTimeline([], true); // 清空筛选时间线
      return;
  }
  // 如果选中了 "全部"，显示所有事件
  if (document.getElementById('filter-all').checked) {
    initTimeline(allEvents, true); // 显示全局时间线
    // console.log('data:', data);
    return;
  }
  // 筛选选中的分组对应的事件
  const filtered = allEvents.filter(e => selectedGroups.includes(e.group));
  initTimeline(filtered, true); // 更新筛选时间线
}

/////// 查看与修改事件 ///////
// 函数 - 显示事件弹窗
function showPopup(item) {
  document.getElementById('popup-title').innerText = item.content;
  document.getElementById('popup-characters').innerText = item.人物.join(', ');
  document.getElementById('popup-location').innerText = item.地点;
  document.getElementById('popup-story').innerText = item.故事;
  document.getElementById('popup').classList.remove('hidden');
}

// 行为 - 关闭弹窗
document.getElementById('popup-close').onclick = () => {
  document.getElementById('popup').classList.add('hidden');
};

// 行为 - 事件弹窗内编辑
document.getElementById('edit-btn').onclick = () => {
  document.getElementById('popup-title').contentEditable = true;
  document.getElementById('popup-characters').contentEditable = true;
  document.getElementById('popup-location').contentEditable = true;
  document.getElementById('popup-story').contentEditable = true;

  document.getElementById('edit-btn').classList.add('hidden');
  document.getElementById('save-btn').classList.remove('hidden');
};

// 行为 - 保存编辑
document.getElementById('save-btn').onclick = () => {
  const updatedItem = { ...selectedItem };

  updatedItem.content = document.getElementById('popup-title').innerText;
  updatedItem.人物 = document.getElementById('popup-characters').innerText.split(',').map(s => s.trim());
  updatedItem.地点 = document.getElementById('popup-location').innerText;
  updatedItem.故事 = document.getElementById('popup-story').innerText;

  fetch('/update_event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem)
  }).then(() => {
    data.update(updatedItem); // 前端更新
    document.getElementById('popup-title').contentEditable = false;
    document.getElementById('popup-characters').contentEditable = false;
    document.getElementById('popup-location').contentEditable = false;
    document.getElementById('popup-story').contentEditable = false;

    document.getElementById('edit-btn').classList.remove('hidden');
    document.getElementById('save-btn').classList.add('hidden');
  });
};

/////// 新增事件的弹窗 ///////
// 行为 - 添加事件 - 打开新增内容的弹窗
document.getElementById('add-event-btn').onclick = () => {
  document.getElementById('add-popup').classList.remove('hidden');
};

// 行为 - 添加事件 - 关闭弹窗
document.getElementById('add-popup-close').onclick = () => {
  document.getElementById('add-popup').classList.add('hidden');
};

// 行为 - 添加事件 - 提交新事件保存
document.getElementById('add-event-form').onsubmit = (e) => {
  e.preventDefault();

  const newEvent = {
    id: Date.now(),
    content: document.getElementById('new-content').value,
    start: document.getElementById('new-start').value,
    group: document.getElementById('new-group').value,
    人物: document.getElementById('new-people').value.split(',').map(s => s.trim()),
    地点: document.getElementById('new-location').value,
    故事: document.getElementById('new-story').value
  };

  fetch('/add_event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent)
  }).then(() => {
    data.add(newEvent);
    timeline.setGroups([...new Set(data.get().map(e => e.group))].map(g => ({ id: g, content: g })));
    document.getElementById('add-popup').classList.add('hidden');
    document.getElementById('add-event-form').reset();
  });
};

/////// 删除事件 ///////
// 行为 - 删除事件 - 打开删除内容的弹窗
document.getElementById('delete-btn').onclick = () => {
  if (confirm("确定删除这个事件吗？")) {
    fetch('/delete_event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedItem.id })
    }).then(() => {
      data.remove(selectedItem.id);
      allEvents = allEvents.filter(e => e.id !== selectedItem.id);
      document.getElementById('popup').classList.add('hidden');
    });
  }
};