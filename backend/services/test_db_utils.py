from flask import Flask
from backend.services.db_models import db, mapEntityClassName
import backend.services.db_utils as db_utils
import os

# 获取 data.db 的绝对路径（父目录）
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
DB_PATH = os.path.join(BASE_DIR, 'data/data.db')
# 初始化 Flask 应用
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    # # 测试新增
    # result = db_utils.add_entity(1, 'event', {
    #     "title": "测试事件",
    #     "start": "1111-01-01",
    #     "storyLine": "测试线"
    # })
    # print("添加结果:", result)
    # q = db.session.query(Event).filter_by(id=result["id"]).first()  # 清理测试数据
    # print("查询结果:", q.to_dict_all())
    # # 测试查询并更新
    # new_id = result["id"]
    # res = db_utils.update_entity(1, 'event', new_id, {
    #     "note": "更新备注内容"
    # })
    
    # q = db.session.query(Event).filter_by(id=result["id"]).first()  # 清理测试数据
    # print("查询结果:", q.to_dict_all())
    # # 测试删除
    # res = db_utils.delete_entity(1, 'event', new_id)
    # print("更新结果:", res)
    # q = db.session.query(Event).filter_by(id=result["id"]).first()  # 清理测试数据
    # print("查询结果:", q.to_dict_all())

    # # 测试删除
    # res = db_utils.delete_entity(1, 'event', new_id, soft_delete=False)
    # print("更新结果:", res)

    # res = db_utils.get_entity_all(1, 'item')
    # print("查询结果:", len(res))
    # print("查询结果:", res[:3])  # 打印前三条记录

    # res = db_utils.get_entity_all(1, 'item', content_type='simple')
    # print("查询结果:", len(res))
    # print("查询结果:", res[:3])  # 打印前三条记录

    # res = db_utils.get_entity(1, 'item', 10001)
    # print("查询结果:", res)  # 打印单条记录
    # print(mapEntityClassName['story'].get_all(0))
    # print(mapEntityClassName['story'].get_title_id_dict(0))
    print(mapEntityClassName['event'].get_event_for_character(1, '庞春梅'))
    # python -m backend.services.test_db_utils

