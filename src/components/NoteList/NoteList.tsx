import type { Note } from "../../types/note";
import css from "../NoteList/NoteList.module.css";

interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            {note.tag && <span className={css.tag}>{note.tag}</span>}
            <button
              className={css.button}
              onClick={() => onDelete(note.id)}
              aria-label={`Delete note titled ${note.title}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
