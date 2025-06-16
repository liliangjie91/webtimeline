export function generateShortId() {
    return (
      Date.now().toString(36) + // 基于时间戳
      Math.random().toString(36).substr(2, 5) // 加上随机部分
    );
  }

export function safeText(value) {
  return value !== undefined && value !== null && value !== '' ? value : '';
}

export function dateFormat(dateObj){
  if (dateObj.getHours() === 0 && dateObj.getMinutes() == 0) {
    return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
}
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
}

export const optionsMain = {
  // locale: 'zh',  // 这行很重要，让vis-timeline识别中文
  // moment: function (date) {
  //   return moment(date); // 用中文moment处理日期
  // },
  stack: true,
  maxHeight: 1000,
  horizontalScroll: true,
  orientation: 'top',
  // verticalScroll: true,
  zoomKey: "ctrlKey",
  groupOrder:"value",
  // groupOrder: function (a, b) {
  //   return a.importance - b.importance;
  // },
  zoomMin: 1000 * 60 * 60 * 24 * 10, // 最小缩放粒度为 1 天（以毫秒计）
  zoomMax: 1000 * 60 * 60 * 24 * 365 * 8, // 可选：最大缩放粒度，例如 10 年
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
  editable: {
    add: false, // 禁用默认添加行为
    updateTime: true,  // drag items horizontally
    updateGroup: true, // drag items from one group to another
    remove: false,       // delete an item by tapping the delete button top right
    overrideItems: false  // allow these options to override item.editable
  }
};

export const optionsSimple = {
    tooltip: {
    // followMouse: true,
    overflowMethod: 'cap', // 控制边缘情况
  },
  editable: false,
  maxHeight: 500,
};

export const optionsSide = {
  editable: false
};

const groupsTempDefault = [
  {id: '主线', content: '主线', value: 1}
];
const groupsTempJPM = [
  {id: '主线', content: '主线', value: 1},
  {id: '潘金莲线', content: '潘金莲线', value: 2},
  {id: '李瓶儿线', content: '李瓶儿线', value: 3},
  {id: '庞春梅线', content: '庞春梅线', value: 4},
  {id: '孟玉楼线', content: '孟玉楼线', value: 5},
  {id: '吴月娘线', content: '吴月娘线', value: 6},
  {id: '陈敬济线', content: '陈敬济线', value: 7},
  {id: '狐朋狗友线', content: '狐朋狗友', value: 8},
  {id: '其他支线', content: '其他支线', value: 999}
];

export function setGroupValue(storyId,rawGroupMap){
  const res = []
  const groupsTemp = storyId==='1' ? groupsTempJPM : groupsTempDefault;
  rawGroupMap.forEach(g => {
    const match = groupsTemp.find(e => e.id === g.id);
    if (match){
      g.value = match.value;
      g.content = match.content;
    }else{
      g.value = 998;
    }
    res.push(g);
  });
  return res
}

const mainCharacterJPM = ['西门庆','潘金莲','孟玉楼','李瓶儿','庞春梅','吴月娘'];
function splitKeyCharacter(characters){
  const mainCharacter = mainCharacterJPM
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