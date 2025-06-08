import css from "./QueryStatus.module.css";

interface QueryStatusProps {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export default function QueryStatus({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = 'No notes found',
}: QueryStatusProps) {
  if (isLoading) {
    return <div className={css.loader}>Loading...</div>;
  }

  if (isError) {
    const message =
      error instanceof Error
        ? error.message
        : 'An error occurred while fetching data';
    return <div className={css.error}>{message}</div>;
  }

  if (isEmpty) {
    return <div className={css.empty}>{emptyMessage}</div>;
  }

  return null;
}
