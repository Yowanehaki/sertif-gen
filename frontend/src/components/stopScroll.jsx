import { useEffect } from 'react';

const useModalScroll = (isOpen) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // disable scroll
    } else {
      document.body.style.overflow = 'auto'; // enable scroll again
    }

    return () => {
      document.body.style.overflow = 'auto'; // pastikan scroll diaktifkan kembali saat unmount
    };
  }, [isOpen]);
};

export default useModalScroll; 