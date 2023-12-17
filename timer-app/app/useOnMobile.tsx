import { useState, useLayoutEffect } from 'react';

const useOnMobile = () => {
  const [isMobile, setIsMobile] = useState(true);

  const resizeCallback = () => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useLayoutEffect(() => {
    if (window.innerWidth > 767) {
      setIsMobile(false);
    }

    window.addEventListener('resize', resizeCallback);

  }, []);
  return isMobile;
};

export default useOnMobile;