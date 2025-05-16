export async function loadItemDict(storyId) {
    try {
    const response = await fetch(`/api/story/${storyId}/item_dict`);
    return await response.json();
  } catch (error) {
    console.error('物品字典加载失败:', error);
    return {};
  }
  }