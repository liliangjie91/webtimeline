# 时间线工具

## 数据
| 字段名         | 类型       | 说明 |
|----------------|------------|------|
| `id`           | `number`   | ·唯一标识事件的 ID，一般用时间戳生成 |
| `start`        | `string`   | ·时间-事件开始时间，格式为 `YYYY-MM-DD` |
| `end`       | `string/null` | 时间-事件结束时间，可选，支持时间段事件 |
| `special_day`  | `string`   | 时间-特殊节日或纪念日，如“元宵节”、“新年”等 |
| `season`       | `string`   | 时间-季节（春、夏、秋、冬） |
| `weather`      | `string`   | 时间-天气情况，如“晴”、“雨”、“大雪” |
| `location`     | `string`   | 地点-事件发生的地点 |
| `characters`   | `string[]` | 人物-参与该事件的所有人物数组 |
| `key_character`| `string`   | 人物-此事件中情节的核心人物 |
| `title`        | `string`   | ·故事-事件标题（用于 vis-timeline 中的 `content` 字段） |
| `story`        | `string`   | 故事-事件的详细叙述内容 |
| `category`     | `string`   | 故事-事件类型，如“战斗”、“内心戏”、“情节推进”等 |
| `chapter`      | `number`   | 故事-所在小说章节，例如 `5` |
| `tags`         | `string[]` | 故事-自定义标签列表，用于快速分类 |
| `note`         | `string`   | 故事-编剧/作者的备注说明 |
| `group`        | `string`   | ·故事线-所属时间线分组，如“主线”、“支线” |
| `created_at`   | `string`   | 创建时间（用于后端记录） |
| `updated_at`   | `string`   | 最后一次修改时间 |

```json
{
  "id": 123456789,
  "start": "2025-04-23",
  "end": null,
  "special_day": "元宵节",
  "season": "春",
  "weather": "晴",
  "location": "洛都城",
  "group": "主线剧情",
  "characters": ["李长歌", "魏无羡"],
  "key_character": "李长歌",
  "title": "主角初次登场，与配角相遇",
  "story": "主角在街头偶遇配角，展开一场误会与追逐。",
  "category": "情节推进",
  "chapter": 12,
  "tags": ["初遇", "误会", "追逐"],
  "note": "这段是两人第一次互动，要有张力。",
  "created_at": "2025-04-22T15:00:00",
  "updated_at": "2025-04-23T10:00:00"
}
```