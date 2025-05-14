
// This is a simplified utility to simulate Google Drive integration
// In a real application, this would be a Supabase Edge Function

/**
 * Simulates uploading a file to Google Drive
 * In a real app, this would be an API call to a Supabase Edge Function
 */
export const uploadToGoogleDrive = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ fileId: string; fileName: string }> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) onProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Generate a fake Google Drive file ID
        const fileId = `gdrive-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        resolve({
          fileId,
          fileName: file.name
        });
      }
    }, 100);
  });
};

/**
 * Simulates getting a preview URL for a Google Drive file
 * In a real app, this would return a real Google Drive preview URL
 */
export const getGoogleDrivePreviewUrl = (fileId: string): string => {
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Simulates getting a download URL for a Google Drive file
 * In a real app, this would return a real Google Drive download URL
 */
export const getGoogleDriveDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Simulates deleting a file from Google Drive
 * In a real app, this would be an API call to a Supabase Edge Function
 */
export const deleteFromGoogleDrive = async (fileId: string): Promise<void> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      console.log(`File ${fileId} deleted from Google Drive (simulated)`);
      resolve();
    }, 500);
  });
};
