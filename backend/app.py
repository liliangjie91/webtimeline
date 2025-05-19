from flask import Flask,render_template
from routes.routes_timeline import timeline_bp
from routes.routes_entity_base import entity_bp
from services.utils import story_map, load_story_map
import os

def create_app():
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    app = Flask(
        __name__,
        template_folder=os.path.join(BASE_DIR, 'templates'),
        static_folder=os.path.join(BASE_DIR, 'static')
    )

    # 注册蓝图
    app.register_blueprint(timeline_bp)
    app.register_blueprint(entity_bp)

    @app.route('/')
    def index():
        return render_template('index.html', storys=load_story_map().items())

    return app

if __name__ == '__main__':
    # print(load_story_map())
    app = create_app()
    app.run(host='0.0.0.0', port=5001, debug=True)