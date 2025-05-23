import {generateShortId, safeText, dateFormat} from '../utils.js';

// 加载角色或物品字典，防重复
export async function loadInfoDict(storyId, entityType = 'character') {
    try {
    const response = await fetch(`/api/story/${storyId}/${entityType}/dict`);
    return await response.json();
  } catch (error) {
    console.error(`${entityType}字典加载失败:`, error);
    return {};
  }
  }

// 展示 关联内容-关联角色/关联物品/关联事件
export async function showRelatedThings(related, storyId = '1', entityType = 'character') {
  const infoDict = await loadInfoDict(storyId, entityType);
  const relatedEl = document.getElementById(`related-${entityType}s-block`);
  relatedEl.innerHTML = '';
  if (!related) {
    relatedEl.innerHTML = '<li>无</li>';
    return;
  }
  const relatedList = related.split(';').map(relation => relation.trim());

  relatedList.forEach(relation => {
    const [relationType, name] = relation.split(':').map(item => item.trim());
    if (!relationType || !name) return;

    const nameList = name.split(',').map(item => item.trim());
    const block = document.createElement('div');
    block.className = 'relation-block';

    const label = document.createElement('div');
    label.className = 'relation-label';
    label.innerText = `${relationType}:`;
    block.appendChild(label);

    const list = document.createElement('div');
    list.className = 'relation-list';

    nameList.forEach(name => {
      if (!name) return;
      if (infoDict[name]) {
        const link = document.createElement('a');
        link.href = `/story/${storyId}/${entityType}?id=${infoDict[name]}`;
        link.textContent = name;
        link.className = 'relation-person';
        link.style.textDecoration = 'none';
        link.style.color = '#007bff';
        link.style.margin = '0';
        list.appendChild(link);
      } else {
        const span = document.createElement('span');
        span.textContent = name;
        span.className = 'relation-person';
        list.appendChild(span);
      }
    });

    block.appendChild(list);
    relatedEl.appendChild(block);
  });
}

// 设置是否可编辑
export function toggleEditable(editing, fields, hiddenFields, entityType='character', prefix = 'detail') {
  const toggle = val => {
      const element = document.getElementById(val);
      if (!element) {
        console.warn(`Element ${val} not found`);
        return;
      }
      element.contentEditable = editing;
      // 禁用自动滚动行为
      element.addEventListener('focus', (e) => {
      e.preventDefault(); // 阻止默认滚动行为
      });
  };

  const entityElements = fields.map(val => `${prefix}-${entityType}-${val}`);
  entityElements.forEach(toggle);
  document.getElementById('edit-btn').classList.toggle('hidden', editing);
  document.getElementById('save-btn').classList.toggle('hidden', !editing);
  document.getElementById('cancel-btn').classList.toggle('hidden', !editing);
  document.getElementById('delete-btn').classList.toggle('hidden', !editing);
  // if (entityType === 'event') {
  //   document.getElementById('view-original-btn').classList.toggle('hidden', !editing);
  // }
  hiddenFields.forEach(val => {
      const element = document.getElementById(val);
      if (editing) {
          element.classList.remove('hidden');
      } else {
          element.classList.add('hidden');
      }
  });
}

// 新增数据handler
export function bindAddEntityHandlers(itemFieldsForAdd, storyId, entityType) {
  document.getElementById(`add-${entityType}-btn`).onclick = () => {
    document.getElementById(`add-${entityType}-popup`).classList.remove('hidden');
  };

  document.getElementById(`add-${entityType}-popup-close`).onclick = () => {
    document.getElementById(`add-${entityType}-popup`).classList.add('hidden');
  };

  document.getElementById(`add-${entityType}-form`).onsubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交
    makeAddData(itemFieldsForAdd, storyId, entityType);
  };
}

