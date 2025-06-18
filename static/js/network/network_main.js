import * as utils from './network_utils.js';

// 解析 URL 获取 storyId
const match = window.location.pathname.match(/^\/story\/([a-zA-Z_]+)?/);
const entityType = match[1] ?? 'character';
const params = new URLSearchParams(window.location.search);
const storyId = entityType === 'story' ? '0' : params.get('story_id');

// 获取数据并初始化图谱
const apiUrl = `/api/network?story_id=${storyId}`;
fetch(apiUrl)
  .then(res => res.json())
  .then(entities => {
    const networkData = entities || utils.defaultData;
    const cy = initNetwork(networkData); // 初始化 Cytoscape
    bindNetworkEvents(cy);               // 绑定交互事件
  });


// 封装初始化函数
function initNetwork(data) {
  return cytoscape({
    container: document.getElementById('cy'),
    elements: data,
    style: utils.defaultStylesheet,
    layout: utils.myLayoutFcose,
    ...utils.options
  });
}

// 封装事件绑定函数
function bindNetworkEvents(cy) {
  cy.on('dbltap', 'node', evt => {
    const node = evt.target;
    const charIdstr = node.data('id');
    if (charIdstr.startsWith('c')){
        const charId = parseInt(charIdstr.match(/\d+/)[0]);
        if (charId) {
        window.location.href = `/story/character?story_id=${storyId}&entity_id=${charId}`;
        }
    }
  });

  cy.on('dbltap', 'edge', evt => {
    const edge = evt.target;
    const relationId = edge.data('id');
    const realtionTitle = edge.data('title');
    if (relationId) {
      window.location.href = `/story/relation?story_id=${storyId}&rid=${relationId}&title=${realtionTitle}`;
    }
  });

  // 可选：鼠标提示样式
  cy.on('mouseover', 'node, edge', () => {
    cy.container().style.cursor = 'pointer';
  });
  cy.on('mouseout', 'node, edge', () => {
    cy.container().style.cursor = 'default';
  });
}