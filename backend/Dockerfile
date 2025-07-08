FROM node:20.19.0-alpine

WORKDIR /app

# Sadece gerekli araçları kur
RUN apk add --no-cache curl git

# Paket dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm cache clean --force
RUN npm install --frozen-lockfile || npm install

# Kaynak kodunu kopyala
COPY . .

# uploads klasörü oluştur (opsiyonel, uygulama dosya yüklemesi yapıyorsa)
RUN mkdir -p uploads

# Uygulama portunu aç
EXPOSE 5000

# Health check (opsiyonel, Railway kendi health checkini kullanabilir)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Uygulamayı başlat
CMD ["npm", "start"]