// 修改数据
export function eventSaveData(updateData, entityId, storyId = '1', entityType = 'character'){

  if (Object.keys(updateData).length === 0) {
    alert('没有字段被修改');
    return;
  }
  updateData['updateTime'] = Date.now();
  fetch(`/api/story/${storyId}/${entityType}/${entityId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    }).then(res => {
      if (res.ok) {
        location.reload();
      } else {
        alert('更新失败');
      }
    });
}

export function updateEntity(rawData, entityFields, entityType, prefix = 'detail') {
  let updateData = {};
  entityFields.forEach(field => {
      const element = document.getElementById(`${prefix}-${entityType}-${field}`);
      if (!element) return;
      let newValue = element.innerText.trim();
      if (newValue === undefined || newValue === null || ['-','(无需)','(无)','无'].includes(newValue)) {
          return;
      }
      newValue = newValue.replaceAll('；', ';').replaceAll('，', ',').replaceAll('：', ':');
      
      let oldValue = (rawData[field] || '').toString().trim();
      if (['start', 'end'].includes(field) && oldValue){
          oldValue = dateFormat(new Date(oldValue));
      }
      if (newValue !== oldValue) {
          if (['firstAge', 'firstChapter', 'chapter'].includes(field)){
            newValue = parseInt(newValue) || null;
          }
          // if (['start', 'end'].includes(field)){
          //   newValue = (newValue.trim() && !isNaN(Date.parse(newValue))) ? newValue : null;
          // }
          updateData[field] = newValue;
      }
  });

  return updateData;
}

// 删除数据
export function eventDeleteData(entityId, storyId = '1', entityType = 'character'){
  if (confirm("确定删除吗？")) {
    fetch(`/story/${storyId}/${entityType}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: entityId })
    }).then(() => {
      window.location.href = `/story/${storyId}/${entityType}/list`;
    });
  }
}

// 上传图片并update image 地址
export async function uploadImage(event, storyId, entityId, entityType){
    const elementImg = document.getElementById(`${entityType}-img`);
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("story_id", storyId);  // 你也可以从JS动态传入
    formData.append("entity_id", entityId);
    formData.append("entity_type", entityType[0]); // c for character, i for item, e for event
  
    const res = await fetch(`/upload/image`, {
      method: "POST",
      body: formData,
    });
  
    const result = await res.json();
    if (result.status === "success") {
      elementImg.src = result.image_url + `?t=${Date.now()}`;  // 强制刷新缓存
      // 新的文件路径写入角色json
      fetch(`/api/story/${storyId}/${entityType}/${entityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"image":result.image_url})
      }).then(res => {
        if (res.ok) {
          // showSuccessMessage('更新成功');
          // location.reload();
        } else {
          alert('更新失败');
        }
      });
    } else {
      alert("上传失败：" + result.message);
    }
  }

// 展示数据-角色-物件-事件
export function renderData(item, itemFileds, storyId, entityType, showImg = true, showRelated=true) {
  document.getElementById('main-title').innerText = item.name ? safeText(item.name)+'-详情' : `${entityType}-详情`;

  itemFileds.forEach( async f => {
    const element = document.getElementById(`detail-${entityType}-${f}`);
    if (!element) {
      console.warn(`Element detail-${entityType}-${f} not found`);
      return;
    }
    if (["keyCharacter","owner"].includes(f)){
      const infoDict = await loadInfoDict(storyId);
      makeLinkInSpan(element, item[f] || '', infoDict);
      return;
    }
    element.innerText = safeText(item[f]);
  })
  if (showImg) {
    document.getElementById(`${entityType}-img`).src = item.image || `/static/imgs/${storyId}/default.jpg`;
  }
  if (showRelated) {
    showRelatedThings(item.related, storyId, entityType);
  }
  // 如有原文链接，显示按钮
  if (item.textUrl) {
    const linkBtn = document.getElementById('view-original-btn');
    linkBtn.href = item.textUrl;
    linkBtn.classList.remove('hidden');
  } 
}

 // 定义打开大图和关闭区域
export function imageClickToOpen(entityType = 'character'){
  const elementImg = document.getElementById(`${entityType}-img`);
  const elementModal = document.getElementById("img-modal");
  const elementImgInModel = document.getElementById("modal-img")

  elementImg.addEventListener("click", () => {
    // modal.style.display = "block";
    elementImgInModel.src = elementImg.src;
    elementModal.classList.remove('hidden');
    });

  // 点击空白区域关闭（注意别点到 img 上）
  elementModal.addEventListener("click", (e) => {
    if (e.target === elementModal) {
      elementModal.classList.add('hidden');
    }
  });
}

// 数据分类以表格形式展示
export function makeListByGroup(allData, storyId='1', entityType='character', groupKey='chara'){
  const grouped = allData.reduce((acc, item) => {
    const key = item[groupKey];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  const allKeys = Object.keys(grouped);
  const ul = document.getElementById(`${entityType}-list`);
  ul.innerHTML = '';
  allKeys.forEach(k=>{
    const div = document.createElement('div');
    const div01 = document.createElement('div');
    const div02 = document.createElement('ul');
    div.className = `entity-sublist`;
    div01.innerHTML = `<b>${k}</b>`
    div01.className = `entity-nametitle`;
    div02.className = `entity-namelist`;
    // const li = document.createElement('li');
    const subCharacters = grouped[k];
    subCharacters.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/story/${storyId}/${entityType}?id=${c.id}">${c.name ?? c.title}</a>`;
      div02.appendChild(li);
    });
    div.appendChild(div01)
    div.appendChild(div02)
    ul.appendChild(div)
  });
}

