import React, { useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter from Next.js
import WelcomeDashboard from './welcome';
import getOrCreateUUID from '../utils/uuid';

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const userId = getOrCreateUUID();

    // If the user already has a UUID, redirect them to the dashboard or any other page
    if (userId) {
      router.push('/dashboard'); // Redirect to the dashboard
    } else {
      console.log('User ID:', userId);
    }
  }, [router]);

  return (
    <>
      {/* Only render the welcome page if the user is new */}
      <WelcomeDashboard />
    </>
  );
}
