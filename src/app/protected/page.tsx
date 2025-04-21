'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Notification } from '@/components/Notification';

export default function ProtectedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('error');
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const apiKey = searchParams.get('key');
    const isValid = searchParams.get('isValid') === 'true';

    if (!apiKey) {
      router.push('/playground');
      return;
    }

    // Use the validation status from URL parameters
    if (isValid) {
      setNotificationType('success');
      setNotificationMessage('Valid API Key');
    } else {
      setNotificationType('error');
      setNotificationMessage('Invalid API Key');
    }
    setShowNotification(true);
  }, [searchParams, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">API Key Validation</h1>
      {showNotification && (
        <Notification
          type={notificationType}
          message={notificationMessage}
          onClose={() => {
            setShowNotification(false);
            if (notificationType === 'error') {
              router.push('/playground');
            }
          }}
        />
      )}
    </div>
  );
} 