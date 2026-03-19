const STORAGE_KEY = "rufus-feedback";

type FeedbackValue = "up" | "down";
type FeedbackMap = Record<string, FeedbackValue>;

export function loadFeedback(): FeedbackMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFeedbackItem(key: string, value: FeedbackValue | null) {
  const map = loadFeedback();
  if (value === null) {
    delete map[key];
  } else {
    map[key] = value;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getFeedbackItem(key: string): FeedbackValue | null {
  const map = loadFeedback();
  return map[key] ?? null;
}
