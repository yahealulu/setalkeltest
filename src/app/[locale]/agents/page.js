'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AGENTS_API = 'https://setalkel.amjadshbib.com/api/Agents';

export default function AgentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const { data } = await axios.get(AGENTS_API);
      return data?.data || [];
    },
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8a27a]"></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">Failed to load agents. Please try again later.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#4c5a3c]">Our Agents</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {data.map((agent, idx) => (
          <motion.div
            key={agent.email + idx}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-center p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-[#c8a27a] bg-gray-100">
              <Image
                src={`https://setalkel.amjadshbib.com/public/${agent.image}`}
                alt={agent.name}
                fill
                className="object-cover"
                sizes="128px"
                onError={e => { e.target.src = '/placeholder-product.jpg'; }}
              />
            </div>
            <h2 className="text-xl font-semibold text-[#4c5a3c] mb-2 text-center">{agent.name}</h2>
            <p className="text-gray-600 text-sm mb-1 text-center"><span className="font-medium">Address:</span> {agent.address}</p>
            <p className="text-gray-600 text-sm mb-1 text-center"><span className="font-medium">Email:</span> {agent.email}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
