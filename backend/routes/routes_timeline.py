from flask import Blueprint, render_template, jsonify, request
from services.utils import story_map
import json
import os

timeline_bp = Blueprint('timeline', __name__)

file_folder = 'data'
file_prifix = 'events'


def get_file_path(story_id):
    return os.path.join(file_folder, f'{file_prifix}_{story_id}.json')

def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@timeline_bp.route('/story/<story_id>/timeline')
def index(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('timeline.html', storyName = story_map[story_id])

@timeline_bp.route('/story/<story_id>/event/<int:event_id>', methods=['PATCH'])
def update_event(story_id,event_id):
    event = request.json
    file_path = get_file_path(story_id)
    data = load_data(file_path)
    for idx, item in enumerate(data):
        if item['id'] == event_id:
            for key, value in event.items():
                # setattr(data['characters'][idx], key, value)
                data[idx][key] = value
            break
    save_data(data,file_path)
    return jsonify({"status": "success"})

@timeline_bp.route('/story/<story_id>/event/add', methods=['POST'])
def add_event(story_id):
    new_event = request.json
    file_path = get_file_path(story_id)
    data = load_data(file_path)
    ids = [e['id'] for e in data]
    id_tobe = len(ids)+10001
    new_event['id'] = id_tobe if id_tobe not in ids else max(ids)+1
    data.append(new_event)
    save_data(data,file_path)
    return jsonify({"status": "added"})

@timeline_bp.route('/story/<story_id>/event/delete', methods=['POST'])
def delete_event(story_id):
    req_data = request.json
    file_path = get_file_path(story_id)
    event_id = req_data.get("id")
    data = load_data(file_path)
    data = [e for e in data if e["id"] != event_id]
    save_data(data,file_path)
    return jsonify({"status": "deleted"})

# api
@timeline_bp.route('/api/story/<story_id>/event')
def get_events(story_id):
    data = load_data(get_file_path(story_id))
    return jsonify(data)
