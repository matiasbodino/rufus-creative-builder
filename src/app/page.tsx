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

    let content = text;
    let attachment: string | undefined;
    if (attachedFile) {
      content = `[Archivo adjunto: ${attachedFile.name}]\n\n${attachedFile.text}${text ? `\n\n${text}` : ""}`;
      attachment = attachedFile.name;
    }

    const userMsg: (typeof messages)[number] = {
      role: "user",
      content,
      attachment,
    };

    const newMessages = [...messages, userMsg];
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      const assistantMsg: (typeof messages)[number] = {
        role: "assistant",
        content: data.message || data.error || "Error desconocido",
        file: data.file,
        files: data.files,
      };

      const updated = [...newMessages, assistantMsg];
      setMessages(updated);

      // Save to conversation
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, messages: updated } : c))
      );
    } catch {
      const errMsg: (typeof messages)[number] = {
        role: "assistant",
        content: "Error al conectar con el servidor. Intentá de nuevo.",
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
