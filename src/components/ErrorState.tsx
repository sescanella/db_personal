interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="error-state">
      <p>Error: {error}</p>
    </div>
  );
}