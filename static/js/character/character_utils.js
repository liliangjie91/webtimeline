// 加载角色或物品字典，防重复
export async function loadInfoDict(storyId, aimType = 'character') {
    try {
    const response = await fetch(`/api/story/${storyId}/${aimType}_dict`);
    return await response.json();
  } catch (error) {
    console.error(`${aimType}字典加载失败:`, error);
    return {};
  }
  }

// 展示 关联内容-关联角色/关联物品/关联事件
export async function showRelatedThings(related, storyId = '1', aimType = 'character') {
  const infoDict = await loadInfoDict(storyId, aimType);
  const relatedEl = document.getElementById(`related-${aimType}s-block`);
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
        link.href = `/story/${storyId}/${aimType}?id=${infoDict[name]}`;
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
export function toggleEditable(editing, fields, hiddenFields, aimType='character') {
  const toggle = val => {
      const element = document.getElementById(val);
      // console.log(element);
      element.contentEditable = editing;
      // 禁用自动滚动行为
      element.addEventListener('focus', (e) => {
      e.preventDefault(); // 阻止默认滚动行为
      });
  };

  const aimElements = fields.map(val => `detail-${aimType}-${val}`);
  aimElements.forEach(toggle);
  document.getElementById('edit-btn').classList.toggle('hidden', editing);
  document.getElementById('save-btn').classList.toggle('hidden', !editing);
  document.getElementById('cancel-btn').classList.toggle('hidden', !editing);
  document.getElementById('delete-btn').classList.toggle('hidden', !editing);
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
export function bindAddEntityHandlers(itemFieldsForAdd, storyId, aimType) {
  document.getElementById(`add-${aimType}-btn`).onclick = () => {
    document.getElementById(`add-${aimType}-popup`).classList.remove('hidden');
  };

  document.getElementById(`add-${aimType}-popup-close`).onclick = () => {
    document.getElementById(`add-${aimType}-popup`).classList.add('hidden');
  };

  document.getElementById(`add-${aimType}-form`).onsubmit = (e) => {
    e.preventDefault(); // 阻止表单默认提交
    makeAddData(itemFieldsForAdd, storyId, aimType);
  };
}

// 修改数据
export function eventSaveData(updateData, aimId, storyId = '1', aimType = 'character'){

  if (Object.keys(updateData).length === 0) {
    alert('没有字段被修改');
    return;
  }
  updateData['updateTime'] = Date.now();
  fetch(`/api/story/${storyId}/${aimType}/${aimId}`, {
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

// 删除数据
export function eventDeleteData(aimId, storyId = '1', aimType = 'character'){
  if (confirm("确定删除吗？")) {
    fetch(`/story/${storyId}/${aimType}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: aimId })
    }).then(() => {
      window.location.href = `/story/${storyId}/${aimType}_list`;
    });
  }
}

// 上传图片并update image 地址
export async function uploadImage(event, storyId, aimId, aimType){
    const elementImg = document.getElementById(`${aimType}-img`);
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("story_id", storyId);  // 你也可以从JS动态传入
    formData.append("aim_id", aimId);
    formData.append("aim_type", aimType[0]); // c for item
  
    const res = await fetch(`/upload/image`, {
      method: "POST",
      body: formData,
    });
  
    const result = await res.json();
    if (result.status === "success") {
      elementImg.src = result.image_url + `?t=${Date.now()}`;  // 强制刷新缓存
      // 新的文件路径写入角色json
      fetch(`/api/story/${storyId}/${aimType}/${aimId}`, {
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

function safeText(value) {
  return value !== undefined && value !== null && value !== '' ? value : '';
}
// 展示数据-角色-物件-事件
export function renderData(item, itemFileds, storyId, aimType, showImg = true, showRelated=true) {
  document.getElementById('main-title').innerText = item.name ? safeText(item.name)+'-详情' : `${aimType}详情`;
  itemFileds.forEach( f => {
    document.getElementById(`detail-${aimType}-${f}`).innerText = safeText(item[f]);
  })
  if (showImg) {
    document.getElementById(`${aimType}-img`).src = item.image || `/static/imgs/${storyId}/${aimType}_default.jpg`;
  }
  if (showRelated) {
    showRelatedThings(item.related);
  }
}

 // 定义打开大图和关闭区域
export function imageClickToOpen(aimType = 'character'){
  const elementImg = document.getElementById(`${aimType}-img`);
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
export function makeListByGroup(allData, storyId='1', aimType='character', groupKey='chara'){
  const grouped = allData.reduce((acc, item) => {
    const key = item[groupKey];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
  const allKeys = Object.keys(grouped);
  const ul = document.getElementById(`${aimType}-list`);
  ul.innerHTML = '';
  allKeys.forEach(k=>{
    const div = document.createElement('div');
    const div01 = document.createElement('div');
    const div02 = document.createElement('ul');
    div.className = `${aimType}-sublist`;
    div01.innerHTML = `<b>${k}</b>`
    div01.className = `${aimType}-nametitle`;
    div02.className = `${aimType}-namelist`;
    // const li = document.createElement('li');
    const subCharacters = grouped[k];
    subCharacters.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="/story/${storyId}/${aimType}?id=${c.id}">${c.name}</a>`;
      div02.appendChild(li);
    });
    div.appendChild(div01)
    div.appendChild(div02)
    ul.appendChild(div)
  });
}

async function makeAddData(fieldsForAdd, storyId, aimType) {
  const resData = {}
  const infoDict = await loadInfoDict(storyId, aimType);
  const nameElement = document.getElementById(`new-${aimType}-name`);
  const sep = /[,，、;；\s]+/
  if (nameElement && nameElement.value.trim() in infoDict){
    alert('项目已存在!');
    return;
  }

  fieldsForAdd.forEach(f=>{
    const elementValue = document.getElementById(`new-${aimType}-${f}`).value.trim();
    if (f in ["note","description","story","firstChapter","firstAge"]) {
      resData[f] = elementValue;
      return
    } else if (f in ["related"]) {
      resData[f] = elementValue.replaceAll('，',',').replaceAll('；',';').replaceAll('：',':');
    } else{
      resData[f] = elementValue.split(sep).map(s => s.trim()).join(',')
    }
  })
  
  fetch(`/story/${storyId}/${aimType}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resData)
  }).then(() => {
    location.reload(); // 简化操作，重新加载页面
  });
}

