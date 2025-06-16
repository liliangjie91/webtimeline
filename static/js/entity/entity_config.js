const itemFields = [
  'name','aliases','firstChapter','category','tags','owner','price','note','description','mainEvents','related'
];
const characterFields = [
  'name', 'aliases', 'gender','zi', 'birth', 'firstAge', 'firstChapter',
  'hobby', 'nature', 'addr', 'role','categoryFirst','categorySecond','characterLevel', 'job', 'body', 'note', 'description', 'mainEvents','related'
];
const eventFields = [
  'title', 'start','end', 'location', 'keyCharacter', 'characters', 'story', 'eventLevel','parentEvent','childEvent',
  'category','tags','chapter','season','specialDay','weather','storyLine','note','textUrl'
];
const poemFields = [
  "title","author","category","tags","firstChapter","description","content","note"
];
const storyFields = [
  "title","author","compositionTime","category","tags","keyCharacter","description","note"
];
const hiddenFieldsCharacter = [
  'detail-character-div-related','detail-character-div-body'
];
const hiddenFieldsItem = [
 'detail-item-div-related'
];
const hiddenFieldsEvent = [
    "detail-event-div-textUrl"
];
const hiddenFieldsPoem = []

const hiddenFieldsStory = []

export const mapEntityFields = {
  'item' : itemFields,
  'character' : characterFields,
  'event' : eventFields,
  'poem' : poemFields,
  'story' : storyFields
};

export const mapGroupKeyMain = {
  'item' : 'category',
  'character' : 'categorySecond',
  'event' : 'chapter',
  'poem' : 'category',
  'story' : 'category'
}

export const mapEntityHiddenElement = {
  'item' : hiddenFieldsItem,
  'character' : hiddenFieldsCharacter,
  'event' : hiddenFieldsEvent,
  'poem' : hiddenFieldsPoem
};

export const mapStoryTOCUrl = {
  '1' : "/static/novel/jpm/text/part0000.html",
  '2' : "/static/novel/hlm/text/text00001.html",
};