'use client';

import Login from '@/components/Auth/Login';
import Register from '@/components/Auth/Register';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {

    return (
        <main className="bg-[#faf8f5]">
            <Register />
        </main>
    );
} 