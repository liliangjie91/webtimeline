from flask import Blueprint, render_template, jsonify, request
import json
import os

timeline_bp = Blueprint('timeline', __name__)

DATA_FILE = 'data/events.json'

def load_data():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@timeline_bp.route('/timeline')
def index():
    return render_template('timeline.html')

@timeline_bp.route('/event')
def get_events():
    data = load_data()
    return jsonify(data['events'])

@timeline_bp.route('/event/update', methods=['POST'])
def update_event():
    event = request.json
    data = load_data()
    for idx, item in enumerate(data['events']):
        if item['id'] == event['id']:
            data['events'][idx] = event
            break
    save_data(data)
    return jsonify({"status": "success"})

@timeline_bp.route('/event/add', methods=['POST'])
def add_event():
    new_event = request.json
    data = load_data()
    data['events'].append(new_event)
    save_data(data)
    return jsonify({"status": "added"})

@timeline_bp.route('/event/delete', methods=['POST'])
def delete_event():
    req_data = request.json
    event_id = req_data.get("id")
    data = load_data()
    data["events"] = [e for e in data["events"] if e["id"] != event_id]
    save_data(data)
    return jsonify({"status": "deleted"})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)