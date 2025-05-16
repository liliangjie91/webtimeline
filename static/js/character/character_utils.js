export async function loadCharacterDict(storyId) {
    try {
    const response = await fetch(`/api/story/${storyId}/character_dict`);
    return await response.json();
  } catch (error) {
    console.error('角色字典加载失败:', error);
    return {};
  }
  }

  // 上传图片并update image 地址
export async function uploadImage(event, storyId, aimId, aimType, elementImg){
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
    formData.append("story_id", storyId);  // 你也可以从JS动态传入
    formData.append("aim_id", aimId);
    formData.append("aim_type", aimType[0]); // c for item
  
    const res = await fetch(`/upload/image`, {
      method: "POST",
      body: formData,
    });
  
    const result = await res.json();
    if (result.status === "success") {
      elementImg.src = result.image_url + `?t=${Date.now()}`;  // 强制刷新缓存
      // 新的文件路径写入角色json
      fetch(`/api/story/${storyId}/${aimType}/${aimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"image":result.image_url})
      }).then(res => {
        if (res.ok) {
          // showSuccessMessage('更新成功');
          // location.reload();
        } else {
          alert('更新失败');
        }
      });
    } else {
      alert("上传失败：" + result.message);
    }
  }


 // 定义打开大图和关闭区域
export function imageClickToOpen(elementImg, elementModal, elementImgInModel){
  elementImg.addEventListener("click", () => {
    // modal.style.display = "block";
    elementImgInModel.src = elementImg.src;
    elementModal.classList.remove('hidden');
    });

  // 点击空白区域关闭（注意别点到 img 上）
  elementModal.addEventListener("click", (e) => {
    if (e.target === elementModal) {
      elementModal.classList.add('hidden');
    }
  });
}