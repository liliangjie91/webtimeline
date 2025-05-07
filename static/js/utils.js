export function generateShortId() {
    return (
      Date.now().toString(36) + // 基于时间戳
      Math.random().toString(36).substr(2, 5) // 加上随机部分
    );
  }