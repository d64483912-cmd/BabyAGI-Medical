// Baby-AGI Medical Research Assistant - Enhanced Service Worker
const STATIC_CACHE = 'babyagi-static-v2.0.0';
const DYNAMIC_CACHE = 'babyagi-dynamic-v2.0.0';
const MEDICAL_DATA_CACHE = 'babyagi-medical-data-v1.0.0';

// Core files to cache immediately
const CORE_FILES = [
  '/',
  '/manifest.json',
  '/medical-icon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/_next/static/css/app/layout.css',
  '/_next/static/css/app/globals.css'
];

// Medical research assets to cache
const MEDICAL_ASSETS = [
  '/api/medical/specialties',
  '/api/medical/study-types',
  '/api/medical/templates'
];

// Network timeout for requests
const NETWORK_TIMEOUT = 5000;

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Baby-AGI Medical SW v2.0.0');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching core files');
        return cache.addAll(CORE_FILES);
      }),
      caches.open(MEDICAL_DATA_CACHE).then((cache) => {
        console.log('[SW] Pre-caching medical data');
        // Cache medical templates and data for offline use
        return cache.addAll(MEDICAL_ASSETS.filter(url => !url.includes('/api/')));
      })
    ])
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Baby-AGI Medical SW');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== MEDICAL_DATA_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - Advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    // Static assets - Cache first
    event.respondWith(handleStaticAssets(request));
  } else if (request.destination === 'document') {
    // HTML pages - Stale while revalidate
    event.respondWith(handleDocumentRequest(request));
  } else {
    // Other resources - Cache first with fallback
    event.respondWith(handleOtherRequests(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for API, trying cache:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for medical data
    if (request.url.includes('/api/medical/')) {
      return new Response(
        JSON.stringify({
          error: 'Offline mode',
          message: 'Medical data unavailable offline',
          cached: false
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', request.url);
    throw error;
  }
}

// Handle HTML documents with stale-while-revalidate
async function handleDocumentRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Start network request
  const networkResponsePromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    // Update cache in background
    networkResponsePromise.catch(() => {/* ignore background update errors */});
    return cachedResponse;
  }
  
  // Wait for network if no cache
  const networkResponse = await networkResponsePromise;
  if (networkResponse) {
    return networkResponse;
  }
  
  // Return offline page as fallback
  return caches.match('/') || new Response(
    '<!DOCTYPE html><html><head><title>Baby-AGI Medical - Offline</title></head><body><h1>You are offline</h1><p>Please check your connection and try again.</p></body></html>',
    { headers: { 'Content-Type': 'text/html' } }
  );
}

// Handle other requests
async function handleOtherRequests(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return a generic offline response
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for medical research data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'medical-data-sync') {
    event.waitUntil(syncMedicalData());
  } else if (event.tag === 'task-sync') {
    event.waitUntil(syncTaskData());
  } else if (event.tag === 'export-sync') {
    event.waitUntil(syncExportData());
  } else if (event.tag === 'research-results-sync') {
    event.waitUntil(syncResearchResults());
  }
});

// Sync medical research data when online
async function syncMedicalData() {
  try {
    // Sync medical research sessions
    const sessions = await getStoredSessions();
    for (const session of sessions) {
      if (!session.synced) {
        await syncSession(session);
      }
    }
    console.log('[SW] Medical data sync completed');
  } catch (error) {
    console.error('[SW] Medical data sync failed:', error);
    // Schedule retry for failed sync
    await scheduleRetrySync('medical-data-sync');
  }
}

// Schedule retry sync for failed operations
async function scheduleRetrySync(tag) {
  try {
    // Wait 5 minutes before retry
    await new Promise(resolve => setTimeout(resolve, 300000));
    await self.registration.sync.register(`${tag}-retry`);
  } catch (error) {
    console.error('[SW] Failed to schedule retry sync:', error);
  }
}

// Get stored research sessions from IndexedDB
async function getStoredSessions() {
  try {
    const db = await openMedicalDB();
    const transaction = db.transaction(['research-sessions'], 'readonly');
    const store = transaction.objectStore('research-sessions');
    const sessions = await getAllFromStore(store);
    return sessions.filter(session => !session.synced);
  } catch (error) {
    console.error('[SW] Error getting stored sessions:', error);
    return [];
  }
}

// Sync individual session
async function syncSession(session) {
  try {
    console.log('[SW] Syncing session:', session.id);
    
    const response = await fetch('/api/medical/sync-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    
    if (response.ok) {
      // Mark as synced in IndexedDB
      await markSessionSynced(session.id);
      console.log('[SW] Session synced successfully:', session.id);
    } else {
      console.error('[SW] Session sync failed:', response.status);
    }
  } catch (error) {
    console.error('[SW] Error syncing session:', error);
  }
}

// Sync task data
async function syncTaskData() {
  try {
    console.log('[SW] Syncing task data...');
    const db = await openMedicalDB();
    const transaction = db.transaction(['tasks'], 'readonly');
    const store = transaction.objectStore('tasks');
    const tasks = await getAllFromStore(store);
    
    const unsyncedTasks = tasks.filter(task => !task.synced);
    
    for (const task of unsyncedTasks) {
      const response = await fetch('/api/tasks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      
      if (response.ok) {
        await markTaskSynced(task.id);
      }
    }
    
    console.log('[SW] Task data sync completed');
  } catch (error) {
    console.error('[SW] Task sync failed:', error);
  }
}

// Sync export data
async function syncExportData() {
  try {
    console.log('[SW] Syncing export data...');
    const db = await openMedicalDB();
    const transaction = db.transaction(['exports'], 'readonly');
    const store = transaction.objectStore('exports');
    const exports = await getAllFromStore(store);
    
    const unsyncedExports = exports.filter(exp => !exp.synced);
    
    for (const exportData of unsyncedExports) {
      const response = await fetch('/api/exports/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData)
      });
      
      if (response.ok) {
        await markExportSynced(exportData.id);
      }
    }
    
    console.log('[SW] Export data sync completed');
  } catch (error) {
    console.error('[SW] Export sync failed:', error);
  }
}

// Sync research results
async function syncResearchResults() {
  try {
    console.log('[SW] Syncing research results...');
    const db = await openMedicalDB();
    const transaction = db.transaction(['research-results'], 'readonly');
    const store = transaction.objectStore('research-results');
    const results = await getAllFromStore(store);
    
    const unsyncedResults = results.filter(result => !result.synced);
    
    for (const result of unsyncedResults) {
      const response = await fetch('/api/research/sync-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      
      if (response.ok) {
        await markResultSynced(result.id);
      }
    }
    
    console.log('[SW] Research results sync completed');
  } catch (error) {
    console.error('[SW] Research results sync failed:', error);
  }
}

// Push notifications for medical research updates
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'Your medical research analysis is complete',
    icon: '/medical-icon.svg',
    badge: '/medical-icon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: '/?notification=research-complete'
    },
    actions: [
      {
        action: 'view',
        title: 'View Results',
        icon: '/medical-icon.svg'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Baby-AGI Medical Research', options)
  );
});

// Handle notification clicks with mobile optimization
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action, event.notification.tag);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  let url = data.url || '/';
  
  // Handle different actions
  if (action === 'view') {
    url = data.url || '/';
  } else if (action === 'export') {
    url = '/?tab=export';
  } else if (action === 'download' && data.downloadId) {
    url = `/?download=${data.downloadId}`;
  } else if (!action) {
    // Default click (no action button)
    url = data.url || '/';
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Check if the app is already open
      for (const client of clientList) {
        if (client.url.includes(url.split('?')[0])) {
          // Focus existing window and navigate if needed
          client.focus();
          if (url.includes('?')) {
            client.postMessage({ type: 'NAVIGATE', url });
          }
          return;
        }
      }
      
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '2.0.0' });
  }
  
  if (event.data.type === 'CACHE_MEDICAL_DATA') {
    event.waitUntil(cacheMedicalData(event.data.data));
  }
  
  if (event.data.type === 'RESEARCH_COMPLETED') {
    event.waitUntil(showResearchCompleteNotification(event.data));
  }
  
  if (event.data.type === 'TASK_COMPLETED') {
    event.waitUntil(showTaskCompleteNotification(event.data));
  }
  
  if (event.data.type === 'EXPORT_READY') {
    event.waitUntil(showExportReadyNotification(event.data));
  }
  
  if (event.data.type === 'SCHEDULE_SYNC') {
    event.waitUntil(self.registration.sync.register(event.data.tag));
  }
});

