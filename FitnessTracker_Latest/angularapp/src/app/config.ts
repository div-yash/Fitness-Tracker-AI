export const config = {
  // Replace these with your actual deployed Render backend and ML URLs
  productionApiUrl: 'https://fitnesstracker-backend-api.onrender.com',
  productionMlUrl: 'https://fitnesstracker-ml-service.onrender.com',

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
