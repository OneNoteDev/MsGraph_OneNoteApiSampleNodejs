module.exports = {
  // App's API information - replace with your own values
  clientId: process.env.CLIENT_ID || 'YOUR_ID_HERE',
  clientSecret: process.env.CLIENT_SECRET || 'YOUR_SECRET_HERE',
  redirectUrl: process.env.REDIRECT_URI || 'http://localhost:3000/callback'
};
