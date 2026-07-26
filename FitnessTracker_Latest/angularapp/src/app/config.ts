export const config = {
  // Deployed Render backend and ML URLs
  productionApiUrl: 'https://fitnesstracker-backend-ijcv.onrender.com',
  productionMlUrl: 'https://fitness-tracker-ai-97qn.onrender.com',

  get apiUrl(): string {
    if (window.location.origin.includes('examly.io') || window.location.pathname.includes('/proxy/')) {
      return `${window.location.origin}/proxy/8080`;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080';
    }
    return this.productionApiUrl;
  },

  get mlUrl(): string {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:5000/api/predict';
    }
    return `${this.productionMlUrl}/api/predict`;
  }
};
