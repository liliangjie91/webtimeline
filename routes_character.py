from flask import Blueprint, render_template, jsonify, request, abort
from utils import story_map
import json
import os
from werkzeug.utils import secure_filename

character_bp = Blueprint('character', __name__)

file_folder = 'data'
file_prifix = 'characters'

IMAGE_FOLDER = 'static/imgs/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_file_path(story_id):
    return os.path.join(file_folder, f'{file_prifix}_{story_id}.json')

def load_characters(path_character):
    if os.path.exists(path_character):
        with open(path_character, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return []

def save_characters(data,path_character):
    with open(path_character, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@character_bp.route('/story/<story_id>/character_list')
def character_list(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('character_list.html', storyName=story_map[story_id])

@character_bp.route('/story/<story_id>/character')
def character_detail(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('character_detail.html',storyId=story_id, storyName=story_map[story_id])
    
# 更新角色
@character_bp.route('/api/story/<story_id>/character/<int:character_id>', methods=['PATCH'])
def update_character(story_id, character_id):
    character_new = request.json
    file_path = get_file_path(story_id)
    data = load_characters(file_path)
    for idx, item in enumerate(data):
        if item['id'] == character_id:
            for key, value in character_new.items():
                # setattr(data[idx], key, value)
                data[idx][key] = value
            break
    save_characters(data, file_path)
    # print(data[idx])
    return jsonify({"status": "success"})
# 添加角色
@character_bp.route('/story/<story_id>/character/add', methods=['POST'])
def add_character(story_id):
    new_character = request.json
    file_path = get_file_path(story_id)
    data = load_characters(file_path)
    length = len(data)
    new_character['id'] = length + 10001
    data.append(new_character)
    save_characters(data, file_path)
    return jsonify({"status": "added"})
# 删除角色
@character_bp.route('/story/<story_id>/character/delete', methods=['POST'])
def delete_character(story_id):
    req_data = request.json
    character_id = req_data.get("id")
    file_path = get_file_path(story_id)
    data = load_characters(file_path)
    data = [e for e in data if e["id"] != character_id]
    save_characters(data, file_path)
    return jsonify({"status": "deleted"})

# 字典接口
@character_bp.route('/api/story/<story_id>/character')
def get_character_all(story_id):
    try:
        characters = load_characters(get_file_path(story_id))
        return jsonify(characters)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@character_bp.route('/api/story/<story_id>/character_dict')
def get_character_dict(story_id):
    try:
        characters = load_characters(get_file_path(story_id))
        # 构建 {name: id} 形式的字典
        character_dict = {char['name']: char['id'] for char in characters}
        return jsonify(character_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@character_bp.route('/api/story/<story_id>/character/<int:character_id>')
def get_character(story_id,character_id):
    characters = load_characters(get_file_path(story_id))
    character = next((c for c in characters if c['id'] == character_id), None)
    if character is None:
        abort(404)
    return jsonify(character)

@character_bp.route("/upload/image", methods=["POST"])
def upload_character_image():
    if "image" not in request.files:
        return jsonify({"status": "error", "message": "No image part"}), 400

    file = request.files["image"]
    story_id = request.form.get("story_id", "1")
    aim_id = request.form.get("aim_id", "unknown")
    aim_type = request.form.get("aim_type", "unknown")
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"status": "error", "message": "Invalid file"}), 400
    ext = os.path.splitext(file.filename)[1].lower()
    filename = secure_filename(f"{aim_type}_{aim_id}{ext}")
    file_path = os.path.join(IMAGE_FOLDER,str(story_id),filename)
    file.save(file_path)

    image_url = f"/{file_path}"
    return jsonify({"status": "success", "image_url": image_url})