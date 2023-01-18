import { CodeBlockApiModel, CodeSampleApiModel, ProgrammingLanguageApiModel } from '../api-types';
import { ICodeBlock, ICodeSample, IPlatform, IProgrammingLanguage } from './contentful-types';
import { Block, Document, Inline, Text } from '@contentful/rich-text-types';
import { mapRichText, omitUndefined } from './contentful-mapper';

interface NestedArray extends Array<NestedArray | string> {}

type StringOrArray = string | NestedArray;

export async function mapCodeSample({ fields }: ICodeSample): Promise<CodeSampleApiModel> {
  return {
    codeBlocks: await Promise.all(fields.codeBlocks.map(codeBlock => mapCodeBlock(codeBlock))),
  };
}

async function mapCodeBlock({ fields }: ICodeBlock): Promise<CodeBlockApiModel> {
  return omitUndefined({
    name: fields.name,
    text: fields.text ? await mapRichText(fields.text) : undefined,
    code: mapCode(fields.code),
    programmingLanguage: mapProgrammingLanguage(fields.programmingLanguage),
    docsUrl: fields.docsUrl,
  });
}

function mapCode(text: Document): string {
  return text.content
    .map(contentItem => contentItem.content.map(node => mapCodeTextNode(node)))
    .flat(Infinity)
    .join('\n\n');
}

function mapCodeTextNode(node: Block | Inline | Text): StringOrArray {
  let codeStringOrArray: StringOrArray = '';

  if ('content' in node) {
    codeStringOrArray = node.content.map(node => mapCodeTextNode(node));
  } else if (node.nodeType === 'text') {
    codeStringOrArray = node.value;
  }

  return codeStringOrArray;
}

function mapProgrammingLanguage({ fields }: IProgrammingLanguage): ProgrammingLanguageApiModel {
  return omitUndefined({
    name: fields.name,
    platform: mapPlatform(fields.platform),
    prismLanguage: fields.prismLanguage,
    version: fields.version,
  });
}

export function mapPlatform({ fields }: IPlatform): string {
  return fields.name;
}
