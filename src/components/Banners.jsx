'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const extractYouTubeVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1);
    }
  } catch (err) {
    return null;
  }
  return null;
};

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://setalkel.amjadshbib.com/api/banners');
        const result = await response.json();
        if (result.status && result.data.length > 0) {
          setBanners(result.data);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();

    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const durationMs = (banners[currentIndex]?.show_duration || 15) * 1000;

    timerRef.current = setTimeout(() => {
      handleNext();
    }, durationMs);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, banners]);

  const handlePrev = () => {
    clearTimeout(timerRef.current);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setKey((prev) => prev + 1);
  };

  const handleNext = () => {
    clearTimeout(timerRef.current);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
    setKey((prev) => prev + 1);
  };

  if (banners.length === 0) {
    return <div className="text-center py-10">Loading banners...</div>;
  }

  const current = banners[currentIndex];
  const imageUrl = current.image
    ? `https://setalkel.amjadshbib.com/public/${current.image}`
    : null;

  const videoId = current.video_url ? extractYouTubeVideoId(current.video_url) : null;
  const videoUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0`
    : null;

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Banner ${current.id}`}
              className="w-full h-full object-cover"
            />
          ) : videoUrl ? (
            <iframe
              src={videoUrl}
              title={`YouTube video ${videoId}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No media available
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full shadow-md transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-2 rounded-full shadow-md transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Banners;
