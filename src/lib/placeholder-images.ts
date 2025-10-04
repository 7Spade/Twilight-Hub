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
 * @param id The ID of the placeholder image (e.g., "avatar-1", "org-logo-2").
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

// Export all images if needed, though getPlaceholderImage is preferred.
export const AllPlaceholderImages: ImagePlaceholder[] = Array.from(imageMap.values());
