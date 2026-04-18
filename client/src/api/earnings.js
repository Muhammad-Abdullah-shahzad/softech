const EARNINGS_URL = import.meta.env.VITE_EARNINGS_URL || 'http://localhost:5002/api/earnings';

/**
 * API service for worker earnings usando standard Fetch.
 */
export const addEarning = async (data) => {
  try {
    const response = await fetch(EARNINGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to add earning');
    return result;
  } catch (error) {
    console.error('API Error (addEarning):', error.message);
    throw error;
  }
};

export const getEarnings = async (workerId) => {
  try {
    const response = await fetch(`${EARNINGS_URL}?workerId=${workerId}`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to fetch earnings');
    return result;
  } catch (error) {
    console.error('API Error (getEarnings):', error.message);
    throw error;
  }
};
