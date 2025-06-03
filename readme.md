# WebTimeline 时间线工具

**WebTimeline** 是一个用于展示小说，电影等故事情节的时间线可视化工具，适用于编剧、作家、内容策划、读者观众等角色，帮助他们梳理复杂的故事结构和人物关系。

##  项目特点

- **结构化数据支持**：通过 JSON 格式记录事件，包含时间、地点、人物、情节等多维度信息。TODO:使用数据库
- **多维度展示**：支持按时间、人物、章节、标签等多种方式筛选和展示事件。
- **可视化界面**：基于 [vis-timeline](https://visjs.github.io/vis-timeline/) 实现交互式时间线展示。
- **灵活扩展性**：适用于小说阅读与创作、剧本编排、历史事件整理等多种场景。

##  项目结构

```bash
webtimeline/
├── backend/                      # 后端代码目录
│   ├── app.py                    # Flask 应用主入口
│   ├── schemas/                  # 配置文件
│   ├── routes/                   # 路由模块
│   └── services/                 # 业务逻辑模块
├── templates/                    # HTML 模板文件
├── static/                       # 静态资源文件（CSS、JS、图片等）
├── data/                         # 存储 JSON 数据
│   ├── data.db                   # 数据库文件 - 内含各种entity表 USE_DB = True 时使用
│   ├── storys.json               # 故事文件 - {"1": "水浒传", "2": "红楼梦"}
│   └── json/                     # 故事json文件夹
│       ├── characters_x.json     # 事件文件 - [{json},{json},{json}] 格式，x对应storys.json中的id
│       ├── events_x.json         # 角色文件 - [{json},{json},{json}] 格式，x对应storys.json中的id
│       ├── items_x.json          # 物品文件 - [{json},{json},{json}] 格式，x对应storys.json中的id
│       └── poems_x.json          # 诗词文件 - [{json},{json},{json}] 格式，x对应storys.json中的id
└── readme.md                     # 项目说明文件
```
## 数据
### 事件数据元素-events_x.json
| 字段名         | 类型       | 说明 |
|----------------|------------|------|
| `id`           | `number`   | 唯一标识事件的 ID，递增 |
| `shortId`      | `string`   | 类似uuid，根据时间戳生成，唯一 |
| `start`        | `string`   | 时间-事件开始时间，格式为 `YYYY-MM-DD` |
| `end`          |`string/null`| 时间-事件结束时间，可选，支持时间段事件 |
| `specialDay`   | `string`   | 时间-特殊节日或纪念日，如“元宵节”、“新年”等 |
| `season`       | `string`   | 时间-季节（春、夏、秋、冬） |
| `weather`      | `string`   | 时间-天气情况，如“晴”、“雨”、“大雪” |
| `location`     | `string`   | 地点-事件发生的地点 |
| `characters`   | `string`   | 人物-参与该事件的所有人物数组，逗号分隔|
| `keyCharacter` | `string`   | 人物-此事件中情节的核心人物，逗号分隔|
| `title`        | `string`   | 故事-事件标题（用于 vis-timeline 中的 `content` 字段） |
| `story`        | `string`   | 故事-事件的详细叙述内容 |
| `category`     | `string`   | 故事-事件类型，如“战斗”、“内心戏”、“情节推进”等，逗号分隔 |
| `tags`         | `string`   | 故事-自定义标签列表，用于快速分类,逗号分隔 |
| `chapter`      | `number`   | 故事-所在小说章节，例如 `5` |
| `note`         | `string`   | 故事-编剧/作者的备注说明 |
| `storyLine`    | `string`   | 故事线-所属时间线分组，如“主线”、“支线” |
| `createTime`   | `string`   | 创建时间（用于后端记录） |
| `updateTime`   | `string`   | 最后一次修改时间 |

```json
  {
    "createTime": 1747065565343,
    "updateTime": 1747065565343,
    "shortId": "mal9q9pb9lq9n",
    "title": "西门大姐结婚",
    "start": "1113-06-12",
    "end": null,
    "location": "西门府",
    "keyCharacter": "西门庆,孟玉楼",
    "characters": "西门庆,孟玉楼",
    "story": "遇陈宅使文嫂儿来通信，六月十二日就要娶大姐过门。...",
    "category": "",
    "tags": "",
    "season": "夏",
    "specialDay": "",
    "weather": "",
    "group": "主线",
    "chapter": 8,
    "note": "",
    "id": 10029
  }
```
### 角色数据元素-characters_x.json
| 字段名         | 类型          | 说明          |
|----------------|---------------|-------------------------|
| `id`           | `number`      | 人物的唯一标识符  |
| `name`         | `string`      | 人物姓名                 |
| `aliases`      | `string`      | 别名，多个以逗号分隔           |
| `zi`           | `string`      | 字号             |
| `gender`       | `string`      | 性别（“男”、“女”）       |
| `birth`        | `string`      | 出生年月（xxxx-xx-xx）     |
| `firstAge`     | `number/null` | 首次出场年龄，若未知则为 `null`         |
| `firstChapter` | `number`      | 人物首次出场章节编号       |
| `addr`         | `string`      | 居住地址（支持多次变迁说明）    |
| `job`          | `string`      | 职业               |
| `role`         | `string`      | 角色关系或社会身份描述，如“谁的前夫、兄弟等”    |
| `chara`        | `string`      | 主要事件中人物的角色标签    |
| `nature`       | `string`      | 性格特征   |
| `hobby`        | `string`      | 爱好     |
| `body`         | `string`      | 外貌体态描述   |
| `description`  | `string`      | 人物简介-详细背景与经历叙述    |
| `mainEvents`   | `string`      | 主要经历（关键事件），用分号分隔           |
| `related`      | `string`      | 与其他人物的关系，格式如“妻:xx;兄弟:xx,xx,xx”   |
| `note`         | `string`      | 备注，可用于补充角色设定、变化等说明    |
| `createTime`   | `number`      | 创建时间，时间戳                      |
| `updateTime`   | `number`      | 最后修改时间，时间戳          |

```json
{
    "createTime": 1746813029757,
    "updateTime": 1746813029757,
    "name": "郓哥",
    "aliases": "",
    "zi": "",
    "birth": "",
    "firstAge": 15,
    "firstChapter": null,
    "hobby": "",
    "nature": "机灵",
    "addr": "",
    "role": "",
    "chara": "其他",
    "job": "卖水果",
    "body": "",
    "note": "姓乔，因为做军在郓州生养的，取名叫做郓哥。家中只有个老爹，年纪高大",
    "description": "因为对王婆不满，所以挑唆武大去捉奸。后在武松逼迫下说出真相",
    "mainEvents": "",
    "related": "朋友:武大",
    "id": 26
  }
```
## 数据库
使用SQLite

### 是否使用数据库
编辑`backend/services/utils.py`中  
`USE_DB = True  # 是否使用数据库`  
如不使用数据库，则使用data/json中的json文件

### 数据导入导出
```bash
# json文件数据导入数据库
# 进入serveces文件夹
cd backend/services

python db_import_export.py --mode import --entity event --story 1 --file ../../data/events_1.json
python db_import_export.py --mode import --entity character --story 1 --file ../../data/characters_1.json

# 数据库导出到json文件 或 csv文件
python db_import_export.py --mode export --entity character --story 1 --file ../../data/characters_test_1.json
python db_import_export.py --mode export --entity character --story 1 --file ../../data/characters_test_1.csv
```

## 克隆项目
```bash
git clone https://github.com/liliangjie91/webtimeline.git
cd webtimeline
```

## 运行项目
```bash
pyhton run.py #在浏览器中打开 http://localhost:5001 查看时间线展示
```

##  贡献指南

欢迎提交 Issue 或 Pull Request，提出建议或贡献代码。
