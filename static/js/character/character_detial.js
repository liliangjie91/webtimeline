
let characterData = {};
const params = new URLSearchParams(window.location.search);
const characterId = params.get('id');


if (!characterId) {
  document.body.innerHTML = '<h2>缺少角色ID</h2>';
} else {
  fetch(`/api/character/${characterId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('角色不存在');
      }
      return res.json();
    })
    .then(data => {
      characterData = data;
      renderCharacter(data); // 你自定义的渲染函数
    })
    .catch(err => {
      document.body.innerHTML = `<h2>${err.message}</h2>`;
    });
}

// 开始编辑
document.getElementById('edit-btn').onclick = () => {
    toggleEditable(true);
};
// 取消编辑
document.getElementById('cancel-btn').onclick = () => {
    toggleEditable(false);
};

document.getElementById('save-btn').onclick = () => {
    
    const id = characterData.id;
    const updateData = updateCharacter(id);

    if (Object.keys(updateData).length === 0) {
        alert('没有字段被修改');
        return;
      }

    updateData['updateTime'] = Date.now();

    fetch(`/api/character/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      }).then(res => {
        if (res.ok) {
        //   showSuccessMessage('更新成功');
          location.reload();
        } else {
          alert('更新失败');
        }
      });
  };

// 删除人物
document.getElementById('delete-btn').onclick = () => {
    if (confirm("确定删除这个人物吗？")) {
        fetch('/character/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: characterData.id })
        }).then(() => {
        // dataRef.remove(selectedItem.id);
        // document.getElementById('popup').classList.add('hidden');
        window.location.href = '/character_list';
        // location.reload();
        });
    }
}

// 角色详情渲染函数
function renderCharacter(character) {
    function safeText(value) {
        return value !== undefined && value !== null && value !== '' ? value : '-';
    }
    document.getElementById('main-title').innerText = safeText(character.name)+'-人物详情';
    document.getElementById('detail-character-title').innerText = safeText(character.name);
    document.getElementById('detail-character-name').innerText = safeText(character.name);
    document.getElementById('detail-character-aliases').innerText = safeText(character.aliases);
    document.getElementById('detail-character-zi').innerText = safeText(character.zi);
    document.getElementById('detail-character-birth').innerText = safeText(character.birth);
    document.getElementById('detail-character-firstAge').innerText = safeText(character.firstAge);
    document.getElementById('detail-character-firstChapter').innerText = safeText(character.firstChapter);
    document.getElementById('detail-character-hobby').innerText = safeText(character.hobby);
    document.getElementById('detail-character-nature').innerText = safeText(character.nature);
    document.getElementById('detail-character-addr').innerText = safeText(character.addr);
    document.getElementById('detail-character-role').innerText = safeText(character.role);
    document.getElementById('detail-character-chara').innerText = safeText(character.chara);
    document.getElementById('detail-character-job').innerText = safeText(character.job);
    document.getElementById('detail-character-body').innerText = safeText(character.body);
    document.getElementById('detail-character-note').innerText = safeText(character.note);
    document.getElementById('detail-character-description').innerText = safeText(character.description);
    document.getElementById('detail-character-mainEvents').innerText = safeText(character.mainEvents);

    const img = document.getElementById('character-img');
    // img.src = character.image || "/static/imgs/cover_jpm.jpg";
  
    showRelatedCharacters(character.related);
  }

function showRelatedCharacters(related) {
    const relatedEl = document.getElementById('related-characters-block');
    relatedEl.innerHTML = '';
    if (!related) {
      relatedEl.innerHTML = '<li>无</li>';
      return;
    }
    const relatedList = related.split(';').map(relation => relation.trim());
    console.log(relatedList);
    relatedList.forEach(relation => {
        const [relationType, name] = relation.split(':').map(item => item.trim());
        const nameList = name.split(',').map(item => item.trim());
        const block = document.createElement('div');
        block.className = 'relation-block';

        const label = document.createElement('div');
        label.className = 'relation-label';
        label.innerText = `${relationType}:`;
        block.appendChild(label);

        const list = document.createElement('div');
        list.className = 'relation-list';

        nameList.forEach(person => {
            // const a = document.createElement('a');
            // a.className = 'relation-person';
            // a.href = `/character/${person.id}`;
            // a.innerText = person.name;
            const span = document.createElement('span');
            span.className = 'relation-person';
            span.innerText = person;
            list.appendChild(span);
        });

        block.appendChild(list);
        relatedEl.appendChild(block);
    });
  }

const character_fields = [
    'name', 'aliases', 'zi', 'birth', 'firstAge', 'firstChapter',
    'hobby', 'nature', 'addr', 'role', 'chara', 'job', 'body', 'note', 'description', 'mainEvents'
];
function updateCharacter(id) {
    let updateData = {};
    character_fields.forEach(field => {
        const element = document.getElementById(`detail-character-${field}`);
        if (!element) return;
        const newValue = element.innerText.trim();
        if (newValue === undefined || newValue === null || newValue === '-') {
            return;
        }
        // newValue = newValue.trim();
        
        const oldValue = (characterData[field] || '').toString().trim();
        if (newValue !== oldValue) {
            updateData[field] = field === 'firstAge' || field === 'firstChapter'
                ? parseInt(newValue) || null
                : newValue;
        }
    });

    return updateData;
}

function toggleEditable(editing) {
    // const toggle = val => document.getElementById(val).contentEditable = editing;
    const toggle = val => {
        const element = document.getElementById(val);
        element.contentEditable = editing;

        // 禁用自动滚动行为
        element.addEventListener('focus', (e) => {
        e.preventDefault(); // 阻止默认滚动行为
        });
    };
    character_elments = [
        'detail-character-name', 'detail-character-aliases', 'detail-character-zi', 'detail-character-birth',
        'detail-character-firstAge', 'detail-character-firstChapter', 'detail-character-hobby', 'detail-character-nature',
        'detail-character-addr', 'detail-character-role', 'detail-character-chara', 'detail-character-job',
        'detail-character-body', 'detail-character-note','detail-character-description', 'detail-character-mainEvents'
    ];
    character_elments.forEach(toggle);
    document.getElementById('edit-btn').classList.toggle('hidden', editing);
    document.getElementById('save-btn').classList.toggle('hidden', !editing);
    document.getElementById('cancel-btn').classList.toggle('hidden', !editing);
}