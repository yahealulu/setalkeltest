'use client';

import Login from '@/components/Auth/Login';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
    const { isAuthLoading } = useContext(AuthContext);

    if (isAuthLoading) {
        return <LoadingScreen />;
    }

    return (
        <main className="bg-[#faf8f5]">
            <Login />
        </main>
    );
}