'use client';

import Categories from '@/components/Categories';
import NewProducts from '@/components/NewProducts';
import HeroSection from '@/components/HeroSection';
import CategoryProducts from '@/components/CategoryProducts';
import CountriesSection from '@/components/CountriesSection';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Banners from '@/components/Banners';

export default function Home() {

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <Banners />
      <CountriesSection/>
      <Categories />
      <NewProducts />
    </main>
  );
} 