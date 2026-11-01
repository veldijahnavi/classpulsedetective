/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';

const OFFLINE_QUEUE_KEY = 'classpulse_offline_queue_v1';
const CACHED_LESSONS_KEY = 'classpulse_cached_lessons_v1';

export interface QueuedSubmission {
  id: string;
  type: 'assessment' | 'recovery_step' | 'retest';
  endpoint: string;
  payload: any;
  timestamp: string;
  subject?: string;
  conceptTitle?: string;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [queuedCount, setQueuedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const refreshQueueCount = useCallback(() => {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (raw) {
        const queue: QueuedSubmission[] = JSON.parse(raw);
        setQueuedCount(queue.length);
      } else {
        setQueuedCount(0);
      }
    } catch {
      setQueuedCount(0);
    }
  }, []);

  const syncQueue = useCallback(async (token?: string) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (!raw) return;
      const queue: QueuedSubmission[] = JSON.parse(raw);
      if (queue.length === 0) return;

      setIsSyncing(true);
      const authToken = token || localStorage.getItem('classpulse_token');
      const remaining: QueuedSubmission[] = [];

      for (const item of queue) {
        try {
          const res = await fetch(item.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify(item.payload),
          });
          if (!res.ok && res.status !== 400) {
            // Keep in queue for retry if server error / transient network issue
            remaining.push(item);
          }
        } catch {
          remaining.push(item);
        }
      }

      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
      setQueuedCount(remaining.length);
      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Offline sync failed:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    refreshQueueCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshQueueCount, syncQueue]);

  return {
    isOnline,
    queuedCount,
    isSyncing,
    lastSyncTime,
    syncQueue,
    refreshQueueCount,
  };
}

export function queueSubmission(item: Omit<QueuedSubmission, 'id' | 'timestamp'>): void {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue: QueuedSubmission[] = raw ? JSON.parse(raw) : [];
    queue.push({
      ...item,
      id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to queue offline submission:', e);
  }
}

export function cacheLessonLocally(chapterId: string, conceptId: string, lessonData: any): void {
  try {
    const raw = localStorage.getItem(CACHED_LESSONS_KEY);
    const cache = raw ? JSON.parse(raw) : {};
    const key = `${chapterId}_${conceptId}`;
    cache[key] = {
      lesson: lessonData,
      cachedAt: new Date().toISOString(),
    };
    localStorage.setItem(CACHED_LESSONS_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Failed to cache lesson offline:', e);
  }
}

export function getCachedLessonLocally(chapterId: string, conceptId: string): any | null {
  try {
    const raw = localStorage.getItem(CACHED_LESSONS_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    const key = `${chapterId}_${conceptId}`;
    return cache[key]?.lesson || null;
  } catch {
    return null;
  }
}
