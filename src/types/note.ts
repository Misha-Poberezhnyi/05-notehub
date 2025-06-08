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