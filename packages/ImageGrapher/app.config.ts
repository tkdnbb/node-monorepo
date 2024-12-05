import 'dotenv/config';

export default {
  expo: {
    name: 'ImageGrapher',
    // ... other expo config
    extra: {
      API_URL_WEB: process.env.API_URL_WEB,
      API_URL_IOS: process.env.API_URL_IOS,
      API_URL_ANDROID: process.env.API_URL_ANDROID,
      API_URL_DEFAULT: process.env.API_URL_DEFAULT,
    },
  },
};
