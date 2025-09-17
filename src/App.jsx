import React, { useState, useEffect } from 'react';
import AgeCalculator from './AgeCalculator';
import LoveCalculator from './LoveCalculator';
import AdSenseAd from './AdSenseAd';
import { useGoogleAnalytics, trackEvent } from './GoogleAnalytics';
import { config } from './config.js';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('age');
  
  // Initialize Google Analytics
  useGoogleAnalytics();

  // Dynamic theme based on active tab
  useEffect(() => {
    document.body.className = `theme-${activeTab}`;
    
    // Track tab changes
    trackEvent('tab_changed', {
      tab_name: activeTab,
      timestamp: new Date().toISOString()
    });
    
    return () => {
      document.body.className = '';
    };
  }, [activeTab]);

  // Add Google AdSense script dynamically based on environment variables
  useEffect(() => {
    if (config.features.enableAdsense && config.adsenseClientId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClientId}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      // Add AdSense meta tag to head
      const metaTag = document.createElement('meta');
      metaTag.name = 'google-adsense-account';
      metaTag.content = config.adsenseClientId;
      document.head.appendChild(metaTag);
    }
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="hero-content">
          <div className="logo-section">
            <div className="main-logo">
              {activeTab === 'age' ? '🎂' : activeTab === 'love' ? '💖' : '🧮'}
            </div>
            <h1>{config.app.name}</h1>
          </div>
          <p className="hero-subtitle">Professional calculation tools for age analysis and relationship insights</p>
        </div>
      </header>

      <nav className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'age' ? 'active' : ''}`}
          onClick={() => setActiveTab('age')}
        >
          🎂 Age Calculator
        </button>
        <button 
          className={`tab-btn ${activeTab === 'love' ? 'active' : ''}`}
          onClick={() => setActiveTab('love')}
        >
          💘 Love Calculator
        </button>
        <button 
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          ℹ️ About & FAQ
        </button>
      </nav>

      <main className="main-content">
        {/* AdSense Placement - Top Banner */}
        {config.features.enableAdsense && (
          <div className="ad-placement top-ad">
            <AdSenseAd adSlot={config.adSlots.header} />
          </div>
        )}
        
        <div className="calculator-container">
          {activeTab === 'age' && <AgeCalculator />}
          {activeTab === 'love' && <LoveCalculator />}
          {activeTab === 'about' && (
            <div className="about-content calculator-card">
              <div className="calculator-header">
                <h2>ℹ️ About & FAQ</h2>
                <p>Everything you need to know about our calculators</p>
              </div>
              
              <div className="content-grid">
                <div className="content-item">
                  <h3>🎂 Age Calculator Features</h3>
                  <p>Calculate your exact age with precision. Get detailed statistics including total days lived, next birthday countdown, and interesting insights.</p>
                  <ul>
                    <li>Real-time seconds counter</li>
                    <li>Exact age calculation</li>
                    <li>Birthday countdown</li>
                    <li>Personalized birthday cards</li>
                  </ul>
                </div>
                <div className="content-item">
                  <h3>💖 Love Compatibility Calculator</h3>
                  <p>Discover compatibility between two people with our entertaining algorithm and beautiful visual results.</p>
                  <ul>
                    <li>Name-based compatibility analysis</li>
                    <li>Percentage scoring system</li>
                    <li>Romantic insights</li>
                    <li>Shareable results</li>
                  </ul>
                </div>
              </div>
              
              <div className="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-item">
                  <h4>How accurate is the age calculator?</h4>
                  <p>Our age calculator is highly accurate, calculating your exact age down to the second using precise date arithmetic.</p>
                </div>
                <div className="faq-item">
                  <h4>How does the love compatibility calculator work?</h4>
                  <p>The love calculator uses an entertaining algorithm for compatibility percentages. It's designed for fun and entertainment purposes only.</p>
                </div>
                <div className="faq-item">
                  <h4>Can I share my results?</h4>
                  <p>Yes! You can download high-quality images of your results or create personalized birthday cards to share.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* AdSense Placement - Sidebar */}
        {config.features.enableAdsense && (
          <div className="ad-placement sidebar-ad">
            <AdSenseAd adSlot={config.adSlots.sidebar} />
          </div>
        )}
        
        {/* AdSense Placement - Footer */}
        {config.features.enableAdsense && (
          <div className="ad-placement bottom-ad">
            <AdSenseAd adSlot={config.adSlots.footer} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#age-calculator" onClick={() => setActiveTab('age')}>Age Calculator</a></li>
              <li><a href="#love-calculator" onClick={() => setActiveTab('love')}>Love Calculator</a></li>
              <li><button className="link-button" onClick={() => setActiveTab('about')}>About & FAQ</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Free Online Calculators</li>
              <li>Downloadable Results</li>
              <li>Mobile Responsive</li>
              <li>No Registration Required</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>About</h4>
            <p>Free online age and love compatibility calculators with beautiful, colorful results. Calculate your exact age and discover love compatibility percentages.</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>Made with ❤️ for fun calculations! © 2025 {config.app.name}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;