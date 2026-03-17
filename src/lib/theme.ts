const KEY = "rufus-theme";

export function loadTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function saveTheme(theme: "dark" | "light") {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, theme);
}
