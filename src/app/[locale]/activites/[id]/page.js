'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ActivityDetail({ params }) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch activity details
  const { data: activity, isLoading, error } = useQuery({
    queryKey: ['activity', params.id],
    queryFn: async () => {
      const { data } = await axios.get(`https://setalkel.amjadshbib.com/api/activities/${params.id}`);
      return data?.data || null;
    },
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  // Prepare gallery images
  const galleryImages = activity ? [
    activity.images, // Main image
    ...(activity.gallery || []) // Additional gallery images
  ].map(img => `https://setalkel.amjadshbib.com/public/${img}`) : [];

  // Handle gallery navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8a27a]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">Error loading activity details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-[#faf8f5]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Activity Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          {activity.name_translations?.en || 'Activity'}
        </h1>

        {/* Activity Type and Date */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <span className="inline-block bg-[#f0e6d9] text-[#c8a27a] px-4 py-2 rounded-full font-medium">
            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
          </span>
          <span className="inline-block bg-white text-gray-700 px-4 py-2 rounded-full font-medium">
            {formatDate(activity.event_date)}
          </span>
          <span className="inline-block bg-white text-gray-700 px-4 py-2 rounded-full font-medium">
            {activity.location_translations?.en || 'Location'}
          </span>
        </div>

        {/* Gallery Slider */}
        <div className="mb-12 relative rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-[60vh] w-full">
            {galleryImages.length > 0 ? (
              <Image
                src={galleryImages[currentImageIndex]}
                alt={`${activity.name_translations?.en || 'Activity'} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-product .jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Gallery Navigation */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Gallery Indicators */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white bg-opacity-50'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Activity Description */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">About This Activity</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {activity.description_translations?.en || 'No description available.'}
          </p>
        </div>

        {/* Video Section (if available) */}
        {activity.video_url && (
          <div className="bg-white p-8 rounded-xl shadow-md mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Activity Video</h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <iframe
                src={activity.video_url.replace('watch?v=', 'embed/')}
                title="Activity Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-[400px]"
              ></iframe>
            </div>
          </div>
        )}

        {/* Thumbnail Gallery */}
        {galleryImages.length > 1 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-24 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? 'border-[#c8a27a] scale-105' : 'border-transparent hover:border-gray-300'}`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-product .jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}