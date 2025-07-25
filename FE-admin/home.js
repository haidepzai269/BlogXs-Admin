

document.addEventListener('DOMContentLoaded', async () => {
  const postsContainer = document.getElementById('postsContainer');
  
  try {
    const res = await authFetch('/api/admin/posts');
    const posts = await res.json();

    postsContainer.innerHTML = '';
    posts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post';
      postDiv.innerHTML = `
        <p><strong>${post.username}</strong> - ${new Date(post.created_at).toLocaleString()}</p>
        <p>${post.content}</p>
        <button onclick="deletePost(${post.id})">🗑 Xóa</button>
      `;
      postsContainer.appendChild(postDiv);
    });
  } catch (err) {
    postsContainer.textContent = 'Lỗi khi tải bài viết';
  }
});

async function deletePost(id) {
  if (!confirm('Bạn có chắc muốn xoá bài viết này?')) return;

  try {
    const res = await authFetch(`/api/admin/posts/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('Đã xoá bài viết!');
      location.reload();
    } else {
      alert('Không xoá được bài viết.');
    }
  } catch (err) {
    alert('Lỗi mạng hoặc server.');
  }
}
document.getElementById('sendNotifyBtn').onclick = async () => {
  const content = document.getElementById('notifyInput').value;

  const res = await authFetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });

  const data = await res.json();
  alert('Đã gửi thông báo!');
};

function updateClock(timezone) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  });

  const formatted = formatter.format(now);
  document.getElementById('clock').textContent = formatted;

  // Tự động đổi màu theo giờ
  const hour = new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours();
  const container = document.getElementById('clockContainer');

  if (hour >= 6 && hour < 12) {
    container.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Sáng – xanh dương
  } else if (hour >= 12 && hour < 18) {
    container.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Trưa – xanh lá
  } else if (hour >= 18 && hour < 21) {
    container.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Tối – cam
  } else {
    container.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // Đêm – nâu tối
  }
}

let currentTimezone = 'Asia/Ho_Chi_Minh';

setInterval(() => updateClock(currentTimezone), 1000);

document.getElementById('timezoneSelector').addEventListener('change', (e) => {
  currentTimezone = e.target.value;
  updateClock(currentTimezone);
});

//
document.getElementById('floatingLogo').addEventListener('click', () => {
  // 1. Ẩn toàn bộ nội dung body trừ quả cầu và canvas
  const bodyChildren = [...document.body.children];
  bodyChildren.forEach(el => {
    if (el.id !== 'bgCanvas') {
      el.style.display = 'none';
    }
  });

  // 2. Mở rộng canvas ra full màn
  const canvas = document.getElementById('bgCanvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '9999';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';

  // 3. Optionally: thêm dòng chữ nhỏ góc dưới "Click để thoát"
  const hint = document.createElement('div');
  hint.innerText = '✨ Click bất kỳ để trở lại Dashboard';
  hint.style.position = 'fixed';
  hint.style.bottom = '20px';
  hint.style.width = '100%';
  hint.style.textAlign = 'center';
  hint.style.color = '#0ff';
  hint.style.fontSize = '1.2rem';
  hint.style.fontFamily = 'monospace';
  hint.style.zIndex = '10000';
  hint.id = 'backHint';
  document.body.appendChild(hint);

  // 4. Bắt sự kiện để quay trở lại
  document.body.addEventListener('click', restoreDashboard, { once: true });
});

function restoreDashboard() {
  const bodyChildren = [...document.body.children];
  bodyChildren.forEach(el => {
    if (el.id !== 'bgCanvas') {
      el.style.display = '';
    }
  });

  // reset canvas
  const canvas = document.getElementById('bgCanvas');
  canvas.style.position = '';
  canvas.style.top = '';
  canvas.style.left = '';
  canvas.style.zIndex = '';
  canvas.style.width = '';
  canvas.style.height = '';

  const hint = document.getElementById('backHint');
  if (hint) hint.remove();
}



