from flask import Blueprint, render_template, jsonify, request, abort
from utils import story_map
import json
import os

item_bp = Blueprint('item', __name__)

file_folder = 'data'
file_prefix = 'items'

def get_file_path(story_id):
    return os.path.join(file_folder, f'{file_prefix}_{story_id}.json')

def load_items(path_item):
    if os.path.exists(path_item):
        with open(path_item, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return []

def save_items(data, path_item):
    with open(path_item, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@item_bp.route('/story/<story_id>/item_list')
def item_list(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('item_list.html', storyName=story_map[story_id])

@item_bp.route('/story/<story_id>/item')
def item_detail(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('item_detail.html', storyId=story_id, storyName=story_map[story_id])

# 更新物件
@item_bp.route('/api/story/<story_id>/item/<int:item_id>', methods=['PATCH'])
def update_item(story_id, item_id):
    item_new = request.json
    file_path = get_file_path(story_id)
    data = load_items(file_path)
    for idx, item in enumerate(data):
        if item['id'] == item_id:
            for key, value in item_new.items():
                data[idx][key] = value
            break
    save_items(data, file_path)
    return jsonify({"status": "success"})

# 添加物件
@item_bp.route('/story/<story_id>/item/add', methods=['POST'])
def add_item(story_id):
    new_item = request.json
    file_path = get_file_path(story_id)
    data = load_items(file_path)
    new_item['id'] = len(data) + 10001
    data.append(new_item)
    save_items(data, file_path)
    return jsonify({"status": "added"})

# 删除物件
@item_bp.route('/story/<story_id>/item/delete', methods=['POST'])
def delete_item(story_id):
    req_data = request.json
    item_id = req_data.get("id")
    file_path = get_file_path(story_id)
    data = load_items(file_path)
    data = [e for e in data if e["id"] != item_id]
    save_items(data, file_path)
    return jsonify({"status": "deleted"})

# 获取全部物件
@item_bp.route('/api/story/<story_id>/item')
def get_item_all(story_id):
    try:
        items = load_items(get_file_path(story_id))
        return jsonify(items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取物件字典（name -> id）
@item_bp.route('/api/story/<story_id>/item_dict')
def get_item_dict(story_id):
    try:
        items = load_items(get_file_path(story_id))
        item_dict = {item['name']: item['id'] for item in items}
        return jsonify(item_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取单个物件
@item_bp.route('/api/story/<story_id>/item/<int:item_id>')
def get_item(story_id, item_id):
    items = load_items(get_file_path(story_id))
    item = next((i for i in items if i['id'] == item_id), None)
    if item is None:
        abort(404)
    return jsonify(item)
