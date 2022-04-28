FROM node:16-alpine as build
WORKDIR /app
COPY package.json ./
RUN apk add --no-cache python3 make g++
RUN npm install --force
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/out /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
