'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Activities() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const [selectedType, setSelectedType] = useState('all');
  const [types, setTypes] = useState([]);

  // Fetch activities
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data } = await axios.get('https://setalkel.amjadshbib.com/api/activities');
      return data?.data || [];
    },
  });

  // Extract unique activity types
  useEffect(() => {
    if (activities && activities.length > 0) {
      const uniqueTypes = ['all', ...new Set(activities.map(activity => activity.type))];
      setTypes(uniqueTypes);
    }
  }, [activities]);

  // Filter activities by type
  const filteredActivities = activities?.filter(activity => {
    if (selectedType === 'all') return true;
    return activity.type === selectedType;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8a27a]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{locale === 'ar' ? 'خطأ في تحميل الأنشطة. يرجى المحاولة مرة أخرى لاحقًا.' : 'Error loading activities. Please try again later.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-[#faf8f5]">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
      >
        {locale === 'ar' ? 'أنشطتنا' : 'Our Activities'}
      </motion.h1>
      
      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedType === type
              ? 'bg-[#c8a27a] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Activities grid */}
      {filteredActivities?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">{locale === 'ar' ? 'لم يتم العثور على أنشطة.' : 'No activities found.'}</p>
        </div>
      )}
    </div>
  );
}

const ActivityCard = ({ activity, locale }) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/activites/${activity.id}`}>
        <div className="relative h-56 w-full">
          <Image
            src={`https://setalkel.amjadshbib.com/public/${activity.images}`}
            alt={activity.name_translations?.[locale] || activity.name_translations?.en || 'Activity'}
            fill
            className="object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-product .jpg';
            }}
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {activity.name_translations?.[locale] || activity.name_translations?.en || (locale === 'ar' ? 'نشاط' : 'Activity')}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{activity.location_translations?.[locale] || activity.location_translations?.en || (locale === 'ar' ? 'الموقع' : 'Location')}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(activity.event_date)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="inline-block bg-[#f0e6d9] text-[#c8a27a] text-xs px-3 py-1 rounded-full font-medium">
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </span>
            <span className="text-[#c8a27a] font-medium text-sm">{locale === 'ar' ? 'عرض التفاصيل ←' : 'View Details →'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};