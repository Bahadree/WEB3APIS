// Ortam farkını otomatik yöneten yardımcı fonksiyon
export function getApiUrl(path: string) {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');
    }
    // Sonunda / varsa kaldır
    const baseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/?$/, '');
    return `${baseUrl}${path}`;
  }
  // Docker development ortamında backend container adı kullanılmalı
  return `http://backend:5000${path}`;
}
