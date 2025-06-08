import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import toast, { Toaster } from "react-hot-toast";

import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import QueryStatus from "../QueryStatus/QueryStatus";

import { fetchNotes, createNote, deleteNote } from "../service/notehub";
import type { NoteFormValues } from "../NoteForm/NoteForm";

const PER_PAGE = 12;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => fetchNotes(currentPage, PER_PAGE, debouncedSearch),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully");
      setIsModalOpen(false);
      setSearchTerm("");
      setCurrentPage(1);
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to create note";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to delete note";
      toast.error(message);
    },
  });

  const handleCreateNote = (values: NoteFormValues) => {
    const payload = {
      title: values.title.trim(),
      content: values.content.trim(), 
      tag: values.tag,
    };
    console.log("Submitting note:", payload);
    createMutation.mutate(payload);
  };

  const handleDeleteNote = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
        <SearchBox value={searchTerm} onChange={setSearchTerm} />
      </header>

      <QueryStatus
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && notes.length === 0}
        emptyMessage="No notes found"
      />

      {notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={handleCreateNote}
          />
        </NoteModal>
      )}
    </div>
  );
}
