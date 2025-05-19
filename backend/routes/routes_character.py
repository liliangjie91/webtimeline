from flask import Blueprint, render_template, jsonify, request, abort
import services.utils as utils
import json
import os
from werkzeug.utils import secure_filename

character_bp = Blueprint('character', __name__)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
FILE_FOLDER = os.path.join(BASE_DIR, 'data')
IMAGE_FOLDER = os.path.join(BASE_DIR, 'static/imgs/')
FILE_PREFIX = 'characters'
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

def allowed_image_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

def get_file_path(story_id='1'):
    return os.path.join(FILE_FOLDER, f'{FILE_PREFIX}_{story_id}.json')

@character_bp.route('/story/<story_id>/character_list')
def character_list(story_id):
    if story_id not in utils.story_map:
        return "Invalid story ID", 404
    return render_template('character_list.html', storyName=utils.story_map[story_id])

@character_bp.route('/story/<story_id>/character')
def character_detail(story_id):
    if story_id not in utils.story_map:
        return "Invalid story ID", 404
    return render_template('character_detail.html',storyId=story_id, storyName=utils.story_map[story_id])

# 添加角色
@character_bp.route('/story/<story_id>/character/add', methods=['POST'])
def add_character(story_id):
    new_character = request.json
    utils.add_entity(get_file_path(story_id), new_character)
    return jsonify({"status": "added"})
# 删除角色
@character_bp.route('/story/<story_id>/character/delete', methods=['POST'])
def delete_character(story_id):
    req_data = request.json
    utils.delete_entity(get_file_path(story_id), req_data)
    return jsonify({"status": "deleted"})
    
# 更新角色
@character_bp.route('/api/story/<story_id>/character/<int:character_id>', methods=['PATCH'])
def update_character(story_id, character_id):
    character_new = request.json
    utils.update_entity(get_file_path(story_id), character_id, character_new)
    return jsonify({"status": "success"})

##### 字典接口 #####

# 获取所有角色
@character_bp.route('/api/story/<story_id>/character')
def get_character_all(story_id):
    try:
        characters = utils.load_entity_file(get_file_path(story_id))
        return jsonify(characters)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取单个角色
@character_bp.route('/api/story/<story_id>/character/<int:character_id>')
def get_character(story_id,character_id):
    characters = utils.load_entity_file(get_file_path(story_id))
    character = next((c for c in characters if c['id'] == character_id), None)
    if character is None:
        abort(404)
    return jsonify(character)

# 仅返回简单字典（name -> id）    
@character_bp.route('/api/story/<story_id>/character_dict')
def get_character_dict(story_id):
    try:
        characters = utils.load_entity_file(get_file_path(story_id))
        character_dict = {char['name']: char['id'] for char in characters}
        return jsonify(character_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@character_bp.route("/upload/image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image part"}), 400

    file = request.files["image"]
    story_id = request.form.get("story_id", "1")
    aim_id = request.form.get("aim_id", "unknown")
    aim_type = request.form.get("aim_type", "unknown")
    if file.filename == "" or not allowed_image_file(file.filename):
        return jsonify({"status": "error", "message": "Invalid file"}), 400
    ext = os.path.splitext(file.filename)[1].lower()
    filename = secure_filename(f"{aim_type}_{aim_id}{ext}")
    file_path = os.path.join(IMAGE_FOLDER,str(story_id),filename)
    file.save(file_path)

    image_url = f"/{file_path}"
    return jsonify({"status": "success", "image_url": image_url})