import { showPopup } from '../event/event_popup.js';
import { handleAddEventFromDoubleClick } from '../event/event_add.js';

let timeline, filteredTimeline, allEventsRef;

const optionsMain = {
  locale: 'zh',  // 这行很重要，让vis-timeline识别中文
  // moment: function (date) {
  //   return moment(date); // 用中文moment处理日期
  // },
  zoomMin: 1000 * 60 * 60 * 24 * 8, // 最小缩放粒度为 1 天（以毫秒计）
  zoomMax: 1000 * 60 * 60 * 24 * 365 * 10, // 可选：最大缩放粒度，例如 10 年
  // 可选项（改善显示效果）：
  // timeAxis: { scale: 'month', step: 1 }, // 默认时间轴显示
  format: {
    minorLabels: {
      day: 'DD日',
      week: 'DD日',
      weekday: 'DD日',
      month: 'MM月',
      year: 'YYYY年'
    },
    majorLabels: {
      month: 'YYYY年',
      week: 'YYYY年MM月',
      weekday: 'YYYY年MM月',
      day: 'YYYY年MM月',
    }
  },
  groupOrder: 'content',
  editable: {
    add: false, // 禁用默认添加行为
    updateTime: true,  // drag items horizontally
    updateGroup: true, // drag items from one group to another
    remove: false,       // delete an item by tapping the delete button top right
    overrideItems: false  // allow these options to override item.editable
  }
};
const optionsSide = {
  locale: 'zh',  // 这行很重要，让vis-timeline识别中文
  moment: function (date) {
    return moment(date); // 用中文moment处理日期
  }
};

export function setTimelineInstances(t, f, events) {
  timeline = t;
  filteredTimeline = f;
  allEventsRef = events;
}

const mainCharacter = ['西门庆','潘金莲','孟玉楼','李瓶儿','庞春梅','吴月娘'];
function splitKeyCharacter(characters){
  const groupSet = new Set();
  const roles = characters.split(',').map(r => r.trim());
  roles.forEach(role => {
    if (mainCharacter.includes(role)){
      groupSet.add(role);
    }else{
      groupSet.add('其他');
    }
  });
  return Array.from(groupSet)
}

export function initTimeline(events, isFiltered = false, groupType = 'default') {
  const container = document.getElementById(isFiltered ? 'visualization-selected' : 'visualization');

  if (isFiltered && filteredTimeline) {
    filteredTimeline.destroy();
    filteredTimeline = null;
    if (events.length === 0) return { globalTimeline: timeline, filtered: null };
  }

  // const groupsByKeyCharacter = [...mainCharacter, '其他'].map(g => ({ id: g, content: g }));
  const groupsDefault = [...new Set(events.map(e => e.storyLine))].map(g => ({ id: g, content: g }));
  
  const eventsWithContent = events.map(item => ({
    ...item,
    end: (item.end && item.end.trim()) ? item.end : null,
    content: item.title,
    group: item.storyLine
}));
 
  // const items = [];
  // eventsWithContent.forEach(item => {
  //   const roles = splitKeyCharacter(item.keyCharacter);
  //   roles.forEach(role => {
  //     const newItem = {...item};
  //     newItem.id = `${item.id}-${role}`;
  //     newItem.group = role;
  //     items.push(newItem);
  //   });
  // });
  const timelineData = new vis.DataSet(eventsWithContent);
  const timelineInstance = new vis.Timeline(container, timelineData, isFiltered ? optionsSide : optionsMain);
  timelineInstance.setGroups(groupsDefault);
  // timelineInstance.setItems(new vis.DataSet(items));

  if (events.length > 0) {
    const start = new Date(events[0].start);
    const end = new Date(events[events.length - 1].start);
    const buffer = 7 * 24 * 60 * 60 * 1000;
    timelineInstance.setWindow(new Date(start.getTime() - buffer), new Date(end.getTime() + buffer));
  }

  timelineInstance.on('doubleClick', props => {
    if (props.item) {
        const item = timelineData.get(props.item);
        if (props.event.target.closest('#visualization')) {
            showPopup(item, timelineData);
        }
    } else {
        handleAddEventFromDoubleClick(props);
    }
    
    
  });

  timelineInstance.on('rangechange', props => {
    const { start, end } = props;
    if (!isFiltered && filteredTimeline) filteredTimeline.setWindow(start, end, { animation: false });
    if (isFiltered && timeline) timeline.setWindow(start, end, { animation: false });
  });

  if (isFiltered) {
    filteredTimeline = timelineInstance;
  } else {
    timeline = timelineInstance;
  }

  return { globalTimeline: timeline, filtered: filteredTimeline };
}