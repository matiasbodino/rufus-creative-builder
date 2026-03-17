"use client";

import { FormEvent, RefObject } from "react";

interface AttachedFile {
  name: string;
  text: string;
}

export default function ChatInput({
  input,
  setInput,
  loading,
  uploading,
  attachedFile,
  setAttachedFile,
  inputRef,
  fileInputRef,
  onSubmit,
  onFileUpload,
}: {
  input: string;
  setInput: (v: string) => void;
  loading: boolean;
  uploading: boolean;
  attachedFile: AttachedFile | null;
  setAttachedFile: (f: AttachedFile | null) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onSubmit: (e: FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <div className="flex-shrink-0 pb-4 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Attached file badge */}
        {attachedFile && (
          <div className="mb-2 flex items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-[var(--text-secondary)] truncate max-w-[200px] sm:max-w-[300px]">
                {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors ml-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          </div>
        )}

        {/* Input container — pill shape like Claude */}
        <div className="relative rounded-3xl bg-[var(--bg-input)] border border-[var(--border)] focus-within:border-[var(--accent-border)] transition-colors shadow-sm">
          <form onSubmit={onSubmit} className="flex items-end">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.csv,.md"
              onChange={onFileUpload}
              className="hidden"
            />

            {/* Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
              className="flex-shrink-0 p-3 pl-4 text-[var(--text-faint)] hover:text-[var(--text-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors self-end"
              title="Adjuntar archivo"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                </svg>
              )}
            </button>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                attachedFile
                  ? "Instrucciones adicionales..."
                  : "Contale a Rufus sobre tu caso..."
              }
              rows={1}
              className="flex-1 min-w-0 bg-transparent py-3.5 text-[var(--text-primary)] text-sm placeholder-[var(--text-placeholder)] focus:outline-none resize-none leading-relaxed"
              style={{ maxHeight: "160px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
              }}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={loading || (!input.trim() && !attachedFile)}
              className="flex-shrink-0 p-3 pr-4 self-end transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                input.trim() || attachedFile
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-surface)] text-[var(--text-faint)]"
              }`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </div>
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="text-center text-[var(--text-faint)] text-[10px] mt-2.5 px-4">
          Rufus Creative Builder genera estrategias basadas en la metodología de Rufus Social
        </p>
      </div>
    </div>
  );
}
