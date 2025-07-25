async function authFetch(url, options = {}) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
  
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...(options.headers || {})
      }
    });
  
    if (res.status === 401 && refreshToken) {
      // Token hết hạn → Gọi refresh
      const refreshRes = await fetch('/api/admin/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
  
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.accessToken);
        return authFetch(url, options); // Gọi lại lần nữa
      } else {
        localStorage.clear();
        window.location.href = 'auth.html';
      }
    }
  
    return res;
  }
  