// Application Configuration
// This file reads environment variables and provides them to the app
// All environment variables in Vite must start with VITE_ to be exposed to the client

export const config = {
  // Google Services
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  adsenseClientId: import.meta.env.VITE_ADSENSE_CLIENT_ID,
  
  // AdSense Ad Slots
  adSlots: {
    header: import.meta.env.VITE_ADSENSE_HEADER_SLOT,
    sidebar: import.meta.env.VITE_ADSENSE_SIDEBAR_SLOT,
    footer: import.meta.env.VITE_ADSENSE_FOOTER_SLOT,
    mobile: import.meta.env.VITE_ADSENSE_MOBILE_SLOT,
  },
  
  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Age & Love Calculator',
    domain: import.meta.env.VITE_DOMAIN || 'localhost:5173',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
    contactEmail: import.meta.env.VITE_CONTACT_EMAIL || 'contact@example.com',
  },
  
  // Social Media
  social: {
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID,
    twitterHandle: import.meta.env.VITE_TWITTER_HANDLE,
  },
  
  // Feature Flags
  features: {
    enableAdsense: import.meta.env.VITE_ENABLE_ADSENSE === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableSocialSharing: import.meta.env.VITE_ENABLE_SOCIAL_SHARING !== 'false',
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE || '5'),
  },
  
  // Environment Info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Helper function to get full URL
  getFullUrl: (path = '') => {
    const protocol = import.meta.env.PROD ? 'https' : 'http';
    const domain = import.meta.env.VITE_DOMAIN || 'localhost:5173';
    return `${protocol}://${domain}${path}`;
  }
};

// Validation: Log warnings for missing required environment variables in production
if (import.meta.env.PROD) {
  const required = [
    'VITE_GOOGLE_ANALYTICS_ID',
    'VITE_ADSENSE_CLIENT_ID',
    'VITE_DOMAIN'
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing required environment variables:', missing);
  }
}

export default config;