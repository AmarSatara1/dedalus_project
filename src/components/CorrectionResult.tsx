export type Correction = {
  type: string;
  text: string;
};

type CorrectionResultProps = Readonly<{
  correction: Correction;
  onApply: () => void;
  disabled?: boolean;
}>;

export default function CorrectionResult({
  correction,
  onApply,
  disabled = false,
}: CorrectionResultProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {correction.type}
      </p>
      <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {correction.text}
      </p>
      <button
        type="button"
        onClick={onApply}
        disabled={disabled}
        className={`mt-3 rounded px-3 py-1 text-xs font-medium text-white ${
          disabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Apply
      </button>
    </div>
  );
}