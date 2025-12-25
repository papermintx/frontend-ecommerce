
// Default fallback image if none provided or error
export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80';

// API Base URL - points to hosted backend server for image loading
const BASE_URL = 'https://stylemarket.web.id';

export const getImageUrl = (path: string | undefined | null, cacheBust: boolean = true): string => {
    if (!path) return FALLBACK_IMAGE;

    // Normalize backslashes to forward slashes
    const cleanPath = path.replace(/\\/g, '/');

    // If it's already an absolute URL, return as is
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
    }

    // Heuristic: If it doesn't start with /uploads/ and isn't root, assume it needs /uploads/
    // This helps if the DB only stores the filename
    let finalPath = cleanPath;
    if (!cleanPath.startsWith('/uploads/') && !cleanPath.startsWith('uploads/')) {
        // Only prepend if it looks like a filename (not starting with /) or verify logic
        // But to be safe based on spec, let's try to ensure it maps to uploads if seemingly simple filename
        // However, we must be careful not to break valid other paths.
        // Let's just ensure it starts with /
        finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

        // OPTIONAL: If we are sure all images are in uploads, we could force it.
        // Given the error 'not matching database', user might mean they uploaded 'shoe.jpg' and getting 404.
        // Let's try to detect if it's missing 'uploads'
        if (!finalPath.includes('/uploads/')) {
            finalPath = `/uploads${finalPath}`;
        }
    } else {
        finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    }

    const fullUrl = `${BASE_URL}${finalPath}`;

    // Add cache-busting timestamp to force browser to reload updated images
    if (cacheBust) {
        const separator = fullUrl.includes('?') ? '&' : '?';
        return `${fullUrl}${separator}t=${Date.now()}`;
    }

    return fullUrl;
};
