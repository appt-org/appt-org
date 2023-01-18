import { useEffect, useRef, useState } from 'react';
import _random from 'lodash/random';
import classNames from 'classnames';

export type PageLoaderProps = {
  loading: boolean;
};

export default function PageLoader({ loading }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [animating, setAnimating] = useState(false);

  const loadTimeout = useRef(0);
  const resetTimeout = useRef(0);

  useEffect(() => {
    let loadInterval = 0;

    function startLoading() {
      clearTimeout(loadTimeout.current);
      clearTimeout(resetTimeout.current);

      setProgress(0);
      setAnimating(true);
      setShowLoader(true);
      setProgress(_random(7, 13));

      loadInterval = window.setInterval(updateProgressRandomly, 500);
    }

    async function finishLoading() {
      if (!showLoader) {
        return;
      }

      setProgress(100);
      clearInterval(loadInterval);

      // Wait for transition to 100% scale to finish
      loadTimeout.current = window.setTimeout(() => {
        setShowLoader(false);

        // Wait for transition opacity 0 to finish
        resetTimeout.current = window.setTimeout(() => {
          setAnimating(false);
          setProgress(0);
        }, 300);
      }, 300);
    }

    function updateProgressRandomly() {
      setProgress(prevProgress => Math.min(100, prevProgress + _random(0.5, 2)));
    }

    loading ? startLoading() : finishLoading();

    return () => {
      clearInterval(loadInterval);
    };
  }, [loading, showLoader]);

  const classes = classNames('fixed top-0 left-0 w-full h-[3px] z-50', {
    'transition-opacity duration-300 ease-out': animating,
  });
  const barClasses = classNames('h-full w-full bg-accent origin-left scale-0', {
    'transition-transform duration-300 ease-out': animating,
  });

  return (
    <div className={classes} style={{ opacity: showLoader ? 1 : 0 }}>
      <div className={barClasses} style={{ transform: `scaleX(${progress}%)` }} />
    </div>
  );
}
