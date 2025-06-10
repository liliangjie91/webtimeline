// if (typeof cytoscape !== 'undefined' && typeof cytoscapeFcose !== 'undefined') {
//   cytoscape.use(cytoscapeFcose);
// };
//////////////////// 数据 ////////////////////
let elements3 = {
  nodes: [
    {data: {id: 'r1', parent: 'n8'}, classes: ['relative']},
    {data: {id: 'r2', parent: 'n8'}, classes: ['relative']},
    {data: {id: 'r3', parent: 'n8'}, classes: ['relative']},
    {data: {id: 'r4'}, classes: ['relative']},
    {data: {id: 'r5'}, classes: ['relative']},
    {data: {id: 'r6', parent: 'n7'}, classes: ['relative']},
    {data: {id: 'r7', parent: 'n10'}, classes: ['relative']},    
    {data: {id: 'r8', parent: 'n10'}, classes: ['relative']},    
    {data: {id: 'n1', parent: 'n7'}},
    {data: {id: 'n2'}},
    {data: {id: 'n3'}},
    {data: {id: 'n4'}},
    {data: {id: 'n5'}},
    {data: {id: 'n6'}},
    {data: {id: 'n7', parent: 'n10'}},
    {data: {id: 'n8'}},
    {data: {id: 'n9'}},
    {data: {id: 'n10'}}
  ],
  edges: [
    {data: {source: 'r6', target: 'n1'}},
    {data: {source: 'r6', target: 'n3'}},
    {data: {source: 'n1', target: 'r8'}},
    {data: {source: 'n1', target: 'r5'}},
    {data: {source: 'n1', target: 'r7'}},
    {data: {source: 'n2', target: 'n3'}},
    {data: {source: 'n2', target: 'r2'}},
    {data: {source: 'n2', target: 'n4'}},
    {data: {source: 'r5', target: 'n5'}},
    {data: {source: 'r5', target: 'n6'}},
    {data: {source: 'r2', target: 'r1'}},
    {data: {source: 'r2', target: 'r3'}},
    {data: {source: 'n7', target: 'n9'}},
    {data: {source: 'n5', target: 'n6'}},
    {data: {source: 'n5', target: 'r4'}}
  ]
};

//////////////////// 样式 ////////////////////
// define default stylesheet
let defaultStylesheet =  [
  {
    selector: 'node',
    style: {
      'background-color': '#bdd3d4',
      'label': 'data(id)',
      'text-valign': 'center',
      'background-opacity': 0.7
    }
  },         

  {
  selector: ':parent',
    style: {
//      'background-opacity': 0.333,
      'background-color': '#e8e8e8',
      'border-color': '#DADADA',
//      'border-width': 3,
      'text-valign': 'bottom'
    }
  },

  {
    selector: 'edge',
    style: {
      'curve-style': 'straight',
      'line-color': '#bdd3d4'
    }
  },

  {
    selector: 'node:selected',
    style: {
      'background-color': '#33ff00',
      'border-color': '#22ee00'
    }
  },
  
  {
    selector: 'node.fixed',
    style: {
      'shape': 'diamond',
      'background-color': '#9D9696',
    }
  }, 
  
  {
    selector: 'node.fixed:selected',
    style: {
      'background-color': '#33ff00',
    }
  },
  
  {
    selector: 'node.alignment',
    style: {
      'shape': 'round-heptagon',
      'background-color': '#fef2d1',
    }
  }, 
  
  {
    selector: 'node.alignment:selected',
    style: {
      'background-color': '#33ff00',
    }
  },  

  {
    selector: 'node.relative',
    style: {
      'shape': 'rectangle',
      'background-color': '#fed3d1',
    }
  }, 
  
  {
    selector: 'node.relative:selected',
    style: {
      'background-color': '#33ff00',
    }
  },

  {
    selector: 'edge:selected',
    style: {
      'line-color': '#33ff00'
    }
  }                 
];

const options = {
    minZoom: 0.5, // 图表缩放级别的最小界限.视口的缩放比例不能小于此缩放级别.
    maxZoom: 3, // 图表缩放级别的最大界限.视口的缩放比例不能大于此缩放级别.
    zoomingEnabled: true, // 是否通过用户事件和编程方式启用缩放图形.
    wheelSensitivity: 0.05, // 鼠标滚轮缩放的灵敏度.默认值为 1.0.
}

let myLayout2 = {
  name: 'fcose',
  quality: "default",
  randomize: true,
  animate: true,
  animationDuration: 300,
  animationEasing: undefined,
  fit: true,
  padding: 30,
  nestingFactor: 0.1,
  gravityRangeCompound: 1.5,
  gravityCompound: 1.0
};

// 初始化 Cytoscape 实例
const cy = cytoscape({
    container: document.getElementById('cy'),
    // elements: fetch('../data/json/network_demo.json').then(function(res) {
    //         return res.json();
    //     }),
    // elements: dataNetwork,
    ready: function() {
        // 计算并应用宽高比
        let layoutUtilities = this.layoutUtilities({
          desiredAspectRatio: this.width() / this.height()
        });
        // console.log("当前宽高比:", this.width() / this.height());
      },
    elements: elements3,
    style: defaultStylesheet,//[styleNodes, styleEdges],
    layout: myLayout2, // 布局方式
    ...options
});
