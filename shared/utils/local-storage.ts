export enum LocalStorageKey {
  DarkMode = 'appt:dark_mode',
  Platform = 'appt:platform',
  ProgrammingLanguage = 'appt:programming-language',
}
export const APPT_STORAGE_UPDATE = 'appt-storage-update';
export type ApptStorageUpdateEvent = {
  key: LocalStorageKey;
};

export function getLocalStorageItem<T>(key: LocalStorageKey): T | undefined {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return;
    }

    return JSON.parse(value) as T;
  } catch (e) {
    console.error(`Failed to get local storage data with key '${key}'`, e);
  }
}

export function setLocalStorageItem(key: LocalStorageKey, value: unknown) {
  try {
    const event = new CustomEvent<ApptStorageUpdateEvent>(APPT_STORAGE_UPDATE, { detail: { key } });
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(event);
  } catch (e) {
    console.error(`Failed to set local storage data with key '${key}' and value: ${value}`, e);
  }
}
