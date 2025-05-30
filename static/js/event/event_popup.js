import * as utils from '../entity/entity_utils.js';
import { dateFormat} from '../utils.js';
import {mapEntityFields} from '../entity/entity_config.js';

let eventData = {};
let dataRef;
let characterDict = {};
const params = new URLSearchParams(window.location.search);
const storyId = params.get('story_id');
const entityType = 'event';
// 事件结构体内含元素
const eventFields = mapEntityFields[entityType];
//['title', 'start','end', 'location', 'keyCharacter', 'characters', 'story','category','tags','chapter','season','specialDay','weather','storyLine','note','textUrl']
const hiddenFields = ["popup-event-textUrl-div"]

// 页面加载完成就拉取字典
document.addEventListener('DOMContentLoaded', () => {
  utils.loadInfoDict(storyId).then(data => {
    characterDict = data;
  });
});

export function bindPopupHandlers() {
  document.getElementById('popup-event-close').onclick = () => {
    document.getElementById('popup-event').classList.add('hidden');
  };
  // 开始编辑
  document.getElementById('edit-btn').onclick = () => {
    utils.toggleEditable(true, eventFields, hiddenFields, entityType, 'popup');
  };
  // 取消编辑
  document.getElementById('cancel-btn').onclick = () => {
    utils.toggleEditable(false, eventFields, hiddenFields, entityType, 'popup');
    document.getElementById('popup-event').classList.add('hidden');
  };
  // 保存编辑
  document.getElementById('save-btn').onclick = () => {
    let eventId = eventData.id
    if (typeof(eventData.id)==='string'){
      eventId = Number(eventData.id.split('-')[0])
    }
    // const updateData = updateEvent();
    const updateData = utils.updateEntity(eventData, eventFields, entityType, 'popup');

    if (Object.keys(updateData).length === 0) {
        alert('没有字段被修改');
        return;
      }
    // updateData['id'] = eventId;
    updateData['updateTime'] = Date.now();

    fetch(`/api/story/event`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({entity_new:updateData, story_id: storyId, entity_id: eventId})
    }).then(() => {
      if (typeof(eventData.id)==='string'){
        location.reload();
      }else{
        if ('title' in updateData){
        updateData['content'] = updateData.title;
        }
        updateData['id'] = eventId;
        dataRef.update(updateData);
        utils.toggleEditable(false, eventFields, hiddenFields, entityType, 'popup');
        document.getElementById('popup-event').classList.add('hidden');
      //   location.reload();
        // 设置时间线显示的窗口范围
      //   timeline.setWindow(dataRef.start, dataRef.end || dataRef.start);
      }
      
    });
  };

  // 删除事件
  document.getElementById('delete-btn').onclick = () => {
    if (confirm("确定删除这个事件吗？")) {
      fetch(`/api/story/event/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: eventData.id, story_id: storyId})
      }).then(() => {
        dataRef.remove(eventData.id);
        document.getElementById('popup-event').classList.add('hidden');
        // location.reload();
      });
    }
  };
}

//显示弹出窗口
export function showPopup(item, dataSet) {
  eventData = item;
  dataRef = dataSet;
  document.getElementById('popup-event-start').innerText = dateFormat(new Date(item.start));
  document.getElementById('popup-event-end').innerText = item.end ? dateFormat(new Date(item.end)) : '(无需)';

  document.getElementById('popup-event-title').innerText = item.title || '';
  document.getElementById('popup-event-location').innerText = item.location || '';
  // 主角链接处理
  utils.makeLinkInSpan(document.getElementById('popup-event-keyCharacter'), item.keyCharacter || '', characterDict);
  document.getElementById('popup-event-characters').innerText = item.characters || '';
  document.getElementById('popup-event-story').innerText = item.story || '';
  document.getElementById('popup-event-category').innerText = item.category || '';
  document.getElementById('popup-event-tags').innerText = item.tags || '';
  document.getElementById('popup-event-chapter').innerText = item.chapter || '';
  document.getElementById('popup-event-season').innerText = item.season || '';
  document.getElementById('popup-event-specialDay').innerText = item.specialDay || '';
  document.getElementById('popup-event-weather').innerText = item.weather || '';
  document.getElementById('popup-event-storyLine').innerText = item.storyLine || '';
  document.getElementById('popup-event-note').innerText = item.note || '';
  document.getElementById('popup-event-textUrl').innerText = item.textUrl || '';
  // 如有原文链接，显示按钮
  if (item.textUrl) {
    const linkBtn = document.getElementById('view-original-btn');
    linkBtn.href = item.textUrl;
    linkBtn.classList.remove('hidden');
  } else {
    document.getElementById('view-original-btn').classList.add('hidden');
  }

  document.getElementById('popup-event').classList.remove('hidden');
}