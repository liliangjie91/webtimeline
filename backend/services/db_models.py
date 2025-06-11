from flask_sqlalchemy import SQLAlchemy
import time

db = SQLAlchemy()

class BaseModel(db.Model):
    __abstract__ = True  # 告诉 SQLAlchemy 不要为这个类建表

    image = db.Column(db.String)                  
    isDeleted = db.Column(db.Boolean, default=False)
    deletedTime = db.Column(db.BigInteger, nullable=True)
    createTime = db.Column(db.BigInteger, default=lambda: int(time.time() * 1000))
    updateTime = db.Column(db.BigInteger, default=lambda: int(time.time() * 1000), onupdate=lambda: int(time.time() * 1000))
    shortId = db.Column(db.String, unique=True)
    storyId = db.Column(db.Integer, nullable=False)

class EntityMixin:

    def to_dict_all(self):
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}
    
    def to_dict(self):
        return {title: id for title, id in [(self.title, self.id)]}    
    
    @classmethod
    def get_one(cls, story_id, entity_id):
        result = cls.query.filter_by(storyId=story_id, id=int(entity_id), isDeleted=False).first()
        return result.to_dict_all()

    @classmethod
    def get_all(cls, story_id):
        result = cls.query.filter_by(storyId=story_id, isDeleted=False).all()
        return [obj.to_dict_all() for obj in result]
    
    @classmethod
    def get_title_id_dict(cls, story_id):
        result = cls.query.with_entities(cls.title, cls.id).filter_by(storyId=story_id, isDeleted=False).all()
        return {title: id for title, id in result}
    
    @classmethod
    def add(cls, story_id, data):
        obj = cls(**data)
        obj.storyId = int(story_id)
        db.session.add(obj)
        db.session.commit()
        return {"status": "added", "id": obj.id}

    @classmethod
    def delete(cls, story_id, entity_id, soft_delete=True):
        entity = cls.query.filter_by(storyId=story_id, id=entity_id).first()
        if not entity:
            return {"status": "not found"}, 404
        if soft_delete:
            entity.isDeleted = True
            entity.deletedTime = int(time.time() * 1000)
        else:
            db.session.delete(entity)
        db.session.commit()
        return {"status": "deleted" if not soft_delete else "soft deleted"}

    @classmethod
    def update(cls, story_id, entity_id, entity_new):
        entity = cls.query.filter_by(storyId=int(story_id), id=int(entity_id)).first()
        if entity:
            for key, value in entity_new.items():
                setattr(entity, key, value)
            db.session.commit()
            return {"status": "success"}
        else:
            return {"status": "not found"}, 404

class Event(BaseModel,EntityMixin):
    __tablename__ = 'events'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)  # 标题，必填
    start = db.Column(db.String)                  # 起始时间（字符串存储 yyyy-mm-dd hh:mm）
    end = db.Column(db.String)                    # 结束时间
    location = db.Column(db.String)               # 地点
    keyCharacter = db.Column(db.String)           # 主角
    characters = db.Column(db.Text)               # 所有人物（逗号分隔等）
    specialDay = db.Column(db.String)             # 节日
    season = db.Column(db.String)                 # 季节
    weather = db.Column(db.String)                # 天气
    chapter = db.Column(db.Integer)               # 所在章节
    category = db.Column(db.String)               # 情节分类
    tags = db.Column(db.String)                   # 标签
    storyLine = db.Column(db.String)              # 故事线
    eventLevel = db.Column(db.Integer)            # 故事等级
    parentEvent = db.Column(db.String)            # 父事件
    childEvent = db.Column(db.String)             # 子事件   
    note = db.Column(db.Text)                     # 备注
    story = db.Column(db.Text)                    # 故事内容
    textUrl = db.Column(db.String)                # 原文链接（可隐藏）

    @classmethod
    def get_event_for_character(cls, story_id, character_name):
        keys = ['id', 'title', 'start', 'end', 'storyLine', 'storyId']
        columns = [getattr(cls, key) for key in keys]
        result = cls.query.with_entities(*columns).filter_by(storyId=story_id, isDeleted=False).filter(cls.keyCharacter.like(f'%{character_name}%')).all()
        return [dict(zip(keys, row)) for row in result]
    

