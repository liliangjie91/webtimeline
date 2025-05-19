from flask import Blueprint, render_template, jsonify, request, abort
from werkzeug.utils import secure_filename
import services.utils as utils
import os,json

entity_bp = Blueprint('entity', __name__)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
FILE_FOLDER = os.path.join(BASE_DIR, 'data')
IMAGE_FOLDER = os.path.join(BASE_DIR, 'static/imgs/')
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
story_map = utils.story_map

def allowed_image_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

def get_file_path(story_id, entity_type='item'):
    return os.path.join(FILE_FOLDER, f'{entity_type}s_{story_id}.json')

# 实体列表-首页
@entity_bp.route('/story/<story_id>/<entity_type>/list')
def entity_list(story_id, entity_type):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template(f'{entity_type}_list.html', storyName=story_map[story_id])

# 实体详情页
@entity_bp.route('/story/<story_id>/<entity_type>')
def entity_detail(story_id, entity_type):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template(f'{entity_type}_detail.html', storyId=story_id, storyName=story_map[story_id])

# 添加实体
@entity_bp.route('/story/<story_id>/<entity_type>/add', methods=['POST'])
def add_entity(story_id, entity_type):
    new_entity = request.json
    utils.add_entity(get_file_path(story_id, entity_type), new_entity)
    return jsonify({"status": "added"})

# 删除实体
@entity_bp.route('/story/<story_id>/<entity_type>/delete', methods=['POST'])
def delete_entity(story_id, entity_type):
    req_data = request.json
    utils.delete_entity(get_file_path(story_id, entity_type), req_data)
    return jsonify({"status": "deleted"})

# 更新实体
@entity_bp.route('/api/story/<story_id>/<entity_type>/<int:entity_id>', methods=['PATCH'])
def update_entity(story_id, entity_id, entity_type):
    entity_new = request.json
    utils.update_entity(get_file_path(story_id, entity_type), entity_id, entity_new)
    return jsonify({"status": "success"})

######## 字典接口 ########
# 获取全部实体
@entity_bp.route('/api/story/<story_id>/<entity_type>')
def get_entity_all(story_id, entity_type):
    try:
        entitys = utils.load_entity_file(get_file_path(story_id, entity_type))
        return jsonify(entitys)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取单个实体
@entity_bp.route('/api/story/<story_id>/<entity_type>/<int:entity_id>')
def get_entity(story_id, entity_id, entity_type):
    entitys = utils.load_entity_file(get_file_path(story_id, entity_type))
    entity = next((i for i in entitys if i['id'] == entity_id), None)
    if entity is None:
        abort(404)
    return jsonify(entity)

# 获取实体字典（name -> id）
@entity_bp.route('/api/story/<story_id>/<entity_type>/dict')
def get_entity_dict(story_id, entity_type):
    try:
        entitys = utils.load_entity_file(get_file_path(story_id, entity_type))
        entity_dict = {entity['name']: entity['id'] for entity in entitys}
        return jsonify(entity_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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