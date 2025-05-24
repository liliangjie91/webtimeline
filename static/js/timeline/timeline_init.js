import { showPopup } from '../event/event_popup.js';
import { handleAddEventFromDoubleClick } from '../entity/entity_utils.js';
import {optionsSide, optionsMain, setGroupValue} from "../utils.js";
let timeline, filteredTimeline, allEventsRef;
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];

export function setTimelineInstances(t, f, events) {
  timeline = t;
  filteredTimeline = f;
  allEventsRef = events;
}

export function initTimeline(events, isFiltered = false, groupType = 'storyLine') {
  const container = document.getElementById(isFiltered ? 'visualization-selected' : 'visualization');

  if (isFiltered && filteredTimeline) {
    filteredTimeline.destroy();
    filteredTimeline = null;
    if (events.length === 0) return { globalTimeline: timeline, filtered: null };
  }

  // const groupsByKeyCharacter = [...mainCharacter, '其他'].map(g => ({ id: g, content: g }));
  const groupsSide = [...new Set(events.map(e => e.storyLine))].map(g => ({ id: g, content: g }));
  const groupsValue = setGroupValue(storyId, groupsSide);

  const eventsWithContent = events.map(item => ({
    ...item,
    end: (item.end && item.end.trim()) ? item.end : null,
    content: item.title,
    group: item.storyLine ? item.storyLine : null
  }));
 
  const timelineData = new vis.DataSet(eventsWithContent);
  const timelineInstance = new vis.Timeline(container, timelineData, optionsMain);
  timelineInstance.setGroups(new vis.DataSet(groupsValue));
  if (isFiltered){
    timelineInstance.setOptions(optionsSide);
    timelineInstance.setGroups(groupsSide);
  }

  if (events.length > 0) {
    const start = new Date(events[events.length-1].start);
    const bufferDay =  24 * 60 * 60 * 1000;
    timelineInstance.setWindow(new Date(start.getTime()-150*bufferDay), new Date(start.getTime() + 150 * bufferDay));
  }

  timelineInstance.on('doubleClick', props => {
    if (props.item) {
        const item = timelineData.get(props.item);
        if (props.event.target.closest('#visualization')) {
            showPopup(item, timelineData);
        }
    } else {
        handleAddEventFromDoubleClick(props,groupType);
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