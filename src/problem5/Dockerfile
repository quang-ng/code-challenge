# syntax=docker/dockerfile:1
FROM node:20-alpine AS base

WORKDIR /app

# Install openssl for Prisma on alpine
RUN apk add --no-cache openssl

COPY package.json package-lock.json tsconfig.json ./
COPY prisma ./prisma

RUN npm ci

COPY src ./src

# Build
RUN npm run build && npx prisma generate

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY package.json .

EXPOSE 3000

CMD ["npm", "run", "start:migrate"]


