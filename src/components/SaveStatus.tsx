type SaveStatusProps = Readonly<{
  isSaving?: boolean;
  hasError?: boolean;
  isSaved?: boolean;
}>;

export default function SaveStatus({ isSaving = false, hasError = false, isSaved = false }: SaveStatusProps) {
  let statusText = '';
  let bgColor = '';
  
  if (isSaving) {
    statusText = 'Saving...';
    bgColor = 'bg-yellow-500';
  } else if (hasError) {
    statusText = 'Save failed';
    bgColor = 'bg-red-500';
  } else if (isSaved) {
    statusText = 'Saved';
    bgColor = 'bg-emerald-500';
  } else {
    statusText = 'Unsaved';
    bgColor = 'bg-red-500';
  }
  
  return (
    <div className="flex items-center gap-2">
      <span
        aria-label={statusText}
        title={statusText}
        className={`inline-block h-3 w-3 rounded-full ${bgColor} ${
          isSaving ? 'animate-pulse' : ''
        }`}
      />
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        {statusText}
      </span>
    </div>
  );
}