from flask import Blueprint, render_template, jsonify
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
    
# 字典接口
@character_bp.route('/api/character_dict')
def get_character_dict():
    try:
        characters = load_characters()
        # 构建 {name: id} 形式的字典
        character_dict = {char['name']: char['id'] for char in characters}
        return jsonify(character_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500