async function makeAddData(fieldsForAdd, storyId, entityType) {
  const resData = {}
  const infoDict = await loadInfoDict(storyId, entityType);
  const nameElement = document.getElementById(`new-${entityType}-name`);
  const sep = /[,，、;；]+/
  if (nameElement && nameElement.value.trim() in infoDict){
    alert('项目已存在!');
    return;
  }

  fieldsForAdd.forEach(f=>{
    const element = document.getElementById(`new-${entityType}-${f}`);
    if (!element) return;
    const elementValue = element.value.trim();
    if (["note","description","story","content"].includes(f)) {
      resData[f] = elementValue;
    } else if (["firstChapter","firstAge","chapter"].includes(f)){
      resData[f] = elementValue ? parseInt(elementValue) : null;
    } else if (["related"].includes(f)) {
      resData[f] = elementValue.replaceAll('，',',').replaceAll('；',';').replaceAll('：',':');
    } else{
      resData[f] = elementValue.split(sep).map(s => s.trim()).join(',')
    }
  })
  resData['createTime'] = Date.now();
  resData['updateTime'] = Date.now();
  resData['shortId'] = generateShortId();
  fetch(`/story/${storyId}/${entityType}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resData)
  }).then(() => {
    location.reload(); // 简化操作，重新加载页面
  });
}


export function handleAddEventFromDoubleClick(props, groupType='storyLine') {
  const date = props.time;
  const group = props.group;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
  const day = String(date.getDate()).padStart(2, '0');
  document.getElementById('new-event-start').value = `${year}-${month}-${day}`;
  document.getElementById(`new-event-${groupType}`).value = group || '';
  document.getElementById('add-event-popup').classList.remove('hidden');
}

// 匹配内容改为超链接
export function makeLinkInSpan(spanName, textNames, dataDict, storyId='1', entityType='character') {
  spanName.innerHTML = ''; // 先清空
  if (textNames && textNames.trim() !== '') {
    const names = Array.from(new Set(textNames.split(',').map(name => name.trim()))); // 按逗号切割、去掉空格并去重
    names.forEach((name, index) => {
      if (name) {
        if (dataDict[name]) {
          // 如果字典里有这个名字
          const link = document.createElement('a');
          link.href = `/story/${storyId}/${entityType}?id=${dataDict[name]}`; // 用ID跳转
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