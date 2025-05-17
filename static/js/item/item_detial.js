import { uploadImage, imageClickToOpen } from '../character/character_utils.js';

let itemData = {};
let itemDict = {};
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const params = new URLSearchParams(window.location.search);
const itemId = params.get('id');

if (!storyId) {
  document.body.innerHTML = '<h2>缺少故事ID</h2>';
} else if (!itemId) {
  document.body.innerHTML = '<h2>缺少物品ID</h2>';
} else {
  fetch(`/api/story/${storyId}/item/${itemId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('物品不存在');
      }
      return res.json();
    })
    .then(data => {
      itemData = data;
      renderItem(data); // 你自定义的渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
    toggleEditable(true);
};
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
    toggleEditable(false);
};
// 保存编辑
document.getElementById('save-btn').onclick = () => {
    
    const id = itemData.id;
    const updateData = updateItem(id);

    if (Object.keys(updateData).length === 0) {
        alert('没有字段被修改');
        return;
      }
    // updateData['id'] = id;
    updateData['updateTime'] = Date.now();

    fetch(`/api/story/${storyId}/item/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      }).then(res => {
        if (res.ok) {
        //   showSuccessMessage('更新成功');
          location.reload();
        } else {
          alert('更新失败');
        }
      });
  };

// 删除人物
document.getElementById('delete-btn').onclick = () => {
    if (confirm("确定删除这个物品吗？")) {
        fetch(`/story/${storyId}/item/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemData.id })
        }).then(() => {
        // dataRef.remove(selectedItem.id);
        // document.getElementById('popup').classList.add('hidden');
        window.location.href = `/story/${storyId}/item_list`;
        // location.reload();
        });
    }
}

// 角色详情渲染函数
function renderItem(item) {
    function safeText(value) {
        return value !== undefined && value !== null && value !== '' ? value : '-';
    }
    document.getElementById('main-title').innerText = safeText(item.name)+'-详情';
    document.getElementById('detail-item-name').innerText = safeText(item.name);
    document.getElementById('detail-item-aliases').innerText = safeText(item.aliases);
    document.getElementById('detail-item-firstChapter').innerText = safeText(item.firstChapter);
    document.getElementById('detail-item-category').innerText = safeText(item.category);
    document.getElementById('detail-item-tags').innerText = safeText(item.tags);
    document.getElementById('detail-item-owner').innerText = safeText(item.owner);
    document.getElementById('detail-item-price').innerText = safeText(item.price);
    document.getElementById('detail-item-note').innerText = safeText(item.note);
    document.getElementById('detail-item-description').innerText = safeText(item.description);
    document.getElementById('detail-item-mainEvents').innerText = safeText(item.mainEvents);
    document.getElementById('detail-item-related').innerText = safeText(item.related);

    const img = document.getElementById('item-img');
    img.src = item.image || `/static/imgs/${storyId}/item_default.jpg`;
  
  }

const item_fields = [
    "name","aliases","firstChapter","category","tags","owner","price","note","description","mainEvents",'related'
];

const hidden_fields = [
   'detail-item-div-related'
];

function updateItem(id) {
    let updateData = {};
    item_fields.forEach(field => {
        const element = document.getElementById(`detail-item-${field}`);
        if (!element) return;
        let newValue = element.innerText.trim();
        if (newValue === undefined || newValue === null || newValue === '-') {
            return;
        }
        newValue = newValue.trim().replaceAll('；', ';').replaceAll('，', ',').replaceAll('：', ':');
        
        const oldValue = (itemData[field] || '').toString().trim();
        if (newValue !== oldValue) {
            updateData[field] = field === 'firstAge' || field === 'firstChapter'
                ? parseInt(newValue) || null
                : newValue;
        }
    });

    return updateData;
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

    const item_elments = item_fields.map(val => `detail-item-${val}`);
    // console.log('item_elments:', item_elments);
    item_elments.forEach(toggle);
    document.getElementById('edit-btn').classList.toggle('hidden', editing);
    document.getElementById('save-btn').classList.toggle('hidden', !editing);
    document.getElementById('cancel-btn').classList.toggle('hidden', !editing);
    document.getElementById('delete-btn').classList.toggle('hidden', !editing);
    hidden_fields.forEach(val => {
        const element = document.getElementById(val);
        if (editing) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

// 图片相关

const elementImg = document.getElementById("item-img");
const elementModal = document.getElementById("img-modal");
const elementImgInModel = document.getElementById("modal-img")
imageClickToOpen(elementImg, elementModal, elementImgInModel)
document.getElementById("image-upload").addEventListener("change", (event) => uploadImage(event,storyId, itemId, 'item', elementImg));
