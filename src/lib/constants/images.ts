/**
 * Constantes pour les URLs d'images par défaut depuis internet
 * Ces images sont hébergées sur des services gratuits et fiables
 */

// Images de salons par défaut depuis Unsplash
export const SALON_DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=300&fit=crop"
];

// Images de services par défaut depuis Unsplash
export const SERVICE_DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1599351431622-5dc597f5a782?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1527799820374-df8d0d3eb1e7?w=400&h=300&fit=crop"
];

// Image de profil par défaut
export const PROFILE_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";

// Image de bannière par défaut
export const BANNER_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1599351431622-5dc597f5a782?w=1200&h=400&fit=crop";

/**
 * Fonction pour obtenir une image aléatoire depuis la liste
 */
export const getRandomImage = (type: 'salon' | 'service' = 'salon'): string => {
  const images = type === 'salon' ? SALON_DEFAULT_IMAGES : SERVICE_DEFAULT_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
};

/**
 * Fonction pour vérifier si une URL est valide
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};