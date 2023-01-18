import { TextBlockApiModel } from 'shared/api/api-types';
import { Card } from 'shared/ui/component-library';
import { CFLink, RichText } from 'shared/ui/cms/content';
import { useRoute } from 'shared/useRoute';

export type TextBlockProps = {
  block: TextBlockApiModel;
};

export function TextBlock({ block }: TextBlockProps) {
  const { path } = useRoute();

  const TextBlockWrapper = block.showBackgroundColor ? Card : 'div';

  return (
    <TextBlockWrapper className="w-full flex-1 flex flex-col justify-between">
      <RichText text={block.text} noTopMargin noBottomMargin />
      {block.link && path !== block.link.page?.url && (
        <div className="flex justify-end mt-4">
          <CFLink link={block.link} />
        </div>
      )}
    </TextBlockWrapper>
  );
}
