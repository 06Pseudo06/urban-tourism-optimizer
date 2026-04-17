// backend/src/utils/safeFetch.js
const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const text = await response.text().catch(() => '');
    if (!text || !text.trim()) {
      return { ok: response.ok, status: response.status, data: null };
    }
    let data = null;
    try { data = JSON.parse(text); }
    catch { console.warn(`[safeFetch] Invalid JSON from ${url}:`, text.slice(0, 200)); }
    return { ok: response.ok, status: response.status, data };
  } catch (err) {
    console.warn(`[safeFetch] Network error for ${url}:`, err.message);
    return { ok: false, status: 0, data: null };
  }
};
module.exports = { safeFetch }; 