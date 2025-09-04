export async function submitLead(payload) {
  const endpoint = '/api/leads';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Network ${res.status}`);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // Apps Script sometimes returns text; treat non-error as success
    return { result: 'success' };
  }
  return data;
}
