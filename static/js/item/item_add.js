import { bindAddItemHandlers } from '../character/character_utils.js';
let itemDict = {};

const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const aimType = 'item';
const itemFieldsForAdd = [
  "name","aliases","firstChapter","category","tags","owner","price","note","description","mainEvents"
];
// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  loadInfoDict(storyId, 'item').then(data => {
    itemDict = data;
    // console.log('角色字典加载成功', itemDict);
    // 此处可以调用渲染函数或做其他操作
  });
});

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

// 角色添加功能
export function bindAddItemHandlers(itemFieldsForAdd, storyId, aimType) {
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