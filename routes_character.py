from flask import Blueprint, render_template, jsonify, request, abort
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

@character_bp.route('/character_list')
def character_list():
    return render_template('character_list.html')

@character_bp.route('/character')
def character_detail():
    character_id = request.args.get('id')
    return render_template('character_detail.html')
    

@character_bp.route('/api/character/<int:character_id>', methods=['PATCH'])
def update_character(character_id):
    character_new = request.json
    # print(character_new)
    data = load_characters()
    for idx, item in enumerate(data['characters']):
        if item['id'] == character_id:
            for key, value in character_new.items():
                # setattr(data['characters'][idx], key, value)
                data['characters'][idx][key] = value
            break
    save_characters(data)
    # print(data['characters'][idx])
    return jsonify({"status": "success"})

@character_bp.route('/character/add', methods=['POST'])
def add_character():
    new_character = request.json
    data = load_characters()
    length = len(data['characters'])
    new_character['id'] = length + 1
    data['characters'].append(new_character)
    save_characters(data)
    return jsonify({"status": "added"})

@character_bp.route('/character/delete', methods=['POST'])
def delete_character():
    req_data = request.json
    character_id = req_data.get("id")
    data = load_characters()
    data["characters"] = [e for e in data["characters"] if e["id"] != character_id]
    save_characters(data)
    return jsonify({"status": "deleted"})

# 字典接口
@character_bp.route('/api/character')
def get_character_all():
    try:
        characters = load_characters()
        return jsonify(characters['characters'])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@character_bp.route('/api/character_dict')
def get_character_dict():
    try:
        characters = load_characters()['characters']
        # 构建 {name: id} 形式的字典
        character_dict = {char['name']: char['id'] for char in characters}
        return jsonify(character_dict)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@character_bp.route('/api/character/<int:character_id>')
def get_character(character_id):
    characters = load_characters()["characters"]
    character = next((c for c in characters if c['id'] == character_id), None)
    if character is None:
        abort(404)
    return jsonify(character)