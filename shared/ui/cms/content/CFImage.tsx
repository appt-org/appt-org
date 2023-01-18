import Image, { ImageProps } from 'next/future/image';
import { ImageApiModel } from 'shared/api/api-types';
import { useTheme } from 'next-themes';

export type CFImageProps = {
  image: ImageApiModel;
} & Omit<ImageProps, 'src' | 'alt'>;

function formatImageUrl(url: string) {
  return `https:${url}`;
}

export function CFImage({ image, width, height, ...props }: CFImageProps) {
  const { resolvedTheme } = useTheme();
  const { lightAsset, darkAsset } = image;

  const asset = resolvedTheme === 'dark' && darkAsset ? darkAsset : lightAsset;

  return (
    <Image
      src={formatImageUrl(asset.url)}
      width={width ?? asset.width}
      height={height ?? asset.height}
      alt={asset.alt}
      {...props}
    />
  );
}
