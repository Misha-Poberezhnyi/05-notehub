import React from 'react';
import type { Note } from '../../types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  const handleDelete = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <ul className={css.list}>
      {notes.map(({ id, title, content, tag }) => (
        <li key={id} className={css.listItem}>
          <h2 className={css.title}>{title}</h2>
          <p className={css.content}>{content}</p>
          <div className={css.footer}>
            {tag && <span className={css.tag}>{tag}</span>}
            <button
              className={css.button}
              onClick={(e) => handleDelete(id, e)}
              aria-label={`Delete note titled ${title}`}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
