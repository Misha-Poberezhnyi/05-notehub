export interface Note {
  id: number;
  title: string;
  content: string;
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

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(`${API_URL}?${params.toString()}`, { headers });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Fetch notes error:", res.status, errorText);
    throw new Error(`Failed to fetch notes: ${res.status}`);
  }

  return res.json();
};

export const createNote = async (note: {
  title: string;
  content: string;
  tag: string;
}) => {
  console.log("Creating note with data:", note);

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(note),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create note error:", res.status, errorText);
    throw new Error(`Failed to create note: ${res.status} - ${errorText}`);
  }

  const data = await res.json();
  console.log("Note successfully created:", data);
  return data;
};

export const deleteNote = async (id: number) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete note error:", res.status, errorText);
    throw new Error(`Failed to delete note: ${res.status} - ${errorText}`);
  }

  console.log("Note successfully deleted:", id);
  return true;
};
