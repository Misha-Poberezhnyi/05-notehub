import axios from "axios";
import type { Note, NotesResponse, CreateNotePayload } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!TOKEN) {
  throw new Error("Authorization token required");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  search: string,
  page: number
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };

  if (search.trim()) {
    params.search = search;
  }

  const response = await axiosInstance.get<NotesResponse>("", { params });
  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const payload = {
    title: note.title,
    content: note.content,
    tag: note.tag,
  };

  const response = await axiosInstance.post<Note>("", payload);
  return response.data;
};

export const deleteNote = async (id: number): Promise<Note> => {
  const response = await axiosInstance.delete<Note>(`/${id}`);
  return response.data;
};
