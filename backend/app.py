from flask import Flask,render_template
from flask_migrate import Migrate
from backend.routes.routes_timeline import timeline_bp
from backend.routes.routes_entity_base import entity_bp
from backend.services.utils import load_story_map
from backend.services.db_models import db
import os

def create_app():
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    app = Flask(
        __name__,
        template_folder=os.path.join(BASE_DIR, 'templates'),
        static_folder=os.path.join(BASE_DIR, 'static')
    )

    # 数据库配置
    DB_PATH = os.path.join(BASE_DIR, 'data/data.db')  # 数据库文件路径
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # app.config['SQLALCHEMY_ECHO'] = True # 调试时打印SQL语句

    db.init_app(app)
    migrate = Migrate(app, db)
    with app.app_context():
        db.create_all()  # 创建所有模型中定义的表（包括 events 表）
        # print("数据库表创建成功")

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