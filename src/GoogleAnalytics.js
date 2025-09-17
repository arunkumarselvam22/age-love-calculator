import { useEffect } from 'react';
import { config } from './config.js';

// Google Analytics initialization and tracking
export const useGoogleAnalytics = () => {
  useEffect(() => {
    // Only initialize if analytics is enabled and ID is available
    if (config.features.enableAnalytics && config.googleAnalyticsId) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
      document.head.appendChild(script);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', config.googleAnalyticsId, {
        page_title: document.title,
        page_location: window.location.href
      });

      // Track page view
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }, []);
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (config.features.enableAnalytics && config.googleAnalyticsId && window.gtag) {
    window.gtag('event', eventName, {
      custom_parameter: true,
      ...parameters
    });
  }
};

// Track calculator usage
export const trackCalculatorUsage = (calculatorType, hasImage = false) => {
  trackEvent('calculator_used', {
    calculator_type: calculatorType,
    has_image: hasImage,
    timestamp: new Date().toISOString()
  });
};

// Track download actions
export const trackDownload = (calculatorType, fileName) => {
  trackEvent('result_downloaded', {
    calculator_type: calculatorType,
    file_name: fileName,
    timestamp: new Date().toISOString()
  });
};

// Track social sharing
export const trackSocialShare = (platform, calculatorType) => {
  trackEvent('social_share', {
    platform: platform,
    calculator_type: calculatorType,
    timestamp: new Date().toISOString()
  });
};

export default useGoogleAnalytics;