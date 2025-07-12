// Ortam farkını otomatik yöneten yardımcı fonksiyon
export function getApiUrl(path: string) {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('NEXT_PUBLIC_API_URL environment variable is not set!');
    }
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }
  // Geliştirme ortamında doğrudan backend'e yönlendir
  return `http://localhost:5000${path}`;
}
