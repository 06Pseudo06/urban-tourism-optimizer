export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const safeApiFetch = async (path, options = {}) => {
  // Safely join the URL to prevent missing or double slashes
  const safeBase = API_BASE_URL.replace(/\/$/, '');
  const safePath = path.startsWith('/') ? path : `/${path}`;
  const url = `${safeBase}${safePath}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}), // Safely merge custom headers
    },
  });

  // Handle 204 No Content explicitly so it doesn't fail on empty response checks
  if (res.status === 204) {
    return { success: true }; 
  }

  const text = await res.text().catch(() => '');
  
  if (!text.trim()) {
    throw new Error('Server returned an empty response.');
  }

  let data;
  try { 
    data = JSON.parse(text); 
  } catch { 
    // This try/catch is useful because we are transforming the error
    throw new Error('Server returned invalid JSON.'); 
  }

  if (!res.ok) {
    throw new Error(data?.message || `Server error: ${res.status}`);
  }

  return data;
}; 