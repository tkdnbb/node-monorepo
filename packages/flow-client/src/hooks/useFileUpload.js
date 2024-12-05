// @flow
import { useState } from 'react';
import { uploadMapImage, uploadRoadMapImage } from '../services/api';
import type { UseFileUploadProps } from '../types';

type UseFileUploadReturn = {
  file: ?File,
  loading: boolean,
  error: ?string,
  maxContain: number,
  setMaxContain: (number) => void,
  handleFileChange: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  handleUpload: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>
};

export function useFileUpload({ activeTab, onUploadSuccess }: UseFileUploadProps): UseFileUploadReturn {
  const [file, setFile] = useState<?File>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<?string>(null);
  const [maxContain, setMaxContain] = useState<number>(2);

  const handleFileChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const selectedFile = e.currentTarget.files?.[0];
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    setFile(selectedFile || null);
    setError(null);
  };

  const handleUpload = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    /** Capture the form element before async operations */
    const form = e.currentTarget;
    setLoading(true);
    setError(null);

    try {
      const data = activeTab === 'full'
        ? await uploadMapImage(file, maxContain)
        : await uploadRoadMapImage(file, maxContain);
      
      onUploadSuccess(data);
      setFile(null);
      // Reset form using the captured reference
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
