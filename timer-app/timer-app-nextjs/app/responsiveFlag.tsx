import { useState, useLayoutEffect } from 'react';

// reference about breakpoints: https://getbootstrap.jp/docs/5.3/layout/breakpoints/

export const Breakpoints = {
  sm: 0,
  md: 1,
  lg: 2,
  xl: 3,
  xxl: 4
}

export const WatchSizeOfDisplay = () => {
  const [displaySize, setDisplaySize] = useState(Breakpoints.sm);

  const resizeCallback = () => {
    if (window.innerWidth <= 576) {
      setDisplaySize(Breakpoints.sm);
    } else if (window.innerWidth <= 768) {
      setDisplaySize(Breakpoints.md);
    } else if (window.innerWidth <= 992) {
      setDisplaySize(Breakpoints.lg);
    } else if (window.innerWidth <= 1200) {
      setDisplaySize(Breakpoints.xl);
    } else {
      setDisplaySize(Breakpoints.xxl);
    }
  };

  useLayoutEffect(() => {
    if (window.innerWidth <= 576) {
      setDisplaySize(Breakpoints.sm);
    } else if (window.innerWidth <= 768) {
      setDisplaySize(Breakpoints.md);
    } else if (window.innerWidth <= 992) {
      setDisplaySize(Breakpoints.lg);
    } else if (window.innerWidth <= 1200) {
      setDisplaySize(Breakpoints.xl);
    } else {
      setDisplaySize(Breakpoints.xxl);
    }

    window.addEventListener('resize', resizeCallback);

  }, []);
  return displaySize;
};

export const useOnSmallDisplay = () => {
  const flag = Breakpoints.sm == WatchSizeOfDisplay();
  return flag;
}

export const useOnMediumDisplay = () => {
  const flag = Breakpoints.md == WatchSizeOfDisplay();
  return flag;
}

export const useOnLargeDisplay = () => {
  const flag = Breakpoints.lg == WatchSizeOfDisplay();
  return flag;
}

export const useOnExtraLargeDisplay = () => {
  const flag = Breakpoints.xl == WatchSizeOfDisplay();
  return flag;
}

export const useOnExtraExtraLargeDisplay = () => {
  const flag = Breakpoints.xxl == WatchSizeOfDisplay();
  return flag;
}