class Character(BaseModel,EntityMixin):
    __tablename__ = 'characters'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    aliases = db.Column(db.String(200))
    zi = db.Column(db.String(100))
    gender = db.Column(db.String(10))
    birth = db.Column(db.String(10))  # 出生日期（字符串存储 yyyy-mm-dd）
    death = db.Column(db.String(10))  # 死亡日期（字符串存储 yyyy-mm-dd）
    firstAge = db.Column(db.Integer)
    firstChapter = db.Column(db.Integer)
    hobby = db.Column(db.String(200))
    nature = db.Column(db.String(200))
    addr = db.Column(db.String(200))
    role = db.Column(db.String(200))
    chara = db.Column(db.String(100))  # 所属群体
    categoryFrist = db.Column(db.String(200))   # 一级分类 如 西门府；西门庆朋友；妓院
    categorySecond = db.Column(db.String(200))  # 二级分类 如 西门庆家人，西门庆丫头；西门庆结拜兄弟，西门庆同僚；李家妓院，韩家妓院等
    characterLevel = db.Column(db.Integer)      # 角色等级
    job = db.Column(db.String(100))
    body = db.Column(db.Text)
    description = db.Column(db.Text)
    mainEvents = db.Column(db.Text)
    note = db.Column(db.Text)
    related = db.Column(db.Text)
    
    def to_dict(self):
        return {name: id for name, id in [(self.name, self.id)]}
    
    @classmethod
    def get_title_id_dict(cls, story_id):
        result = cls.query.with_entities(cls.name, cls.id).filter_by(storyId=story_id, isDeleted=False).all()
        return {name: id for name, id in result}
    
        
    @classmethod
    def get_node4network(cls, story_id):
        result = cls.query.with_entities(cls.name, cls.id, cls.chara, cls.categoryFrist, cls.categorySecond, cls.related).filter_by(storyId=story_id, isDeleted=False).all()
        return [{'id':id, 'name':name, 'chara':chara,'categoryFirst':categoryFrist,'categorySecond':categorySecond, 'related':related} for name, id, chara,categoryFrist,categorySecond, related in result]


class Item(BaseModel,EntityMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    aliases = db.Column(db.String(200))
    firstChapter = db.Column(db.Integer)
    owner = db.Column(db.String(100))
    category = db.Column(db.String(100))
    tags = db.Column(db.String(200))
    price = db.Column(db.String(100))
    mainEvents = db.Column(db.Text)
    description = db.Column(db.Text)
    note = db.Column(db.Text)
    related = db.Column(db.Text)

    def to_dict(self):
        return {name: id for name, id in [(self.name, self.id)]}
    
    @classmethod
    def get_title_id_dict(cls, story_id):
        result = cls.query.with_entities(cls.name, cls.id).filter_by(storyId=story_id, isDeleted=False).all()
        return {name: id for name, id in result}

class Poem(BaseModel,EntityMixin):
    __tablename__ = 'poems'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    content = db.Column(db.Text)
    author = db.Column(db.String(100))
    firstChapter = db.Column(db.Integer)
    category = db.Column(db.String(100))
    tags = db.Column(db.String(200))
    description = db.Column(db.Text)
    note = db.Column(db.Text)
    
# 故事实体，小说或影视剧，红楼梦，水浒传等。即    
class Story(BaseModel,EntityMixin):
    __tablename__ = 'storys'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    author = db.Column(db.String(100))
    compositionTime = db.Column(db.String(100))           # 创作时间
    category = db.Column(db.String(100))
    tags = db.Column(db.String(200))
    keyCharacter = db.Column(db.String)           # 主角
    description = db.Column(db.Text)
    note = db.Column(db.Text)

    @classmethod
    def get_id_title_dict(cls):
        result = cls.query.with_entities(cls.id, cls.title).filter_by(isDeleted=False).all()
        return {str(id):title for id, title in result}

mapEntityClassName = {
    'event': Event,
    'character': Character,
    'item': Item,
    'poem': Poem,
    'story': Story
}