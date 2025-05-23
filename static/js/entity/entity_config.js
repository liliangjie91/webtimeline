const itemFields = [
  'name','aliases','firstChapter','category','tags','owner','price','note','description','mainEvents','related'
];
const characterFields = [
  'name', 'aliases', 'gender','zi', 'birth', 'firstAge', 'firstChapter',
  'hobby', 'nature', 'addr', 'role', 'chara', 'job', 'body', 'note', 'description', 'mainEvents','related'
];
const eventFields = [
  'title', 'start','end', 'location', 'keyCharacter', 'characters', 'story',
  'category','tags','chapter','season','specialDay','weather','storyLine','note','textUrl'
];
const textFields = [
  "title","author","category","tags","firstChapter","description","content","note"
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
const hiddenFieldsText = []

export const mapEntityFields = {
  'item' : itemFields,
  'character' : characterFields,
  'event' : eventFields,
  'text' : textFields
};

export const mapGroupKeyMain = {
  'item' : 'category',
  'character' : 'chara',
  'event' : 'chapter',
  'text' : 'category'
}

export const mapEntityHiddenElement = {
  'item' : hiddenFieldsItem,
  'character' : hiddenFieldsCharacter,
  'event' : hiddenFieldsEvent,
  'text' : hiddenFieldsText
};