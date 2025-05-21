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

const hiddenFieldsCharacter = [
  'detail-character-div-related','detail-character-div-body'
];
const hiddenFieldsItem = [
 'detail-item-div-related'
];
const hiddenFieldsEvent = [
    "detail-event-div-textUrl"
];

export const mapEntityFields = {
  'item' : itemFields,
  'character' : characterFields,
  'event' : eventFields
};

export const mapGroupKeyMain = {
  'item' : 'category',
  'character' : 'chara',
  'event' : 'chapter'
}

export const mapEntityHiddenElement = {
  'item' : hiddenFieldsItem,
  'character' : hiddenFieldsCharacter,
  'event' : hiddenFieldsEvent
};