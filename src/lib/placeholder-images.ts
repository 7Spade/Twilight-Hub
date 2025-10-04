import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// Add a new hero image to the list
const heroImage = {
  id: "dashboard-hero",
  description: "Hero image for the main dashboard",
  imageUrl: "https://picsum.photos/seed/dashboard-hero/1200/800",
  imageHint: "futuristic dashboard"
};

// Create a map for quick lookups
const imageMap = new Map<string, ImagePlaceholder>();
data.placeholderImages.forEach(img => imageMap.set(img.id, img));
imageMap.set(heroImage.id, heroImage);

/**
 * Retrieves a placeholder image by its ID.
 * @param id The ID of the placeholder image (e.g., "org-logo-1", "org-logo-2").
 * @returns The ImagePlaceholder object.
 * @throws If an image with the given ID is not found.
 */
export function getPlaceholderImage(id: string): ImagePlaceholder {
    const image = imageMap.get(id);
    if (!image) {
        console.error(`Placeholder image with id "${id}" not found.`);
        // Return a default fallback to prevent crashes
        return {
            id: 'fallback',
            description: 'Fallback image',
            imageUrl: 'https://placehold.co/600x400/EEE/31343C',
            imageHint: 'placeholder'
        };
    }
    return image;
}

/**
 * 生成基於哈希值的頭像 URL
 * @param seed 種子字符串（如用戶名、郵箱等）
 * @param style 頭像風格
 * @returns 頭像 URL
 */
export function generateAvatarUrl(
    seed: string, 
    style: 'identicon' | 'initials' | 'bottts' | 'avataaars' | 'micah' = 'identicon'
): string {
    const baseUrl = 'https://api.dicebear.com/6.x';
    return `${baseUrl}/${style}/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * 生成多文化頭像 URL
 * @param seed 種子字符串
 * @returns Multiavatar URL
 */
export function generateMultiavatarUrl(seed: string): string {
    return `https://api.multiavatar.com/${encodeURIComponent(seed)}.svg`;
}

// Export all images if needed, though getPlaceholderImage is preferred.
// Note: Avatar images are now generated using hash-based avatars instead of static images
export const AllPlaceholderImages: ImagePlaceholder[] = Array.from(imageMap.values());
