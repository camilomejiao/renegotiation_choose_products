# syntax=docker/dockerfile:1
FROM oven/bun:1.3 as builder
WORKDIR /build
COPY package.json /build/
RUN bun install
COPY . /build/
RUN bun run build

FROM nginx:stable-alpine
RUN cp /usr/share/zoneinfo/America/Bogota /etc/localtime && \
    echo "America/Bogota" >/etc/timezone
WORKDIR /app
COPY --from=builder /build/build/ /app