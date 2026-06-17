const axios = require('axios');

const api = axios.create({
  baseURL: 'https://purecoco-e-commerce.onrender.com/api',
});

api.interceptors.request.use(config => {
  console.log('Full URL will be:', axios.getUri(config));
  return config;
});

api.post('/auth/register').catch(() => { });
