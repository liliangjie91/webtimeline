import { showPopup } from './popup.js';
import { handleAddEventFromDoubleClick } from './add.js';

let timeline, filteredTimeline, allEventsRef;

export function setTimelineInstances(t, f, events) {
  timeline = t;
  filteredTimeline = f;
  allEventsRef = events;
}

export function initTimeline(events, isFiltered = false) {
  const container = document.getElementById(isFiltered ? 'visualization-selected' : 'visualization');

  if (isFiltered && filteredTimeline) {
    filteredTimeline.destroy();
    filteredTimeline = null;
    if (events.length === 0) return { globalTimeline: timeline, filtered: null };
  }

  const groups = [...new Set(events.map(e => e.group))].map(g => ({ id: g, content: g }));
  const eventsWithContent = events.map(item => ({
  ...item,
  end: (item.end && item.end.trim()) ? item.end : null,
  content: item.title
}));
  const timelineData = new vis.DataSet(eventsWithContent);
  // ✅ 改这里：共用同一个 DataSet（data）
//   let timelineData;
//   if (!data) {
//     data = new vis.DataSet(events); // 初次创建
//   }

//   if (isFiltered) {
//     timelineData = data;
//   } else {
//     timelineData = data;
//     data.clear();     // 清空旧数据
//     data.add(events); // 添加新数据
//   }

    const options = {
      locale: 'zh',  // 这行很重要，让vis-timeline识别中文
      moment: function (date) {
        return moment(date); // 用中文moment处理日期
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
  const timelineInstance = new vis.Timeline(container, timelineData, isFiltered ? {} : options);

  timelineInstance.setGroups(groups);

  if (events.length > 0) {
    const start = new Date(events[0].start);
    const end = new Date(events[events.length - 1].start);
    const buffer = 7 * 24 * 60 * 60 * 1000;
    timelineInstance.setWindow(new Date(start.getTime() - buffer), new Date(end.getTime() + buffer));
  }

//   timelineInstance.on('doubleClick', function (props) {
//     if (props.item) {
//       const item = data.get(props.item);
//       alert('你双击了事件：' + item.content);
//     } else {
//       alert('你双击了空白区域');
//     }
//   });

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