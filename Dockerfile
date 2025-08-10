FROM node:20.12.2-alpine AS stage

WORKDIR /app

COPY . .

RUN npm update && npm install
RUN npm run build \
  && mkdir -p dist/MMOMarket-frontend \
  && find dist -mindepth 1 -maxdepth 1 ! -name 'MMOMarket-frontend' -exec mv -t dist/MMOMarket-frontend {} +


FROM nginx:alpine

COPY --from=stage /app/dist/MMOMarket-frontend /usr/share/nginx/html/MMOMarket-frontend
COPY redirect-index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

