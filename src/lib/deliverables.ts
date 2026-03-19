const STORAGE_KEY = "rufus-deliverables";

export interface DeliverableRecord {
  id: string;
  filename: string;
  label: string;
  conversationId: string;
  conversationTitle: string;
  createdAt: string; // ISO
}

export function loadDeliverables(): DeliverableRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDeliverable(record: DeliverableRecord) {
  const list = loadDeliverables();
  list.unshift(record); // newest first
  // Keep max 100
  if (list.length > 100) list.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
