import { useState } from 'react';
import { uploadMapImage, uploadRoadMapImage, GraphData } from '../services/api';
import { GraphType } from './useGraphData';

interface UseFileUploadProps {
  activeTab: GraphType;
  onUploadSuccess: (data: GraphData) => void;
}

export function useFileUpload({ activeTab, onUploadSuccess }: UseFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [maxContain, setMaxContain] = useState(2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setFile(selectedFile || null);
    setError(null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const data = activeTab === 'full'
        ? await uploadMapImage(file, maxContain)
        : await uploadRoadMapImage(file, maxContain);
      
      onUploadSuccess(data);
      setFile(null);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    file,
    loading,
    error,
    maxContain,
    setMaxContain,
    handleFileChange,
    handleUpload,
  };
}