// Cache medical research data
async function cacheMedicalData(data) {
  const cache = await caches.open(MEDICAL_DATA_CACHE);
  await cache.put(
    '/offline-medical-data',
    new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  );
  console.log('[SW] Medical data cached for offline use');
}

// Helper functions for IndexedDB operations
async function openMedicalDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BabyAGIMedical', 2);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('research-sessions')) {
        const sessionStore = db.createObjectStore('research-sessions', { keyPath: 'id' });
        sessionStore.createIndex('synced', 'synced', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('tasks')) {
        const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
        taskStore.createIndex('synced', 'synced', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('exports')) {
        const exportStore = db.createObjectStore('exports', { keyPath: 'id' });
        exportStore.createIndex('synced', 'synced', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('research-results')) {
        const resultStore = db.createObjectStore('research-results', { keyPath: 'id' });
        resultStore.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
}

async function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function markSessionSynced(sessionId) {
  const db = await openMedicalDB();
  const transaction = db.transaction(['research-sessions'], 'readwrite');
  const store = transaction.objectStore('research-sessions');
  const session = await store.get(sessionId);
  if (session) {
    session.synced = true;
    session.syncedAt = Date.now();
    await store.put(session);
  }
}

async function markTaskSynced(taskId) {
  const db = await openMedicalDB();
  const transaction = db.transaction(['tasks'], 'readwrite');
  const store = transaction.objectStore('tasks');
  const task = await store.get(taskId);
  if (task) {
    task.synced = true;
    task.syncedAt = Date.now();
    await store.put(task);
  }
}

async function markExportSynced(exportId) {
  const db = await openMedicalDB();
  const transaction = db.transaction(['exports'], 'readwrite');
  const store = transaction.objectStore('exports');
  const exportData = await store.get(exportId);
  if (exportData) {
    exportData.synced = true;
    exportData.syncedAt = Date.now();
    await store.put(exportData);
  }
}

async function markResultSynced(resultId) {
  const db = await openMedicalDB();
  const transaction = db.transaction(['research-results'], 'readwrite');
  const store = transaction.objectStore('research-results');
  const result = await store.get(resultId);
  if (result) {
    result.synced = true;
    result.syncedAt = Date.now();
    await store.put(result);
  }
}

// Mobile-optimized notification functions
async function showResearchCompleteNotification(data) {
  const options = {
    body: `Research on "${data.topic}" completed with ${data.taskCount} tasks`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'research-complete',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      { action: 'view', title: 'View Results', icon: '/icons/view.png' },
      { action: 'export', title: 'Export Data', icon: '/icons/export.png' }
    ],
    data: { url: '/?tab=results' }
  };
  
  await self.registration.showNotification('Medical Research Complete! 🔬', options);
}

async function showTaskCompleteNotification(data) {
  const options = {
    body: `Task "${data.taskName}" completed successfully`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'task-complete',
    vibrate: [100, 50, 100],
    actions: [
      { action: 'view', title: 'View Task', icon: '/icons/task.png' }
    ],
    data: { url: '/?tab=tasks' }
  };
  
  await self.registration.showNotification('Task Complete! ✅', options);
}

async function showExportReadyNotification(data) {
  const options = {
    body: `${data.format} export ready for download (${data.size})`,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'export-ready',
    requireInteraction: true,
    vibrate: [300, 200, 300],
    actions: [
      { action: 'download', title: 'Download', icon: '/icons/download.png' }
    ],
    data: { url: '/?tab=export', downloadId: data.id }
  };
  
  await self.registration.showNotification('Export Ready! 📄', options);
}

console.log('[SW] Baby-AGI Medical Research Assistant SW v2.0.0 loaded with enhanced mobile support');
