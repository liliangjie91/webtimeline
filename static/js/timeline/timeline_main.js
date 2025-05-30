import { initTimeline, setTimelineInstances } from './timeline_init.js';
import { updateFilterOptions, applyFilters } from './timeline_filters.js';
import { bindPopupHandlers } from '../event/event_popup.js';
import {bindAddEntityHandlers} from '../entity/entity_utils.js'
let allEvents = [];
let timeline;
let filteredTimeline;
// let data;
const params = new URLSearchParams(window.location.search);
const storyId = params.get('story_id');
const entityType = 'event';
const eventFieldsForAdd = ['title', 'start','end', 'location', 'keyCharacter', 'characters', 'story','category','tags','chapter','season','specialDay','weather','storyLine','note']
const apiUrl = `/api/story/${entityType}?story_id=${storyId}`;
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
// bindAddHandlers();
bindAddEntityHandlers(eventFieldsForAdd, storyId, entityType);