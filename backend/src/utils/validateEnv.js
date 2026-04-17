// backend/src/utils/validateEnv.js
const validateEnv = () => {
  const RECOMMENDED = ['GEOAPIFY_API_KEY', 'GOOGLE_MAPS_API_KEY', 'OPENWEATHER_API_KEY', 'MONGODB_URI'];
  const warned = RECOMMENDED.filter(k => !process.env[k]);
  if (warned.length) {
    console.warn(`[ENV] Missing recommended env vars — some features disabled:\n  ${warned.join('\n  ')}`);
  }
};
module.exports = { validateEnv };