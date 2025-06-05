import argparse
import json, os, csv
from flask import Flask
from backend.services.db_models import db, mapEntityClassName  # 假设你有这些模型

# 获取 data.db 的绝对路径（父目录）
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
DB_PATH = os.path.join(BASE_DIR, 'data/data.db')
# 初始化 Flask 应用
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# 导入函数
def import_json_to_db(filepath, model_class, story_id):
    with open(filepath, encoding='utf-8') as f:
        data = json.load(f)
    for record in data:
        record['storyId'] = story_id
        db.session.add(model_class(**record))
    db.session.commit()
    print(f"导入 {len(data)} 条记录成功")

# 导出函数
def export_db_to_json(model_class, filepath, story_id):
    query = model_class.query.filter_by(storyId=story_id)
    data = [obj.to_dict_all() for obj in query.all()]
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"导出到：{filepath}")

def export_db_to_csv(model_class, output_path, story_id):
    query = model_class.query.filter_by(storyId=story_id).all()
    if not query:
        print("没有找到任何记录")
        return
    # 获取字段名
    fieldnames = [column.name for column in model_class.__table__.columns]
    with open(output_path, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for d in query:
            writer.writerow(d.to_dict_all())

    print(f"成功导出 {len(query)} 条记录到 {output_path}")

# 解析命令行参数
parser = argparse.ArgumentParser(description='导入导出实体数据')
parser.add_argument('--mode', choices=['import', 'export'], default='import', required=True, help='模式：import 或 export')
parser.add_argument('--entity', choices=mapEntityClassName.keys(), default='event', required=True, help='实体类型，如 event')
parser.add_argument('--story', type=int, required=True, default=1, help='故事 ID')
parser.add_argument('--file', required=True, help='输入/输出的 JSON 文件路径')
# parser.add_argument('--dropall', default=False, help='是否清空后新建表')

args = parser.parse_args()

# 执行逻辑
with app.app_context():
    db.create_all()
    model = mapEntityClassName[args.entity]
    if args.mode == 'import':
        import_json_to_db(args.file, model, args.story)
    elif args.mode == 'export':
        if args.file.endswith('.csv'):
            export_db_to_csv(model, args.file, args.story)
        else:
            if not args.file.endswith('.json'):
                args.file += '.json'
            if not os.path.exists(os.path.dirname(args.file)):
                os.makedirs(os.path.dirname(args.file))
            export_db_to_json(model, args.file, args.story)