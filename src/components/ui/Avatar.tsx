import React, { useState } from 'react';
import { initials } from '../../utils/format';

interface AvatarProps {
  src?: string;
  name: string;
  className?: string;
  rounded?: string;
}

/** Foto dengan fallback inisial bila gambar gagal dimuat / offline. */
export const Avatar: React.FC<AvatarProps> = ({ src, name, className = 'h-10 w-10', rounded = 'rounded-full' }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        aria-label={name}
        className={`${className} ${rounded} flex shrink-0 items-center justify-center bg-gradient-to-br from-blue-700 to-indigo-600 text-[0.8em] font-bold text-white`}
      >
        {initials(name)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`${className} ${rounded} shrink-0 object-cover`}
    />
  );
};
