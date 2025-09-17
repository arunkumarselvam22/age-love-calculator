import React, { useState, useRef } from 'react';
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { config } from './config.js';
import { trackCalculatorUsage, trackDownload, trackSocialShare } from './GoogleAnalytics.js';

const LoveCalculator = () => {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [profileImage1, setProfileImage1] = useState(null);
  const [profileImageUrl1, setProfileImageUrl1] = useState(null);
  const [profileImage2, setProfileImage2] = useState(null);
  const [profileImageUrl2, setProfileImageUrl2] = useState(null);
  const [result, setResult] = useState(null);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const resultRef = useRef(null);

  // Handle profile image upload for person 1
  const handleImageUpload1 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = config.features.maxImageSize;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Please select an image smaller than ${maxSizeMB}MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl1(event.target.result);
        setProfileImage1(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile image upload for person 2
  const handleImageUpload2 = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSizeMB = config.features.maxImageSize;
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`Please select an image smaller than ${maxSizeMB}MB`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImageUrl2(event.target.result);
        setProfileImage2(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile images
  const removeImage1 = () => {
    setProfileImage1(null);
    setProfileImageUrl1(null);
  };

  const removeImage2 = () => {
    setProfileImage2(null);
    setProfileImageUrl2(null);
  };

  const calculateLove = () => {
    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names');
      return;
    }

    // Fun love calculation algorithm
    const cleanName1 = name1.toLowerCase().replace(/[^a-z]/g, '');
    const cleanName2 = name2.toLowerCase().replace(/[^a-z]/g, '');
    
    // Combine names and calculate compatibility
    const combinedNames = cleanName1 + cleanName2;
    let score = 0;
    
    // Count common letters
    for (let i = 0; i < cleanName1.length; i++) {
      if (cleanName2.includes(cleanName1[i])) {
        score += 10;
      }
    }
    
    // Add length-based scoring
    score += Math.abs(cleanName1.length - cleanName2.length) * 2;
    
    // Add character code sum for uniqueness
    for (let char of combinedNames) {
      score += char.charCodeAt(0);
    }
    
    // Normalize to percentage (0-100)
    const percentage = ((score % 100) + Math.floor(Math.random() * 20) + 1);
    const finalPercentage = Math.min(Math.max(percentage, 1), 100);

    // Generate message based on percentage
    let message = '';
    let emoji = '';
    let category = '';

    if (finalPercentage >= 90) {
      category = 'Perfect Match';
      emoji = '💕';
      message = 'You two are absolutely perfect for each other! True love at its finest!';
    } else if (finalPercentage >= 80) {
      category = 'Excellent Match';
      emoji = '💖';
      message = 'Amazing compatibility! You have a wonderful connection together!';
    } else if (finalPercentage >= 70) {
      category = 'Great Match';
      emoji = '❤️';
      message = 'Great potential for love! You complement each other beautifully!';
    } else if (finalPercentage >= 60) {
      category = 'Good Match';
      emoji = '💗';
      message = 'Good compatibility! With effort, this could bloom into something beautiful!';
    } else if (finalPercentage >= 50) {
      category = 'Average Match';
      emoji = '💛';
      message = 'There\'s potential here! Love can grow with understanding and patience.';
    } else if (finalPercentage >= 30) {
      category = 'Challenging Match';
      emoji = '💙';
      message = 'It might require extra work, but love can overcome many obstacles!';
    } else {
      category = 'Different Paths';
      emoji = '💜';
      message = 'You may be better as friends, but who knows? Love works in mysterious ways!';
    }

    setResult({
      percentage: finalPercentage,
      message,
      emoji,
      category,
      name1: name1.trim(),
      name2: name2.trim()
    });
    
    // Track calculator usage
    trackCalculatorUsage('love', !!(profileImageUrl1 || profileImageUrl2));
  };

  const clearResult = () => {
    setName1('');
    setName2('');
    setProfileImage1(null);
    setProfileImageUrl1(null);
    setProfileImage2(null);
    setProfileImageUrl2(null);
    setResult(null);
  };

  const downloadResult = async () => {
    // Show video ad before download
    setShowVideoAd(true);
    
    // Simulate video ad duration (5 seconds)
    setTimeout(async () => {
      setShowVideoAd(false);
      
      if (resultRef.current) {
        try {
          // Hide download button and share buttons before capturing
          const downloadBtn = resultRef.current.querySelector('.download-btn');
          const shareButtons = resultRef.current.querySelector('.share-buttons');
          if (downloadBtn) {
            downloadBtn.style.display = 'none';
          }
          if (shareButtons) {
            shareButtons.style.display = 'none';
          }
          
          // Add padding to prevent edge cutting
          const canvas = await html2canvas(resultRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            x: -20,
            y: -20,
            width: resultRef.current.scrollWidth + 40,
            height: resultRef.current.scrollHeight + 40,
            scrollX: 0,
            scrollY: 0
          });
          
          // Show download button and share buttons again
          if (downloadBtn) {
            downloadBtn.style.display = '';
          }
          if (shareButtons) {
            shareButtons.style.display = '';
          }
          
          const link = document.createElement('a');
          const fileName = `${result.name1}-loves-${result.name2}-${new Date().toISOString().split('T')[0]}.png`;
          link.download = fileName;
          link.href = canvas.toDataURL('image/png', 1.0);
          link.click();
          
          // Track download
          trackDownload('love', fileName);
        } catch (error) {
          console.error('Error generating image:', error);
          alert('Error generating download. Please try again.');
        }
      }
    }, 5000);
  };

  const getHeartColor = (percentage) => {
    if (percentage >= 80) return '#ff1744';
    if (percentage >= 60) return '#ff5722';
    if (percentage >= 40) return '#ff9800';
    return '#9c27b0';
  };

  const generateShareableLink = () => {
    if (!result) return '';
    
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      type: 'love',
      name1: result.name1,
      name2: result.name2,
      percentage: result.percentage,
      category: result.category
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const shareResult = async (platform) => {
    const shareUrl = generateShareableLink();
    const shareText = `💘 Love Calculator Result

${result.name1} ♥ ${result.name2}

${result.emoji} ${result.percentage}% Love Match!
✨ ${result.category}

${result.message}

Calculated with Age & Love Calculator`;
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n🔗 ${shareUrl}`);
        alert('✅ Share link copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = `${shareText}\n\n🔗 ${shareUrl}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Share link copied to clipboard!');
      }
    } else if (platform === 'whatsapp') {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n🔗 ${shareUrl}`)}`;
      window.open(whatsappUrl, '_blank');
      trackSocialShare('whatsapp', 'love');
    } else if (platform === 'facebook') {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      window.open(facebookUrl, '_blank');
      trackSocialShare('facebook', 'love');
    } else if (platform === 'twitter') {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(twitterUrl, '_blank');
      trackSocialShare('twitter', 'love');
    }
  };

  return (
    <div className="calculator-card">
      <div className="calculator-header">
        <h2>💘 Love Calculator</h2>
        <p>Discover your love compatibility percentage</p>
        <div className="disclaimer">
          <p>⚠️ <strong>Disclaimer:</strong> This love calculator is meant for fantasy and entertainment purposes only. Results are not real or scientifically accurate. Please enjoy responsibly!</p>
        </div>
      </div>
      
      <div className="input-group">
        <label htmlFor="name1">👤 Your name:</label>
        <input
          type="text"
          id="name1"
          name="name1"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          placeholder="Enter your name"
          maxLength="30"
          autoComplete="off"
          autoCapitalize="words"
        />
      </div>

      <div className="input-group image-upload-group">
        <label htmlFor="profileImage1">📷 Your Photo (Optional)</label>
        <div className="image-upload-container">
          {profileImageUrl1 ? (
            <div className="image-preview">
              <img src={profileImageUrl1} alt="Your Profile" className="preview-image" />
              <button type="button" className="remove-image-btn" onClick={removeImage1}>
                ❌ Remove
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                id="profileImage1"
                name="profileImage1"
                accept="image/*"
                onChange={handleImageUpload1}
                className="file-input"
              />
              <label htmlFor="profileImage1" className="upload-label">
                📸 Choose Photo
              </label>
              <p className="upload-hint">Max 5MB • JPG, PNG, GIF</p>
            </div>
          )}
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="name2">👥 Partner's name:</label>
        <input
          type="text"
          id="name2"
          name="name2"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          placeholder="Enter partner's name"
          maxLength="30"
          autoComplete="off"
          autoCapitalize="words"
        />
      </div>

      <div className="input-group image-upload-group">
        <label htmlFor="profileImage2">📷 Partner's Photo (Optional)</label>
        <div className="image-upload-container">
          {profileImageUrl2 ? (
            <div className="image-preview">
              <img src={profileImageUrl2} alt="Partner Profile" className="preview-image" />
              <button type="button" className="remove-image-btn" onClick={removeImage2}>
                ❌ Remove
              </button>
            </div>
          ) : (
            <div className="upload-placeholder">
              <input
                type="file"
                id="profileImage2"
                name="profileImage2"
                accept="image/*"
                onChange={handleImageUpload2}
                className="file-input"
              />
              <label htmlFor="profileImage2" className="upload-label">
                📸 Choose Photo
              </label>
              <p className="upload-hint">Max 5MB • JPG, PNG, GIF</p>
            </div>
          )}
        </div>
      </div>

      <div className="button-group">
        <button className="calculate-btn love-gradient-btn" onClick={calculateLove}>
          💖 Calculate Love Match
        </button>
        <button className="clear-btn" onClick={clearResult}>
          Clear
        </button>
      </div>

      {/* Video Ad Modal */}
      {showVideoAd && (
        <div className="video-ad-modal">
          <div className="video-ad-content">
            <h3>🎥 Loading your download...</h3>
            <div className="video-placeholder">
              <p>Video Advertisement</p>
              <div className="ad-timer">5s</div>
            </div>
            <p>Your download will start automatically after the ad</p>
          </div>
        </div>
      )}

      {result && (
        <div className="result-container love-result colorful-love-result" ref={resultRef} style={{padding: '2rem', margin: '1rem 0'}}>
          <div className="love-result-header professional-love-header">
            <div className="love-couple-photos">
              {profileImageUrl1 && (
                <div className="love-profile-image left">
                  <img src={profileImageUrl1} alt="Your Profile" className="love-result-profile-image" />
                </div>
              )}
              <h3>💖 {result.name1} ♥ {result.name2}</h3>
              {profileImageUrl2 && (
                <div className="love-profile-image right">
                  <img src={profileImageUrl2} alt="Partner Profile" className="love-result-profile-image" />
                </div>
              )}
            </div>
            <span className="love-emoji-big">{result.emoji}</span>
            <div className="compatibility-badge">
              <span className="compatibility-text">Compatibility Score</span>
            </div>
            <div className="love-download-share-section">
              <button className="download-btn love-download" onClick={downloadResult}>
                💕 Share Love Result
              </button>
              <div className="share-buttons">
                <h4 className="share-title">📤 Share Your Love Result</h4>
                <div className="share-button-group">
                  <button className="share-btn copy-btn" onClick={() => shareResult('copy')}>
                    📋 Copy Link
                  </button>
                  <button className="share-btn whatsapp-btn" onClick={() => shareResult('whatsapp')}>
                    💬 WhatsApp
                  </button>
                  <button className="share-btn facebook-btn" onClick={() => shareResult('facebook')}>
                    📘 Facebook
                  </button>
                  <button className="share-btn twitter-btn" onClick={() => shareResult('twitter')}>
                    🐦 Twitter
                  </button>
                </div>
              </div>
            </div>
            <div className="website-watermark">
              <p>🌟 {config.app.name}</p>
            </div>
          </div>
          
          <div className="love-percentage-new">
            <div 
              className="love-circle-new"
              style={{ 
                background: `conic-gradient(from 0deg, ${getHeartColor(result.percentage)} 0deg, ${getHeartColor(result.percentage)} ${result.percentage * 3.6}deg, #f0f0f0 ${result.percentage * 3.6}deg, #f0f0f0 360deg)` 
              }}
            >
              <div className="love-circle-inner">
                <span className="percentage-value-new">{result.percentage}%</span>
                <span className="percentage-label">Love Match</span>
              </div>
            </div>
          </div>

          <div className="love-category-new">
            <h4 className="category-title">{result.category}</h4>
          </div>

          <div className="love-message-new">
            <p className="message-text">{result.message}</p>
          </div>

          <div className="love-hearts-new">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`heart-new ${i < Math.floor(result.percentage / 20) ? 'filled' : ''}`}
              >
                💖
              </span>
            ))}
          </div>
          
          <div className="love-disclaimer">
            <p>🎭 <em>Remember: This is for entertainment only! Real love is about connection, understanding, and shared values.</em></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoveCalculator;