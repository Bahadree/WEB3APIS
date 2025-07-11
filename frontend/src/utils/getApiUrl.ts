// Ortam farkını otomatik yöneten yardımcı fonksiyon
export function getApiUrl(path: string) {
  if (process.env.NODE_ENV === 'production') {
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }
  return `/api${path}`;
}
