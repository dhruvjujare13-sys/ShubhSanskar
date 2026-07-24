"use client";

export default function ConfirmDeleteForm({
  action,
  hiddenFields,
  confirmMessage,
  label = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Record<string, string>;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button type="submit" className="text-xs font-semibold text-red-600 underline hover:text-red-800">
        {label}
      </button>
    </form>
  );
}
