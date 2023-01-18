import _sortBy from 'lodash/sortBy';
import _groupBy from 'lodash/groupBy';
import { CodeBlockApiModel, ProgrammingLanguageApiModel } from 'shared/api/api-types';
import { LocalStorageKey, setLocalStorageItem } from 'shared/utils/local-storage';

export const getProgrammingLanguageName = (programmingLanguage: ProgrammingLanguageApiModel) => {
  return programmingLanguage.name + (programmingLanguage.version ? ` ${programmingLanguage.version}` : '');
};

export const getValueFromName = (name: string) => {
  return name.split(' ').join('-').toLowerCase();
};

export const setPlatform = (platform: string) => {
  setLocalStorageItem(LocalStorageKey.Platform, platform);
};

export const setProgrammingLanguage = (language: string) => {
  setLocalStorageItem(LocalStorageKey.ProgrammingLanguage, language);
};

export const getPlatforms = (codeBlocks: CodeBlockApiModel[]) => {
  const platformStrings = Array.from(new Set(codeBlocks.map(codeBlock => codeBlock.programmingLanguage.platform)));
  return _sortBy(
    platformStrings.map(platformString => {
      return { value: getValueFromName(platformString), displayName: platformString };
    }),
  );
};

export const getProgrammingLanguages = (codeBlocks: CodeBlockApiModel[]) => {
  return _sortBy(
    codeBlocks.map(codeBlock => {
      const languageName = getProgrammingLanguageName(codeBlock.programmingLanguage);
      return {
        value: getValueFromName(languageName),
        displayName: languageName,
        platform: getValueFromName(codeBlock.programmingLanguage.platform),
      };
    }),
    'displayName',
  );
};

export const getCodeBlocksByPlatform = (codeBlocks: CodeBlockApiModel[]): Record<string, CodeBlockApiModel[]> => {
  return _groupBy(codeBlocks, codeBlock => codeBlock.programmingLanguage.platform);
};
