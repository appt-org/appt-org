import { useRouter } from 'next/router';
import YouTube, { YouTubeEvent } from 'react-youtube';

import { VideoApiModel } from 'shared/api/api-types';

export type YoutubeVideoProps = {
  className?: string;
  video: VideoApiModel;
  onReady?: () => void;
};

export default function YoutubeVideo({ className, video, onReady }: YoutubeVideoProps) {
  const router = useRouter();

  async function handleReady(e: YouTubeEvent) {
    onReady?.();
    const iframeEl = await e.target.getIframe();
    iframeEl.focus();
  }

  return (
    <YouTube
      className={className}
      iframeClassName="w-full h-full"
      videoId={video.videoId}
      title={video.title}
      onReady={handleReady}
      opts={{
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          disablekb: 1,
          cc_lang_pref: router.locale,
          hl: router.locale,
          rel: 0,
          modestbranding: 1,
        },
      }}
    />
  );
}
