"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import {
  Conversation,
  loadConversations,
  saveConversations,
  createConversation,
  deriveTitle,
} from "@/lib/conversations";
import { loadTheme, saveTheme } from "@/lib/theme";

interface AttachedFile {
  name: string;
  text: string;
}

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string; file?: string; files?: { url: string; label: string }[]; attachment?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load on mount
  useEffect(() => {
    const t = loadTheme();
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
    setConversations(loadConversations());
  }, []);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persist conversations
  useEffect(() => {
    if (conversations.length > 0) saveConversations(conversations);
  }, [conversations]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  function selectConversation(id: string) {
    // Save current
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
      );
    }
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveId(id);
      setMessages(conv.messages);
    }
    setSidebarOpen(false);
  }

  function newConversation() {
    // Save current
    if (activeId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeId ? { ...c, messages } : c))
      );
    }
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setMessages([]);
    setAttachedFile(null);
    setSidebarOpen(false);
    inputRef.current?.focus();
  }

  function toggleStar(id: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, starred: !c.starred } : c))
    );
  }

  function renameConversation(id: string, title: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }

  function deleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) {
        console.error("Upload error:", data.error);
        // Show inline error instead of alert popup
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant" as const,
            content: `⚠️ Error al subir archivo: ${data.error}`,
          },
        ]);
      } else {
        setAttachedFile({ name: data.filename, text: data.text });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "⚠️ Error subiendo el archivo. Intentá con otro formato (PDF, DOCX, TXT, CSV).",
        },
      ]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text && !attachedFile) return;

    // Separate display content from API content
    let displayContent = text || "📎 Archivo adjunto enviado";
    let apiContent = text;
    let attachment: string | undefined;
    if (attachedFile) {
      apiContent = `[Archivo adjunto: ${attachedFile.name}]\n\n${attachedFile.text}${text ? `\n\n${text}` : ""}`;
      attachment = attachedFile.name;
    }

    const userMsg: (typeof messages)[number] = {
      role: "user",
      content: displayContent,
      attachment,
    };

    // For API, we need the full content with file text
    const apiMsg = { role: "user" as const, content: apiContent };

    const newMessages = [...messages, userMsg];
    const apiMessages = [...messages, apiMsg];
    setMessages(newMessages);
    setInput("");
    setAttachedFile(null);
    setLoading(true);

    // Ensure conversation exists
    let convId = activeId;
    if (!convId) {
      const conv = createConversation();
      conv.title = deriveTitle(text || attachedFile?.name || "Nuevo caso");
      convId = conv.id;
      setConversations((prev) => [conv, ...prev]);
      setActiveId(convId);
    } else if (newMessages.length === 1) {
      // First message — update title
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? { ...c, title: deriveTitle(text || attachedFile?.name || "Nuevo caso") }
            : c
        )
      );
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        const assistantMsg: (typeof messages)[number] = {
          role: "assistant",
          content: `Error del servidor (${res.status}). ${errorText.includes("message") ? JSON.parse(errorText).error || errorText : "Intentá de nuevo."}`,
        };
        const updated = [...newMessages, assistantMsg];
        setMessages(updated);
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, messages: updated } : c))
        );
        return;
      }

      const data = await res.json();

      // Convert base64 files to blob URLs for download
      let downloadFiles: { url: string; label: string }[] | undefined;
      if (data.files && data.files.length > 0) {
        downloadFiles = data.files.map((f: { base64?: string; filename: string; label: string; mimeType?: string; url?: string }) => {
          if (f.base64) {
            // New base64 format — create blob URL
            const bytes = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
            const blob = new Blob([bytes], { type: f.mimeType || "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            // Trigger download
            const a = document.createElement("a");
            a.href = url;
            a.download = f.filename;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return { url, label: f.label };
          }
          // Legacy format (url string)
          return { url: f.url || "", label: f.label };
        });
      }

      const assistantMsg: (typeof messages)[number] = {
        role: "assistant",
        content: data.message || data.error || "Error desconocido",
        files: downloadFiles,
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);

      // Save to conversation
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: updated } : c))
      );
    } catch (err) {
      console.error("Fetch error:", err);
      const errorDetail = err instanceof Error ? err.message : "Error desconocido";
      const errMsg: (typeof messages)[number] = {
        role: "assistant",
        content: `Error al conectar: ${errorDetail}. Intentá de nuevo.`,
      };
      setMessages([...newMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex h-screen bg-[var(--bg-primary)]"
      data-theme={theme}
    >
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={newConversation}
        onToggleStar={toggleStar}
        onRename={renameConversation}
        onDelete={deleteConversation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <ChatMessages
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
          inputRef={inputRef}
          onSuggestion={(text) => setInput(text)}
          onQuickAction={(text) => {
            setInput(text);
            // Auto-submit after a tick so the input state updates
            setTimeout(() => {
              const form = document.querySelector("form");
              if (form) form.requestSubmit();
            }, 50);
          }}
          conversationId={activeId}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          loading={loading}
          uploading={uploading}
          attachedFile={attachedFile}
          setAttachedFile={setAttachedFile}
          inputRef={inputRef}
          fileInputRef={fileInputRef}
          onSubmit={handleSubmit}
          onFileUpload={handleFileUpload}
        />
      </main>
    </div>
  );
}
