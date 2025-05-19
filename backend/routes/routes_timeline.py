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