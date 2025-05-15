export function loadItemDict(storyId) {
    return fetch(`/api/story/${storyId}/item_dict`)
      .then(response => response.json())
      .catch(error => {
        console.error('物品字典加载失败:', error);
        return {};
      });
  }