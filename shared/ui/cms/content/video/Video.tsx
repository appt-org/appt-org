import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import classNames from 'classnames';

import { VideoApiModel } from 'shared/api/api-types';
import { CFImage } from 'shared/ui/cms/content';
import { PlayIcon } from 'icons/index';
import { Spinner } from 'shared/ui/component-library';
import dynamic from 'next/dynamic';

const YoutubeVideo = dynamic(() => import('shared/ui/cms/content/video/YoutubeVideo'));

export type VideoProps = {
  className?: string;
  video: VideoApiModel;
};

export function Video({ className, video }: VideoProps) {
  const youtubeThumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
  const fallbackYoutubeThumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;

  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState(youtubeThumbnailUrl);

  const wrapperClasses = classNames('pb-[56.25%] relative w-full', className);
  const videoClasses = classNames('absolute left-0 top-0 w-full h-full');
  const videoLoaderClasses = classNames('bg-surface', videoClasses);

  const playButtonAriaLabel = video.thumbnail
    ? `${t('video.playWithThumbnail', {
        title: video.title,
        thumbnail: video.thumbnail.lightAsset.alt,
      })}`
    : `${t('video.play', { title: video.title })}`;

  async function onReady() {
    setLoading(false);
  }

  return (
    <div className={wrapperClasses}>
      {playing && <YoutubeVideo className={videoClasses} video={video} onReady={onReady} />}
      {loading && (
        <div className={videoLoaderClasses}>
          <div className="relative w-full h-full">
            {video.thumbnail ? (
              <CFImage image={video.thumbnail} className="object-cover w-full" />
            ) : (
              <Image
                src={thumbnailUrl}
                alt={video.title}
                layout="fill"
                objectFit="cover"
                unoptimized
                onLoadingComplete={result => {
                  // Youtube's maxresdefault.jpg thumbnails might not exist because it depends on the upload source of the video itself.
                  // It does return a 404, but also a small fallback thumbnail 120x90, which kind of ruins our way to easily catch the error
                  // to show a fallback thumbnail of hqdefault.jpg (which should always exist). We can however check the natural width and use that
                  // to determine if a fallback must be showed
                  result.naturalWidth <= 120 && setThumbnailUrl(fallbackYoutubeThumbnailUrl);
                }}
              />
            )}
          </div>
          <button
            className="flex items-center justify-center absolute top-0 left-0 w-full h-full group"
            onClick={() => setPlaying(true)}
            aria-label={playButtonAriaLabel}>
            <span className="rounded-full flex items-center justify-center text-white transition-colors duration-300 ease-out-quint w-16 h-16 bg-dark-overlay backdrop-blur-sm group-hover:bg-accent md:w-24 md:h-24">
              {!playing ? (
                <PlayIcon className="w-10 h-10 md:w-16 md:h-16" />
              ) : (
                <Spinner className="md:w-10 md:h-10" loadingText={t('video.loading')} />
              )}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
