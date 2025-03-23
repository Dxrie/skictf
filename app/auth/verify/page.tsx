'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({token}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (error) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('An error occurred during verification');
        }
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg text-center">
        {status === 'loading' && (
          <div>
            <h2 className="text-2xl font-bold">Verifying your email...</h2>
            <p className="mt-2 text-muted-foreground">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 className="text-2xl font-bold text-green-600">{message}</h2>
            <p className="mt-4 text-muted-foreground">You can now sign in to your account.</p>
            <Link href="/auth/login">
              <Button className="mt-4">Sign in</Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="mt-2 text-muted-foreground">{message}</p>
            <Link href="/auth/login">
              <Button variant="ghost" className="mt-4">Back to Sign in</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}