export interface Note {
  id: number;
  title: string;
  text: string;
  tag?: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) throw new Error('Authorization token required');

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
};

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<NotesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append('search', search);

  const res = await fetch(`${API_URL}?${params.toString()}`, { headers });

  if (!res.ok) {
    throw new Error('Failed to fetch notes');
  }

  return res.json();
};

export const createNote = async (note: {
  title: string;
  text: string;
  tag: string;
}) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    throw new Error('Failed to create note');
  }

  return res.json();
};

export const deleteNote = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    throw new Error('Failed to delete note');
  }

  return true;
};
