FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM nginx:1.27.5-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=build /app/src/assets/images /usr/share/nginx/html/src/assets/images

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]