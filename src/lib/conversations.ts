const STORAGE_KEY = "rufus-cases";

export interface Conversation {
  id: string;
  title: string;
  starred: boolean;
  createdAt: number;
  messages: { role: "user" | "assistant"; content: string; file?: string; attachment?: string }[];
}

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function createConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "Nuevo caso",
    starred: false,
    createdAt: Date.now(),
    messages: [],
  };
}

export function deriveTitle(firstMessage: string): string {
  const clean = firstMessage.replace(/\[Archivo adjunto:[^\]]*\]\n*/g, "").trim();
  if (clean.length <= 40) return clean;
  return clean.slice(0, 37) + "...";
}

export function groupConversations(conversations: Conversation[]) {
  const starred = conversations.filter((c) => c.starred);
  const today = conversations.filter((c) => {
    if (c.starred) return false;
    const d = new Date(c.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
  const previous = conversations.filter((c) => {
    if (c.starred) return false;
    const d = new Date(c.createdAt);
    const now = new Date();
    return !(
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
  return { starred, today, previous };
}
