import { useState, useLayoutEffect } from 'react';

export const useOnMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  const resizeCallback = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useLayoutEffect(() => {
    if (window.innerWidth > 768) {
      setIsMobile(false);
    }

    window.addEventListener('resize', resizeCallback);

  }, []);
  return isMobile;
};

export const useOnLargeDisplay = () => {
  const [isLargeDisplay, setIsLargeDisplay] = useState(true);

  const resizeCallback = () => {
    if (window.innerWidth <= 992) {
      setIsLargeDisplay(true);
    } else {
      setIsLargeDisplay(false);
    }
  };

  useLayoutEffect(() => {
    if (window.innerWidth > 992) {
      setIsLargeDisplay(false);
    }

    window.addEventListener('resize', resizeCallback);

  }, []);
  return isLargeDisplay;
};