import { v4 as uuidv4 } from 'uuid';
import { usePlatformContext } from 'components/app/PlatformProvider';
import { useTranslation } from 'next-i18next';
import { FormEvent, useEffect, useState } from 'react';
import { CodeSampleApiModel } from 'shared/api/api-types';

import { Select, Tab, Tabs } from 'shared/ui/component-library';
import { CodeBlocks } from 'shared/ui/cms/content';
import {
  getCodeBlocksByPlatform,
  getPlatforms,
  getValueFromName,
  setPlatform,
} from 'shared/ui/cms/content/code/code-utils';

export type CodeSampleProps = {
  codeSample: CodeSampleApiModel;
};

export function CodeSample({ codeSample }: CodeSampleProps) {
  const { t } = useTranslation();
  const { platform, platformFilter } = usePlatformContext();
  const platforms = getPlatforms(codeSample.codeBlocks);
  const codeBlocksByPlatform = getCodeBlocksByPlatform(codeSample.codeBlocks);
  const defaultPlatform = platforms[0].value;

  const [uniqueBlockId, setUniqueBlockId] = useState('');

  useEffect(() => {
    setUniqueBlockId(uuidv4());
  }, []);

  const onChange = (e: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement>) => {
    const platform = (e.target as HTMLSelectElement).value;
    setPlatform(platform);
  };

  return (
    <section role="group" aria-label={t('codeSample.groupLabel')}>
      {Object.entries(codeBlocksByPlatform).map(([codeBlocksPlatform, codeBlocks]) => {
        if (
          platformFilter
            ? platformFilter === codeBlocksPlatform
            : platforms.length > 1 &&
              getValueFromName(codeBlocks[0].programmingLanguage.platform) === (platform || defaultPlatform)
        ) {
          return (
            <div key={codeBlocksPlatform}>
              <CodeBlocks
                codeBlocks={codeBlocks}
                platformSelect={
                  platforms.length > 1 && (
                    <div className="flex mb-4">
                      <Tabs className="hidden md:block" aria-label={t('codeSample.platformLabel')}>
                        {platforms.map(p => (
                          <Tab
                            key={p.value}
                            value={p.value}
                            selected={(platform || defaultPlatform) === p.value}
                            name={`platform-${getValueFromName(p.value)}-${uniqueBlockId}`}
                            onChange={onChange}
                            light>
                            {p.displayName}
                          </Tab>
                        ))}
                      </Tabs>
                      <Select
                        className="md:hidden"
                        id={`platform-${uniqueBlockId}`}
                        accessibilityLabel={t('codeSample.platformLabel')}
                        onChange={onChange}
                        options={platforms}
                        defaultValue={defaultPlatform}
                        selectedValue={platform || defaultPlatform}
                        backgroundClass={'bg-surface'}
                      />
                    </div>
                  )
                }
              />
            </div>
          );
        }
      })}
    </section>
  );
}
