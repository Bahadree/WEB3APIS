FROM node:20.19.0-alpine

WORKDIR /app

# --- Ortam değişkenleri (örnekler, Railway'den build-time inject edilir) ---
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
ARG PORT
ENV PORT=$PORT
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG DB_HOST
ENV DB_HOST=$DB_HOST
ARG DB_PORT
ENV DB_PORT=$DB_PORT
ARG DB_NAME
ENV DB_NAME=$DB_NAME
ARG DB_USER
ENV DB_USER=$DB_USER
ARG DB_PASSWORD
ENV DB_PASSWORD=$DB_PASSWORD
ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL
ARG REDIS_HOST
ENV REDIS_HOST=$REDIS_HOST
ARG REDIS_PORT
ENV REDIS_PORT=$REDIS_PORT
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET
ARG JWT_REFRESH_SECRET
ENV JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
ARG JWT_EXPIRE
ENV JWT_EXPIRE=$JWT_EXPIRE
ARG JWT_REFRESH_EXPIRE
ENV JWT_REFRESH_EXPIRE=$JWT_REFRESH_EXPIRE
ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ARG APPLE_CLIENT_ID
ENV APPLE_CLIENT_ID=$APPLE_CLIENT_ID
ARG APPLE_TEAM_ID
ENV APPLE_TEAM_ID=$APPLE_TEAM_ID
ARG APPLE_KEY_ID
ENV APPLE_KEY_ID=$APPLE_KEY_ID
ARG APPLE_PRIVATE_KEY
ENV APPLE_PRIVATE_KEY=$APPLE_PRIVATE_KEY
ARG SMTP_HOST
ENV SMTP_HOST=$SMTP_HOST
ARG SMTP_PORT
ENV SMTP_PORT=$SMTP_PORT
ARG SMTP_USER
ENV SMTP_USER=$SMTP_USER
ARG SMTP_PASS
ENV SMTP_PASS=$SMTP_PASS
ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

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
  CMD curl -f http://backend:5000/health || exit 1

# Uygulamayı başlat
CMD ["npm", "start"]
