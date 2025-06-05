from flask import Blueprint, render_template, jsonify, request
from backend.services.utils import load_story_map
import json, os

timeline_bp = Blueprint('timeline', __name__)

@timeline_bp.route('/story/timeline')
def index():
    story_id = request.args.get('story_id', '1')
    story_map = load_story_map()
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('timeline.html', storyName = story_map[story_id])