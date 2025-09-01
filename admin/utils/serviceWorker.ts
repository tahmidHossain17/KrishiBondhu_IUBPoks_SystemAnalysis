// Service Worker utilities for SPA functionality

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker.'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed.'
              );
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// PWA install prompt
export function setupPWAInstall() {
  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Show install button or banner
    showInstallPromotion();
  });

  return {
    canInstall: () => !!deferredPrompt,
    install: async () => {
      if (!deferredPrompt) return false;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        deferredPrompt = null;
        return true;
      }
      return false;
    }
  };
}

function showInstallPromotion() {
  // Create a subtle install promotion
  const existingBanner = document.getElementById('pwa-install-banner');
  if (existingBanner) return;

  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'fixed bottom-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  banner.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="font-semibold">Install KrishiBondhu</h3>
        <p class="text-sm opacity-90">Get quick access to your agricultural platform</p>
      </div>
      <button id="install-btn" class="ml-4 bg-white text-primary px-3 py-1 rounded text-sm font-medium">
        Install
      </button>
      <button id="dismiss-btn" class="ml-2 text-white/80 hover:text-white">
        ✕
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  // Handle install button click
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');
  
  const { install } = setupPWAInstall();
  
  installBtn?.addEventListener('click', async () => {
    const installed = await install();
    if (installed) {
      banner.remove();
    }
  });

  dismissBtn?.addEventListener('click', () => {
    banner.remove();
    // Remember user dismissed for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  });

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.body.contains(banner)) {
      banner.remove();
    }
  }, 10000);
}

// Network status monitoring for SPA
export function setupNetworkMonitoring() {
  const updateOnlineStatus = () => {
    const status = navigator.onLine ? 'online' : 'offline';
    document.body.classList.toggle('offline', !navigator.onLine);
    
    if (status === 'offline') {
      showOfflineMessage();
    } else {
      hideOfflineMessage();
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Initial check
  updateOnlineStatus();
}

function showOfflineMessage() {
  const existingMessage = document.getElementById('offline-message');
  if (existingMessage) return;

  const message = document.createElement('div');
  message.id = 'offline-message';
  message.className = 'fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center text-sm z-50';
  message.textContent = 'You are currently offline. Some features may not be available.';
  
  document.body.appendChild(message);
}

function hideOfflineMessage() {
  const message = document.getElementById('offline-message');
  if (message) {
    message.remove();
  }
}

// Prefetch critical routes for SPA
export function prefetchRoutes() {
  const criticalRoutes = [
    '/customer/dashboard',
    '/farmer/dashboard', 
    '/auth/login',
    '/auth/registration'
  ];

  // Prefetch on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
}

declare global {
  interface Window {
    beforeinstallprompt: Event;
  }
  
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }
}

export default {
  register,
  unregister,
  setupPWAInstall,
  setupNetworkMonitoring,
  prefetchRoutes
};