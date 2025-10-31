import { apiClient } from '@/lib/api';

/**
 * Fetch user data by Telegram ID
 * @param {number|string} telegramId
 * @returns {Promise<Object|null>} user data or null if not found
 */
export async function getUserByTelegramId(telegramId) {
  try {
    const res = await apiClient.get(`/users/${telegramId}`);
    // Adjust based on your API response structure
    return res.data?.data ?? null;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}