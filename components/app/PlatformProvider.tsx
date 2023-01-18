import { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import {
  ApptStorageUpdateEvent,
  APPT_STORAGE_UPDATE,
  getLocalStorageItem,
  LocalStorageKey,
} from 'shared/utils/local-storage';

interface IPlatformContext {
  platform?: string;
  platformFilter?: string;
  programmingLanguage?: string;
}

type PlatformProviderProps = {
  platformFilter?: string;
};

const PlatformContext = createContext<IPlatformContext>({});

export function usePlatformContext() {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error('Platform context is not found');
  }

  return context;
}

export function PlatformProvider({ platformFilter, children }: PropsWithChildren<PlatformProviderProps>) {
  const [platform, setPlatform] = useState<string | undefined>(undefined);
  const [programmingLanguage, setProgrammingLanguage] = useState<string | undefined>(undefined);

  useEffect(() => {
    function getPlatformFromStorage() {
      const newPlatform = getLocalStorageItem<string>(LocalStorageKey.Platform);
      !!newPlatform && setPlatform(newPlatform);
    }

    function getProgrammingLanguageFromStorage() {
      const newProgrammingLanguage = getLocalStorageItem<string>(LocalStorageKey.ProgrammingLanguage);
      !!newProgrammingLanguage && setProgrammingLanguage(newProgrammingLanguage);
    }

    function updateDataFromStorage(event: Event | CustomEvent) {
      if ('detail' in event) {
        const eventDetail = event.detail as ApptStorageUpdateEvent;

        if (eventDetail.key === LocalStorageKey.Platform) {
          getPlatformFromStorage();
        }

        if (eventDetail.key === LocalStorageKey.ProgrammingLanguage) {
          getProgrammingLanguageFromStorage();
        }
      }
    }

    getPlatformFromStorage();
    getProgrammingLanguageFromStorage();

    window.addEventListener(APPT_STORAGE_UPDATE, updateDataFromStorage);

    return () => {
      window.removeEventListener(APPT_STORAGE_UPDATE, updateDataFromStorage);
    };
  }, []);
  return (
    <PlatformContext.Provider value={{ platform, platformFilter, programmingLanguage }}>
      {children}
    </PlatformContext.Provider>
  );
}
