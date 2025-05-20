from flask import Blueprint, render_template, jsonify, request
from services.utils import story_map
import json
import os

timeline_bp = Blueprint('timeline', __name__)

@timeline_bp.route('/story/<story_id>/timeline')
def index(story_id):
    if story_id not in story_map:
        return "Invalid story ID", 404
    return render_template('timeline.html', storyName = story_map[story_id])