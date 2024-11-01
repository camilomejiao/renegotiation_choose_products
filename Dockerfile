FROM node:18.19-alpine3.19 as builder
WORKDIR /source
COPY package.json /source/
RUN npm install --force
# COPY .env /source/
COPY . /source/
RUN npm run build

FROM nginx:stable-alpine
RUN cp /usr/share/zoneinfo/America/Bogota /etc/localtime && \
  echo "America/Bogota" >/etc/timezone
WORKDIR /app
COPY --from=builder /source/build/ /app