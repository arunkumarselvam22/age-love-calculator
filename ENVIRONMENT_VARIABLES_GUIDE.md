# Environment Variables Guide

## What are Environment Variables?

Environment variables are configuration values stored outside your code that can change between different environments (development, staging, production). They're essential for:

- **Security**: Keeping API keys and sensitive data out of your code
- **Flexibility**: Different configurations for dev/prod environments  
- **Team Collaboration**: Each developer can have their own local settings
- **Deployment**: Easy configuration updates without code changes

## 📁 Files in Your Project

### `.env.example`
- Template file showing all available environment variables
- Safe to commit to git (contains no sensitive data)
- Copy this to create your local environment file

### `.env.local` 
- Your actual environment variables with real values
- **NEVER commit this to git** (already in `.gitignore`)
- Used for local development

### `src/config.js`
- Reads environment variables and makes them available to your app
- Provides validation and fallback values
- Central configuration management

## 🔧 Setup Instructions

### 1. Copy the Template
```bash
# Copy the example file to create your local environment
cp .env.example .env.local
```

### 2. Fill in Your Values
Edit `.env.local` with your actual values:

```env
# Replace with your actual Google Analytics ID
VITE_GOOGLE_ANALYTICS_ID=G-ABC123DEF456

# Replace with your actual AdSense Publisher ID  
VITE_ADSENSE_CLIENT_ID=ca-pub-1234567890123456

# Replace with your actual domain
VITE_DOMAIN=my-calculator.com
```

### 3. Restart Development Server
```bash
# Environment variables are loaded on startup
npm run dev
```

## 🌐 Environment Variables Used

### Google Services
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics Measurement ID | `G-ABC123DEF456` | Production |
| `VITE_ADSENSE_CLIENT_ID` | AdSense Publisher ID | `ca-pub-1234567890123456` | For Ads |

### AdSense Ad Slots  
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_ADSENSE_HEADER_SLOT` | Header banner ad | `1111111111` | For Ads |
| `VITE_ADSENSE_SIDEBAR_SLOT` | Sidebar ad | `2222222222` | For Ads |
| `VITE_ADSENSE_FOOTER_SLOT` | Footer ad | `3333333333` | For Ads |
| `VITE_ADSENSE_MOBILE_SLOT` | Mobile banner ad | `4444444444` | For Ads |

### Application Settings
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_APP_NAME` | Application name | `My Calculator` | No |
| `VITE_DOMAIN` | Your website domain | `my-site.com` | Production |
| `VITE_API_URL` | Backend API URL | `https://api.my-site.com` | If using API |
| `VITE_CONTACT_EMAIL` | Contact email | `contact@my-site.com` | No |

### Feature Flags
| Variable | Description | Values | Default |
|----------|-------------|--------|---------|
| `VITE_ENABLE_ADSENSE` | Enable/disable ads | `true`/`false` | `false` |
| `VITE_ENABLE_ANALYTICS` | Enable/disable tracking | `true`/`false` | `false` |
| `VITE_ENABLE_SOCIAL_SHARING` | Enable social features | `true`/`false` | `true` |
| `VITE_MAX_IMAGE_SIZE` | Max upload size (MB) | `5` | `5` |

## 🔍 How to Get API Keys

### Google Analytics ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create account or sign in
3. Create a new property for your website
4. Get the Measurement ID (format: `G-XXXXXXXXXX`)

### AdSense Publisher ID
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Create account and get approved
3. Go to Account → Account Information
4. Copy your Publisher ID (format: `ca-pub-xxxxxxxxxxxxxxxxx`)

### AdSense Ad Unit IDs
1. In AdSense dashboard, go to Ads → Ad units
2. Create new ad units for different placements
3. Copy the Ad unit ID for each placement

## 💻 Using in Your Code

### Import Configuration
```javascript
import { config } from './config.js';

// Use the configuration
console.log(config.app.name); // "Age & Love Calculator"
console.log(config.features.enableAdsense); // true/false
```

### Conditional Features
```javascript
// Only load AdSense if enabled
if (config.features.enableAdsense && config.adsenseClientId) {
  // Load AdSense script
}

// Only track analytics if enabled
if (config.features.enableAnalytics && config.googleAnalyticsId) {
  // Initialize Google Analytics
}
```

### Environment-Specific Behavior
```javascript
if (config.isDevelopment) {
  console.log('Running in development mode');
}

if (config.isProduction) {
  // Production-only features
}
```

## 🚀 Deployment Setup

### Vercel
1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"  
3. Add each variable:
   - Name: `VITE_GOOGLE_ANALYTICS_ID`
   - Value: `G-ABC123DEF456`
   - Environment: Production

### Netlify
1. Go to Site settings → Environment variables
2. Add each variable with name and value
3. Deploy your site

### Other Platforms
Most hosting platforms have environment variable settings in their dashboard. Add the variables there with the `VITE_` prefix.

## ⚠️ Security Best Practices

### DO:
- ✅ Use environment variables for all API keys
- ✅ Add `.env.local` to `.gitignore`
- ✅ Use different values for development/production
- ✅ Validate required variables in production

### DON'T:
- ❌ Commit `.env.local` to git
- ❌ Share environment files in chat/email
- ❌ Put sensitive data directly in code
- ❌ Use production keys in development

## 🔧 Troubleshooting

### Variables Not Loading
```bash
# Restart development server
npm run dev

# Check if file exists
ls -la .env.local

# Verify variable names start with VITE_
cat .env.local | grep VITE_
```

### Production Issues
```bash
# Check Vercel deployment logs
vercel logs

# Verify environment variables are set in platform dashboard
# Check browser console for validation warnings
```

### Missing Variables
The `config.js` file will warn you about missing required variables in production. Check the browser console for warnings.

## 📝 Example Usage

### Complete Setup Example
```bash
# 1. Copy template
cp .env.example .env.local

# 2. Edit with your values
nano .env.local

# 3. Restart development server (environment variables are loaded on startup)
npm run dev
```

### Usage in Components
```javascript
// Import configuration
import { config } from './config.js';

// Use feature flags
if (config.features.enableAnalytics) {
  // Initialize analytics
}

// Use app settings  
console.log(config.app.name); // "Age & Love Calculator"
console.log(config.features.maxImageSize); // 5

// Use AdSense settings
if (config.features.enableAdsense && config.adsenseClientId) {
  // Load AdSense ads
}
```

### Analytics Integration
```javascript
// Track calculator usage
import { trackCalculatorUsage } from './GoogleAnalytics.js';
trackCalculatorUsage('age', true); // true = has image

// Track downloads
import { trackDownload } from './GoogleAnalytics.js';
trackDownload('love', 'john-loves-jane-2025-09-17.png');

// Track social sharing
import { trackSocialShare } from './GoogleAnalytics.js';
trackSocialShare('facebook', 'age');
```

---

## 🎯 Benefits of This Setup

- **Security**: API keys are protected
- **Flexibility**: Easy environment switching  
- **Team-friendly**: Everyone can have their own settings
- **Production-ready**: Proper configuration management
- **Feature flags**: Easy to enable/disable features
- **Validation**: Warns about missing required variables

Your Age & Love Calculator is now properly configured with environment variables! 🎉