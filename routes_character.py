from flask import Blueprint, render_template, request
import json
import os

character_bp = Blueprint('character', __name__)

CHARACTER_FILE = 'data/characters.json'

def load_characters():
    if os.path.exists(CHARACTER_FILE):
        with open(CHARACTER_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return []

def save_characters(data):
    with open(CHARACTER_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@character_bp.route('/characters')
def character_list():
    characters = load_characters()
    return render_template('character_list.html', characters=characters)

@character_bp.route('/character/<character_id>')
def character_detail(character_id):
    characters = load_characters()
    character = next((c for c in characters if c['id'] == character_id), None)
    if character:
        return render_template('character_detail.html', character=character)
    else:
        return "角色不存在", 404