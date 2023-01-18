export type ContentNavigationItemTitleProps = {
  title?: string;
  titlePrefix?: string;
};

export function ContentNavigationItemTitle({ title, titlePrefix }: ContentNavigationItemTitleProps) {
  return (
    <span className="flex">
      {titlePrefix && <span className="mr-4">{titlePrefix}</span>}
      <span>{title}</span>
    </span>
  );
}
