from .db_models import db, mapEntityClassName

############## 增删改查通用方法 ##############
## 增
def add_entity(story_id, entity_type, new_entity):
    model_class = mapEntityClassName[entity_type]
    return model_class.add(int(story_id), new_entity)

## 删
def delete_entity(story_id, entity_type, entity_id, soft_delete=True):
    model_class = mapEntityClassName[entity_type]
    return model_class.delete(int(story_id), int(entity_id), soft_delete)

## 改
def update_entity(story_id, entity_type, entity_id, entity_new):
    model_class = mapEntityClassName[entity_type]
    return model_class.update(int(story_id), int(entity_id), entity_new)

## 查
def get_entity_all(story_id, entity_type, content_type='all'):
    model_class = mapEntityClassName[entity_type]
    return model_class.get_all(int(story_id)) if content_type == 'all' else model_class.get_title_id_dict(int(story_id))

def get_entity(story_id, entity_type, entity_id):
    model_class = mapEntityClassName[entity_type]
    return model_class.get_one(int(story_id), int(entity_id))

def get_event_for_character(story_id, character_name):
    """根据角色名获取事件"""
    return mapEntityClassName['event'].get_event_for_character(int(story_id), character_name)