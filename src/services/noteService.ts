import axios from "axios";
import type { Note, NotesResponse, CreateNotePayload } from "../types/note";

const API_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

console.log("Loaded NoteHub token:", TOKEN);

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
  page: number,
  perPage: number,
  search?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };
  if (search) params.search = search;

  const response = await axiosInstance.get("", { params });
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

export const deleteNote = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/${id}`);
};
