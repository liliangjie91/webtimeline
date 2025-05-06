import { initTimeline, setTimelineInstances } from './timeline_init.js';
import { updateFilterOptions, applyFilters } from './timeline_filters.js';
import { bindPopupHandlers } from '../event/event_popup.js';
import { bindAddHandlers } from '../event/event_add.js';

let allEvents = [];
let timeline;
let filteredTimeline;
// let data;
const match = window.location.pathname.match(/^\/story\/(\d+)/);
const storyId = match[1];
const apiUrl = `/api/story/${storyId}/event`;
fetch(apiUrl)
  .then(res => res.json())
  .then(events => {
    allEvents = events;
    // data = new vis.DataSet(events); // 初始化 DataSet
    const { globalTimeline, filtered } = initTimeline(events);
    timeline = globalTimeline;
    filteredTimeline = filtered;
    setTimelineInstances(timeline, filteredTimeline, allEvents); // 提供引用
    updateFilterOptions(events);
  });

bindPopupHandlers();
bindAddHandlers();