import os,json
from .db_models import Story

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
DATA_DIR = os.path.join(BASE_DIR, 'data')
FORMSCHEMA_FILE = os.path.join(BASE_DIR, 'backend/form_schemas/entity_schema.json')
USE_DB = True  # 是否使用数据库
DB_FILE= os.path.join(DATA_DIR, 'data.db')

story_path = os.path.join(DATA_DIR, 'json/story_map.json')
story_map_default = {
    '1': '金瓶梅',
    '2': '红楼梦'
}

# mapEntityName = {
#     'character':'人物',
#     'item':'物品',
#     'event':'事件',
#     'poem':'诗词',
#     'story':'故事',
# }
def load_json_file(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return []
def getMapEntityName():
    schemaData = load_json_file(FORMSCHEMA_FILE)
    res = {}
    for sj in schemaData:
        res[sj]=schemaData[sj]['name']
    return res
mapEntityName = getMapEntityName()

def load_story_map():
    res_map = {}
    if USE_DB:
        res_map = Story.get_id_title_dict()
    else:
        if os.path.exists(story_path):
            with open(story_path, 'r', encoding='utf-8') as f:
                res_map = json.load(f)
    if not res_map:
        res_map = story_map_default
    return res_map



def save_entity_file(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
############## 增删改查通用方法 ##############
## 增
def add_entity(filepath, new_entity):
    data = load_json_file(filepath)
    ids = [e['id'] for e in data]
    id_tobe = len(ids)+10001
    new_entity['id'] = id_tobe if id_tobe not in ids else max(ids)+1
    data.append(new_entity)
    save_entity_file(data, filepath)
    return {"status": "added", "id": new_entity['id']}

## 删
def delete_entity(filepath, entity_id):
    data = load_json_file(filepath)
    data = [e for e in data if e["id"] != entity_id]
    save_entity_file(data, filepath)
    return {"status": "deleted"}

## 改
def update_entity(filepath, entity_id, entity_new):
    data = load_json_file(filepath)
    for idx, item in enumerate(data):
        if item['id'] == entity_id:
            for key, value in entity_new.items():
                # setattr(data[idx], key, value)
                data[idx][key] = value
            break
    save_entity_file(data, filepath)
    return {"status": "updated"}

############################### network图相关 ###############################

# 根据角色数据生成edges数据：角色数据有realted字段，表示与其他角色的关系
def generate_edges_from_characters(characters):
    # print(characters)
    nodes, edges = [], []
    set_edge_ids = set()
    map_name_id = {char['name']: 'c{}'.format(char['id']) for char in characters}
    map_parent_id,map_grandparent_id = {},{}
    for char in characters:
        char_id = 'c{}'.format(char['id'])
        char_name = char['name']
        char_parent = char['categorySecond']
        char_grandparent = char['categoryFirst']
        related = char.get('related', "").strip().replace('\n', '')
        # 设置祖父节点map-categoryFirst
        if char_grandparent and (char_grandparent not in map_grandparent_id):
            next_gradparent_id = 'gp{:03d}'.format(len(map_grandparent_id))
            map_grandparent_id[char_grandparent] = next_gradparent_id
            nodes.append({'data':{'id':next_gradparent_id, 'label':char_grandparent}})
        # 设置父节点map-categorySecond
        if char_parent and (char_parent not in map_parent_id):
            next_parent_id = 'p{:03d}'.format(len(map_parent_id))
            map_parent_id[char_parent] = next_parent_id
            if char_grandparent:
                nodes.append({'data':{'id':next_parent_id, 'label':char_parent, 'parent':map_grandparent_id[char_grandparent]}})
            else:
                nodes.append({'data':{'id':next_parent_id, 'label':char_parent}})
        # 设置node节点
        if char_parent:
            nodes.append({'data':{'id':char_id, 'label':char_name, 'parent':map_parent_id[char_parent]}})
        else:
            nodes.append({'data':{'id':char_id, 'label':char_name}})
        # 设置edge
        if not related:
            continue
        relations = related.split(';')
        for rel in relations:
            if rel.strip() and len(rel.split(':')) == 2:
                rel_type, target_name_str = rel.split(':')
                target_names = target_name_str.strip().split(',')
                rel_type = rel_type.strip()
                for target_name in target_names:
                    target_name = target_name.strip()
                    # 如果目标名称在角色列表中，则添加边
                    if target_name not in map_name_id:
                        continue
                    target_id = map_name_id[target_name]
                    edge_id = char_id+'-'+target_id
                    edge_id_mirro = target_id+'-'+char_id
                    if edge_id_mirro in set_edge_ids:
                        continue
                    edges.append({'data':{'id':edge_id,'source': char_id,'target': target_id,'label': rel_type, 'title': f'{char_name}-{target_name}'}})
                    set_edge_ids.add(edge_id)
                        
    return {'nodes': nodes, 'edges': edges}