import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { LinkApiModel } from 'shared/api/api-types';
import { CFImage, CFLink } from 'shared/ui/cms/content';

export type AuthorsProps = {
  authors: LinkApiModel[];
};

export function Authors({ authors }: AuthorsProps) {
  const { t } = useTranslation();

  const AuthorImage = ({ author, index }: { author: LinkApiModel; index: number }) => {
    const authorImageClasses = classNames(
      'block w-12 h-12 justify-center items-center border-2 border-background rounded-full overflow-hidden relative',
      { '-ml-2': index > 0 },
    );

    return (
      <>
        {author.image && (
          <div className={authorImageClasses} key={author.title + index}>
            <CFImage className="object-cover h-full" image={author.image} width={48} height={48} sizes="3rem" />
          </div>
        )}
      </>
    );
  };

  const AuthorNameLink = ({ author, index }: { author: LinkApiModel; index: number }) => {
    const showComma = authors.length > 1 && index < authors.length - 1;
    return (
      <>
        <CFLink link={author} showAsLink /> {showComma && <p className="mr-1">,</p>}
      </>
    );
  };

  return (
    <>
      <div className="flex items-center flex-wrap">
        {authors.map((author, index) => (
          <AuthorImage key={author.title + index} author={author} index={index} />
        ))}
        <div className="p-2 flex items-center flex-wrap">
          <p className="mr-1">{t('authorsBy')}</p>
          {authors.map((author, index) => (
            <AuthorNameLink author={author} index={index} key={author.title + index} />
          ))}
        </div>
      </div>
    </>
  );
}
