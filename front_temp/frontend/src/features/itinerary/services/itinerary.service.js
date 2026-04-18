import { safeApiFetch } from '@/config/api';

const toISO = (dateStr) => {
  if (!dateStr || !dateStr.includes('/')) return dateStr;
  const [d, m, y] = dateStr.split('/');
  return `20${y}-${m}-${d}`;
};

export const generateItinerary = async (formData) => {
  const cleanData = Object.fromEntries(
    Object.entries(formData).filter((entry) => entry[1] != null && entry[1] !== '')
  );

  if (cleanData.start_date) cleanData.start_date = toISO(cleanData.start_date);
  if (cleanData.end_date) cleanData.end_date = toISO(cleanData.end_date);

  const data = await safeApiFetch('/api/itinerary/generate-itinerary', {
    method: 'POST',
    body: JSON.stringify(cleanData),
  });

  if (!data?.success || !data?.data) {
    throw new Error(data?.message || 'Failed to generate itinerary');
  }

  return data.data;
};
