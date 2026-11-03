export function getLocalStorage<T>(key: string, def: T): T {
  return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(def));
}

export function setLocalStorage(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}
