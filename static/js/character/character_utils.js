export function loadCharacterDict() {
    return fetch('/api/character_dict')
      .then(response => response.json())
      .catch(error => {
        console.error('角色字典加载失败:', error);
        return {};
      });
  }