export type Correction = {
  type: string;
  text: string;
};

export async function fetchCorrections(content: string): Promise<Correction[]> {
  try {
    const response = await fetch('/api/ai/corrections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch corrections');
    }
    
    const data = await response.json();
    return data.data.corrections;
  } catch (error) {
    console.error('Error fetching corrections:', error);
    return [];
  }
}