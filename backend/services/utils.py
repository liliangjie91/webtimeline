import os,json

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
DATA_DIR = os.path.join(BASE_DIR, 'data')

story_path = os.path.join(DATA_DIR, 'storys.json')
story_map = {
    '1': '金瓶梅',
    '2': '红楼梦'
}
def load_story_map():
    if os.path.exists(story_path):
        with open(story_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return story_map

def load_entity_file(filepath):
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return []

def save_entity_file(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
############## 增删改查通用方法 ##############
## 增
def add_entity(filepath, new_entity):
    data = load_entity_file(filepath)
    ids = [e['id'] for e in data]
    id_tobe = len(ids)+10001
    new_entity['id'] = id_tobe if id_tobe not in ids else max(ids)+1
    data.append(new_entity)
    save_entity_file(data, filepath)

## 删
def delete_entity(filepath, req_data):
    entity_id = req_data.get("id")
    data = load_entity_file(filepath)
    data = [e for e in data if e["id"] != entity_id]
    save_entity_file(data, filepath)

## 改
def update_entity(filepath, entity_id, entity_new):
    data = load_entity_file(filepath)
    for idx, item in enumerate(data):
        if item['id'] == entity_id:
            for key, value in entity_new.items():
                # setattr(data[idx], key, value)
                data[idx][key] = value
            break
    save_entity_file(data, filepath)