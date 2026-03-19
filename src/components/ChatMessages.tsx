import { RefObject } from "react";
import EmptyState from "./EmptyState";
import ThinkingIndicator from "./ThinkingIndicator";
import MessageFeedback from "./MessageFeedback";
import QuickActions from "./QuickActions";
import { detectQuickActions } from "@/lib/quick-actions";

interface FileDownload {
  url: string;
  label: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  file?: string;
  files?: FileDownload[];
  attachment?: string;
}

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
  inputRef,
  onSuggestion,
  onQuickAction,
  conversationId,
}: {
  messages: Message[];
  loading: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onSuggestion: (text: string) => void;
  onQuickAction: (text: string) => void;
  conversationId: string | null;
}) {
  // Find the index of the last assistant message
  const lastAssistantIdx = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return i;
    }
    return -1;
  })();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {messages.length === 0 && (
          <EmptyState onSuggestion={onSuggestion} inputRef={inputRef} />
        )}

        {messages.length > 0 && (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === "user" ? (
                  /* User message — right-aligned bubble */
                  <div className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[75%]">
                      {msg.attachment && (
                        <div className="flex items-center gap-2 mb-1.5 justify-end">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] text-xs">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            {msg.attachment}
                          </span>
                        </div>
                      )}
                      <div className="rounded-3xl rounded-br-lg px-4 py-2.5 bg-[var(--user-bubble)] text-[var(--user-bubble-text)]">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {msg.attachment
                            ? (() => {
                                const parts = msg.content.split(`[Archivo adjunto: ${msg.attachment}]`);
                                if (parts.length > 1) {
                                  const fileAndUserText = parts[1];
                                  const lastDoubleNewline = fileAndUserText.lastIndexOf("\n\n");
                                  if (lastDoubleNewline > 0) {
                                    const userText = fileAndUserText.slice(lastDoubleNewline + 2).trim();
                                    return userText || "📎 Archivo adjunto enviado";
                                  }
                                }
                                return "📎 Archivo adjunto enviado";
                              })()
                            : msg.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Assistant message — left-aligned, flat (Claude-style) */
                  <div className="flex justify-start">
                    <div className="max-w-[90%] sm:max-w-[85%]">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center mt-0.5">
                          <span className="text-white font-bold text-[10px]">R</span>
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <div className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] leading-relaxed">
                            {msg.content}
                          </div>

                          {/* Multiple files */}
                          {msg.files && msg.files.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.files.map((f, fi) => (
                                <a
                                  key={fi}
                                  href={f.url}
                                  download
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                  </svg>
                                  {f.label}
                                </a>
                              ))}
                            </div>
                          ) : msg.file ? (
                            <a
                              href={msg.file}
                              download
                              className="inline-flex items-center gap-2 mt-3 px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              Descargar caso (.pptx)
                            </a>
                          ) : null}

                          {/* Quick actions — only on last assistant message, not loading */}
                          {i === lastAssistantIdx && !loading && (
                            <QuickActions
                              actions={detectQuickActions(msg.content)}
                              onAction={onQuickAction}
                            />
                          )}

                          {/* Feedback */}
                          {conversationId && (
                            <MessageFeedback messageKey={`${conversationId}-${i}`} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {loading && <ThinkingIndicator messages={messages} />}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
