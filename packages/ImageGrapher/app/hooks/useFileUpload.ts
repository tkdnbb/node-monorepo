import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../services/api';

interface UseFileUploadProps {
  activeTab: 'full' | 'road';
  onUploadSuccess?: (data: any) => void;
}

const useFileUpload = ({ activeTab, onUploadSuccess }: UseFileUploadProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxContain, setMaxContain] = useState(2);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
      return result.assets[0].uri;
    }
    return null;
  };

  const handleUpload = async () => {
    if (!imageUri) {
      setError('Please select an image first');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const endpoint = activeTab === 'full' ? 'process-map' : 'process-road';
      const data = await uploadImage(imageUri, endpoint, maxContain);
      onUploadSuccess?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return {
    imageUri,
    loading,
    error,
    maxContain,
    setMaxContain,
    pickImage,
    handleUpload,
  };
};

export default useFileUpload;
