import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get the correct API URL based on the platform
const getApiUrl = () => {
  // Access environment variables through Expo's Constants.manifest.extra
  const env = Constants.expoConfig?.extra || {};
  
  if (Platform.OS === 'web') {
    return env.API_URL_WEB || 'http://192.168.3.168:3000/api';
  }
  
  if (Platform.OS === 'ios') {
    return env.API_URL_IOS || 'http://192.168.3.168:3000/api';
  }
  
  if (Platform.OS === 'android') {
    return env.API_URL_ANDROID || 'http://10.0.2.2:3000/api';
  }
  
  return env.API_URL_DEFAULT || 'http://192.168.3.168:3000/api';
};

const API_URL = getApiUrl();

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

export const uploadImage = async (uri: string, endpoint: 'process-map' | 'process-road', maxContain?: number) => {
  try {
    const formData = new FormData();
    const filename = uri.split('/').pop() || 'image.jpg';
    
    // Handle file URI differently for web and native platforms
    if (Platform.OS === 'web') {
      formData.append('image', {
        uri,
        name: filename,
        type: 'image/jpeg',
      } as any);
    } else {
      // For native platforms, we need to read the file first
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }
      
      formData.append('image', {
        uri: uri,
        name: filename,
        type: 'image/jpeg',
      } as any);
    }

    if (maxContain) {
      formData.append('maxContain', maxContain.toString());
    }

    const response = await apiClient.post(`/${endpoint}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const fetchGraphData = async () => {
  try {
    const response = await apiClient.get('/graph-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching graph data:', error);
    throw error;
  }
};

export const fetchRoadGraphData = async () => {
  try {
    const response = await apiClient.get('/road-graph-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching road graph data:', error);
    throw error;
  }
};
