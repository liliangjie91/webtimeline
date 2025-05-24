
const curPathName = window.location.pathname; //"/static/novel/jpm/text/part0014.html"
const goCatalogUrl = '/static/novel/jpm/text/part0000.html'; //"/static/novel/jpm/text/part0000.html"
const { prevUrl, nextUrl } = getNextChapter();
const navButtonsHtml = `
    <div class="chapter-nav" style="display:flex; gap:10px; justify-content:center; margin: 10px 0;">
      <button><a href="${prevUrl}" style="text-decoration: none; color: black;">上一章</a></button>
      <button><a href="${goCatalogUrl}" style="text-decoration: none; color: black;">目录</a></button>
      <button><a href="${nextUrl}" style="text-decoration: none; color: black;">下一章</a></button>
    </div>
  `;

document.addEventListener('DOMContentLoaded', function() {
    let hash = window.location.hash;
    if (hash) {
      try {
        const target = document.querySelector(decodeURIComponent(hash));
        if (target) {
          target.classList.add('highlight');
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        } else {
          console.log('没找到元素');
        }
      } catch (err) {
        console.error('querySelector出错:', err);
      }
    }
    
    const body = document.body;
    body.insertAdjacentHTML('afterbegin', navButtonsHtml);
    body.insertAdjacentHTML('beforeend', navButtonsHtml);
  });

const titleElement = document.querySelector('title');
const targetElement = document.getElementById('calibre_pb_0');
if (titleElement && targetElement) {
    const textContent = targetElement.textContent.trim();
    const firstPart = textContent.split(/\s+/)[0];
    titleElement.textContent = titleElement.textContent.trim()+'-'+firstPart;
}

function showSelectedLink(event, selection) {
    const selectedText = selection.toString().trim();
    if (!selectedText) return;
    const range = selection.getRangeAt(0);
    const parentParagraph = range.startContainer.parentElement.closest('p');
    const paragraphId = parentParagraph ? parentParagraph.id : null;
    const filePath = window.location.pathname;
    const showUrl = `${filePath}#${paragraphId}`;
    navigator.clipboard.writeText(showUrl)    
}

// 桌面端：鼠标选中
document.addEventListener('mouseup', (event) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
        showSelectedLink(event, selection);
    }
});

// 移动端：监听选中 + 手指松开
document.addEventListener('selectionchange', () => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const onTouchEnd = (event) => {
        showSelectedLink(event, selection);
        document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchend', onTouchEnd, { once: true });
});

function getNextChapter(){
  const path = window.location.pathname;
  const match = path.match(/(part)(\d+)(\.html)$/);
  if (!match) {
    console.warn("路径不符合 partXXXX.html 格式");
    return;
  }
  const prefix = match[1];     // "part"
  const number = match[2];     // "0001"
  const suffix = match[3];     // ".html"

  const currentNum = parseInt(number, 10);
  const numLength = number.length;

  const prevNum = currentNum>0 ? String(currentNum - 1).padStart(numLength, '0') : number;
  const nextNum = currentNum<103 ? String(currentNum + 1).padStart(numLength, '0') : number;

  const basePath = path.slice(0, path.lastIndexOf('/') + 1); // "/story/1/"

  const prevUrl = basePath + prefix + prevNum + suffix;
  const nextUrl = basePath + prefix + nextNum + suffix;
  return {prevUrl,nextUrl};
}