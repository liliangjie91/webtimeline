from flask import Flask,render_template
from routes_timeline import timeline_bp
from routes_character import character_bp

app = Flask(__name__)

# 注册蓝图
app.register_blueprint(timeline_bp)
app.register_blueprint(character_bp)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)