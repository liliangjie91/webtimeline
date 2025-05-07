import os,json
story_map = {
    '1': '金瓶梅',
    '2': '红楼梦'
}

story_path = 'data/storys.json'
def load_story_map():
    if os.path.exists(story_path):
        with open(story_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        return {"1":"金瓶梅"}