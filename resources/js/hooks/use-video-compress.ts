import { useCallback } from 'react';

export const MAX_VIDEO_SIZE_MB = 100;
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_FILE_SIZE_MB  = 100;

export function useVideoCompress() {
    const compressVideo = useCallback(async (file: File): Promise<File> => {
        return file; 
    }, []);

    return {
        compressVideo,
        progress:    0,
        compressing: false,
    };
}

export function validateFileSize(file: File): string | null {
    const mb = file.size / (1024 * 1024);

    if (file.type.startsWith('video/') && mb > MAX_VIDEO_SIZE_MB)
        return `El video pesa ${mb.toFixed(1)} MB. Máximo permitido: ${MAX_VIDEO_SIZE_MB} MB.`;

    if (file.type.startsWith('image/') && mb > MAX_IMAGE_SIZE_MB)
        return `La imagen pesa ${mb.toFixed(1)} MB. Máximo permitido: ${MAX_IMAGE_SIZE_MB} MB.`;

    if (mb > MAX_FILE_SIZE_MB)
        return `El archivo pesa ${mb.toFixed(1)} MB. Máximo permitido: ${MAX_FILE_SIZE_MB} MB.`;

    return null;
}
