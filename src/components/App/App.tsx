import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";

import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import SearchBox from "../SearchBox/SearchBox";
import QueryStatus from "../QueryStatus/QueryStatus";

import type { NotesResponse } from "../../types/note"
import { fetchNotes } from "../../services/noteService";


type SetSearchTerm = React.Dispatch<React.SetStateAction<string>>;
type SetCurrentPage = React.Dispatch<React.SetStateAction<number>>;

function handleSearchChange(setSearchTerm: SetSearchTerm, setCurrentPage: SetCurrentPage, value: string) {
  setSearchTerm(value);
  setCurrentPage(1);
}

function handlePageChange(setCurrentPage: SetCurrentPage, selected: number) {
  setCurrentPage(selected + 1);
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isFetching } = useQuery<NotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, currentPage],
    queryFn: () => fetchNotes(debouncedSearch, currentPage),
    keepPreviousData: true,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <Toaster position="top-right" />
      <header className={css.toolbar}>
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
        <SearchBox
          value={searchTerm}
          onChange={(value) => handleSearchChange(setSearchTerm, setCurrentPage, value)}
        />
        {isFetching && !isLoading && <span className={css.spinner} />}
      </header>

      <QueryStatus
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!isLoading && !isError && notes.length === 0}
        emptyMessage="No notes found"
      />

      {notes.length > 0 && <NoteList notes={notes} />}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={({ selected }) => handlePageChange(setCurrentPage, selected)}
        />
      )}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
