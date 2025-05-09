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