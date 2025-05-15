from flask import Flask,render_template
from routes_timeline import timeline_bp
from routes_character import character_bp
from routes_item import item_bp
from utils import story_map, load_story_map

app = Flask(__name__)

# 注册蓝图
app.register_blueprint(timeline_bp)
app.register_blueprint(character_bp)
app.register_blueprint(item_bp)

@app.route('/')
def index():
    return render_template('index.html', storys = load_story_map().items())

if __name__ == '__main__':
    # print(load_story_map())
    app.run(host='0.0.0.0', port=5001, debug=True)