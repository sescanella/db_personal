interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No se encontraron empleados' }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <p>{message}</p>
    </div>
  );
}