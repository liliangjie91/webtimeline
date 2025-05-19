from flask import Blueprint, render_template, jsonify, request, abort
import services.utils as utils
import json
import os

item_bp = Blueprint('item', __name__)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
FILE_FOLDER = os.path.join(BASE_DIR, 'data')
FILE_PREFIX = 'items'
story_map = utils.story_map

def get_file_path(story_id):
    return os.path.join(FILE_FOLDER, f'{FILE_PREFIX}_{story_id}.json')

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

# 添加物件
@item_bp.route('/story/<story_id>/item/add', methods=['POST'])
def add_item(story_id):
    new_item = request.json
    utils.add_entity(get_file_path(story_id), new_item)
    return jsonify({"status": "added"})

# 删除物件
@item_bp.route('/story/<story_id>/item/delete', methods=['POST'])
def delete_item(story_id):
    req_data = request.json
    utils.delete_entity(get_file_path(story_id), req_data)
    return jsonify({"status": "deleted"})

# 更新物件
@item_bp.route('/api/story/<story_id>/item/<int:item_id>', methods=['PATCH'])
def update_item(story_id, item_id):
    item_new = request.json
    utils.update_entity(get_file_path(story_id), item_id, item_new)
    return jsonify({"status": "success"})

######## 字典接口 ########
# 获取全部物件
@item_bp.route('/api/story/<story_id>/item')
def get_item_all(story_id):
    try:
        items = utils.load_entity_file(get_file_path(story_id))
        return jsonify(items)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 获取单个物件
@item_bp.route('/api/story/<story_id>/item/<int:item_id>')
def get_item(story_id, item_id):
    items = utils.load_entity_file(get_file_path(story_id))
    item = next((i for i in items if i['id'] == item_id), None)
    if item is None:
        abort(404)
    return jsonify(item)

# 获取物件字典（name -> id）
@item_bp.route('/api/story/<story_id>/item_dict')
def get_item_dict(story_id):
    try:
        items = utils.load_entity_file(get_file_path(story_id))
        item_dict = {item['name']: item['id'] for item in items}
        return jsonify(item_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

