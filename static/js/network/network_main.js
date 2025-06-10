import * as utils from './network_utils.js';

const match = window.location.pathname.match(/^\/story\/([a-zA-Z_]+)?/);
const entityType = match[1] ?? 'character';
const params = new URLSearchParams(window.location.search);
const storyId = entityType=== 'story' ? '0' : params.get('story_id');

const apiUrl = `/api/network?story_id=${storyId}`;
fetch(apiUrl)
  .then(res => res.json())
  .then(entitys =>{
    let networkData = utils.defaultData;
    if (entitys) {
        networkData = entitys;
    }
    // 初始化 Cytoscape 实例
    const cy = cytoscape({
        container: document.getElementById('cy'),
        // ready: function() {
        //     // 计算并应用宽高比
        //     let layoutUtilities = this.layoutUtilities({
        //     desiredAspectRatio: this.width() / this.height()
        //     });
        // },
        elements: networkData,
        style: utils.defaultStylesheet,//[styleNodes, styleEdges],
        layout: utils.myLayoutFcose, // 布局方式
        ...utils.options
    });
})
