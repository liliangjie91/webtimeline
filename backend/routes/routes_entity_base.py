from flask import Blueprint, render_template, jsonify, request, abort
from werkzeug.utils import secure_filename
from backend.services.utils import load_story_map
import backend.services.utils as utils
import backend.services.db_utils as db_utils
import os,json

entity_bp = Blueprint('entity', __name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
FILE_FOLDER = os.path.join(BASE_DIR, 'data/json')
IMAGE_FOLDER = os.path.join(BASE_DIR, 'static/imgs/')
FORMSCHEMA_FOLDER = os.path.join(BASE_DIR, 'backend/form_schemas/')
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
USE_DB = utils.USE_DB  # 是否使用数据库
# story_map = load_story_map()  # 从数据库或文件加载故事映射
mapEntityName = utils.mapEntityName

def allowed_image_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

def get_file_path(story_id, entity_type='item'):
    return os.path.join(FILE_FOLDER, f'{entity_type}s_{story_id}.json')

# 实体列表-首页
@entity_bp.route('/story/<entity_type>/list')
def entity_list(entity_type):
    story_id = request.args.get('story_id','0')  # 默认故事ID为0
    story_map = load_story_map()  # 从数据库或文件加载故事映射
    if (story_id not in story_map and story_id != '0') or entity_type not in mapEntityName:
        return "Invalid story ID or Entity type", 404
    form_schema = utils.load_json_file(os.path.join(FORMSCHEMA_FOLDER, f'entity_schema.json'))[f'{entity_type}']["schema"]
    return render_template( 'base_entity_list.html', 
                            storyName='全部' if story_id=='0' else story_map[story_id],
                            entityName=mapEntityName[entity_type],
                            entityType=entity_type,
                            formSchema=form_schema)

# 实体详情页
@entity_bp.route('/story/<entity_type>')
def entity_detail(entity_type):
    story_id = request.args.get('story_id','0')
    entity_id = request.args.get('entity_id')
    story_map = load_story_map()  # 从数据库或文件加载故事映射
    if (story_id not in story_map and story_id != '0') or entity_type not in mapEntityName:
        return "Invalid story ID or Entity type", 404
    form_schema = utils.load_json_file(os.path.join(FORMSCHEMA_FOLDER, f'entity_schema.json'))[f'{entity_type}']["schema"]
    form_schema = [field for field in form_schema if field.get('showOrder', 0) >= 0]
    # form_schema.sort(key=lambda x: x['showOrder'])
    return render_template( 'base_entity_detail.html', 
                            storyId = story_id,
                            storyName='全部' if story_id=='0' else story_map[story_id],
                            entityName=mapEntityName[entity_type],
                            entityType=entity_type,
                            entityId=entity_id,
                            formSchema=form_schema)

######## api接口 ########
# 添加实体
@entity_bp.route('/api/story/<entity_type>/add', methods=['POST'])
def add_entity(entity_type):
    req_data = request.json
    entity_new = req_data.get('entity_new', {})
    story_id = req_data.get('story_id')
    result = db_utils.add_entity(story_id, entity_type, entity_new) if USE_DB else utils.add_entity(get_file_path(story_id, entity_type), entity_new)
    return make_response(result)

# 删除实体
@entity_bp.route('/api/story/<entity_type>/delete', methods=['POST'])
def delete_entity(entity_type):
    req_data = request.json
    entity_id = req_data.get("entity_id")
    story_id = req_data.get('story_id', '1')
    result = db_utils.delete_entity(story_id, entity_type, entity_id) if USE_DB else utils.delete_entity(get_file_path(story_id, entity_type), entity_id)
    return make_response(result)

# 更新实体
@entity_bp.route('/api/story/<entity_type>', methods=['PATCH'])
def update_entity(entity_type):
    req_data = request.json
    entity_new = req_data.get('entity_new', {})
    story_id = req_data.get('story_id')
    entity_id = req_data.get('entity_id')
    result = db_utils.update_entity(story_id, entity_type, entity_id, entity_new) if USE_DB else utils.update_entity(get_file_path(story_id, entity_type), entity_id, entity_new)
    return make_response(result)

# 获取实体
@entity_bp.route('/api/story/<entity_type>')
def get_entity(entity_type):
    story_id = request.args.get('story_id', '1')
    entity_id = request.args.get('entity_id')
    rid = request.args.get('rid') # relation rid
    content_type = request.args.get('type', 'all')
    ext_chara_name = request.args.get('character_name')
    if entity_type == 'relation' and rid:
        entity = db_utils.get_relation(story_id, entity_id, rid)
    elif ext_chara_name and entity_type == 'event':
        # 根据角色名获取涉及该角色的事件，用于角色详情页
        chara_names = ext_chara_name.split('-')
        entity = get_event_for_character(story_id, chara_names)
    elif not entity_id:
        # 如果没有指定entity_id，则获取所有实体 所有字段 或 name-id字段(content_type == 'dict')
        entity = get_entity_dict(story_id, entity_type) if content_type == 'dict' else get_entity_all(story_id, entity_type)
    else:
        # 如果指定了entity_id，则获取单个实体所有字段
        entity = get_entity_one(story_id, entity_type, entity_id)
    return make_response(entity)

def get_entity_one(story_id, entity_type, entity_id):
    if USE_DB:
        return db_utils.get_entity(story_id, entity_type, entity_id)
    else:
        entitys = utils.load_json_file(get_file_path(story_id, entity_type))
        return next((i for i in entitys if i['id'] == entity_id), None)
    
def get_entity_all(story_id, entity_type):
    return db_utils.get_entity_all(story_id, entity_type) if USE_DB else utils.load_json_file(get_file_path(story_id, entity_type))

def get_entity_dict(story_id, entity_type):
    if USE_DB:
        return db_utils.get_entity_all(story_id, entity_type, content_type='dict')
    else:
        entitys = utils.load_json_file(get_file_path(story_id, entity_type))
        name_key = 'title' if entity_type in ['event', 'text'] else 'name'
        return {entity[name_key]: entity['id'] for entity in entitys}

def get_event_for_character(story_id, character_name):
    return db_utils.get_event_for_character(story_id, character_name)

# 获取实体-关系网络数据
@entity_bp.route('/api/network')
def get_node():
    story_id = request.args.get('story_id', '1')
    characters = db_utils.get_node4network(story_id) #if USE_DB else utils.get_node4network(get_file_path(story_id, entity_type))
    network_data = utils.generate_edges_from_characters(characters)
    return make_response(network_data)

# 上传图片
@entity_bp.route("/upload/image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image part"}), 400

    file = request.files["image"]
    story_id = request.form.get("story_id", "1")
    entity_id = request.form.get("entity_id", "unknown")
    entity_type = request.form.get("entity_type", "unknown")
    if file.filename == "" or not allowed_image_file(file.filename):
        return jsonify({"status": "error", "message": "Invalid file"}), 400
    ext = os.path.splitext(file.filename)[1].lower()
    filename = secure_filename(f"{entity_type}_{entity_id}{ext}")
    file_path = os.path.join(IMAGE_FOLDER,str(story_id),filename)
    file.save(file_path)

    image_url = f"/static/imgs/{story_id}/{filename}"
    return jsonify({"status": "success", "image_url": image_url})


########### utils ###########
def make_response(res):
    # 安全返回
    if not res:
        abort(404)
    else:
        return jsonify(res)