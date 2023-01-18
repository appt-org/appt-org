import { FormEvent, ReactNode, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';

import { Select, Link, Button, Tabs, Tab } from 'shared/ui/component-library';
import { RichText } from 'shared/ui/cms/content';
import { usePlatformContext } from 'components/app/PlatformProvider';
import { CodeBlockApiModel } from 'shared/api/api-types';
import { getProgrammingLanguages, getValueFromName, setProgrammingLanguage } from './code-utils';
import { ExternalIcon, CopyIcon, CheckIcon } from 'icons';

const CodeBlock = dynamic(() => import('./CodeBlock'));

type CodeBlocksProps = {
  codeBlocks: CodeBlockApiModel[];
  platformSelect?: ReactNode;
};

export function CodeBlocks({ codeBlocks, platformSelect }: CodeBlocksProps) {
  const { t } = useTranslation();
  const { programmingLanguage, platformFilter } = usePlatformContext();
  const programmingLanguages = getProgrammingLanguages(codeBlocks);
  const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState(programmingLanguages[0].value);
  const [uniqueBlockId, setUniqueBlockId] = useState('');
  const [codeCopied, setCodeCopied] = useState(false);

  const selectedCodeBlock = codeBlocks.find(
    block => getValueFromName(block.programmingLanguage.name) === selectedProgrammingLanguage,
  );

  useEffect(() => {
    setUniqueBlockId(uuidv4());
  }, []);

  useEffect(() => {
    const newSelectedLanguage = programmingLanguages.find(language => language.value === programmingLanguage);
    if (!!newSelectedLanguage) {
      setSelectedProgrammingLanguage(newSelectedLanguage?.value);
    }
  }, [programmingLanguages, programmingLanguage]);

  const onChange = (e: FormEvent<HTMLSelectElement> | FormEvent<HTMLInputElement>) => {
    const programmingLanguage = (e.target as HTMLSelectElement).value;
    setProgrammingLanguage(programmingLanguage);
  };

  const copyCode = async () => {
    if (selectedCodeBlock) {
      await navigator.clipboard.writeText(selectedCodeBlock.code);
      setCodeCopied(true);

      setTimeout(() => setCodeCopied(false), 5000);
    }
  };

  const renderProgrammingLanguages = () => {
    const ariaLabel = t('codeSample.programmingLanguageLabel');

    return (
      <>
        <Tabs className="hidden md:block" aria-label={ariaLabel}>
          {programmingLanguages.map((language, index) => (
            <Tab
              key={language.value + index}
              value={language.value}
              selected={selectedProgrammingLanguage === language.value}
              name={`programmingLanguage-${getValueFromName(language.platform)}-${uniqueBlockId}`}
              onChange={onChange}>
              {language.displayName}
            </Tab>
          ))}
        </Tabs>
        <Select
          className="md:hidden"
          id={`programming-language-${uniqueBlockId}`}
          accessibilityLabel={ariaLabel}
          onChange={onChange}
          options={programmingLanguages}
          defaultValue={programmingLanguages[0].value}
          selectedValue={selectedProgrammingLanguage ? selectedProgrammingLanguage : undefined}
          backgroundClass={'bg-onsurface'}
        />
      </>
    );
  };

  return (
    <div className="flex flex-col">
      {!platformFilter && platformSelect}
      {selectedCodeBlock?.text && <RichText text={selectedCodeBlock.text} />}
      <div className="bg-surface shadow-code rounded-2xl p-4 relative group">
        {renderProgrammingLanguages()}
        {codeBlocks.map((codeBlock, index) => {
          if (getValueFromName(codeBlock.programmingLanguage.name) !== selectedProgrammingLanguage) {
            return undefined;
          }

          return (
            <div key={codeBlock.programmingLanguage.name + index}>
              <CodeBlock block={codeBlock} />
            </div>
          );
        })}
        <div className="flex absolute top-0 right-0 p-4 opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 out-quint">
          {selectedCodeBlock?.docsUrl && (
            <Link
              className="mr-2"
              href={selectedCodeBlock.docsUrl}
              title={t('codeSample.contributeUrlLabel', { name: selectedCodeBlock.name })}
              icon={<ExternalIcon aria-label={t('externalLinkLabel')} className="w-8 h-8" />}>
              <span className="sr-only md:not-sr-only">{t('codeSample.contributeUrlTitle')}</span>
            </Link>
          )}
          <Button
            size="small"
            className="text-accent inline-flex items-center md:pr-3"
            title={t(codeCopied ? 'codeSample.copiedLabel' : 'codeSample.copyLabel', { name: selectedCodeBlock?.name })}
            onClick={copyCode}
            iconLeft={codeCopied ? <CheckIcon /> : <CopyIcon />}>
            <span className="sr-only md:not-sr-only">{codeCopied ? t('codeSample.copied') : t('codeSample.copy')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
