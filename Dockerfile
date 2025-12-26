# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.19.4
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Install dependencies separately to leverage Docker layer caching
COPY package*.json ./
ARG VITE_OS_API_BASE_URL=http://localhost:3333
ARG VITE_OS_APP_TITLE="Console de Ordens de Serviço"
ENV VITE_OS_API_BASE_URL=$VITE_OS_API_BASE_URL
ENV VITE_OS_APP_TITLE=$VITE_OS_APP_TITLE
RUN npm ci

FROM base AS os-storybook

# Copy the rest of the source code for Storybook
COPY . .

EXPOSE 6006

# Command to run Storybook in dev mode
CMD ["npm", "run", "storybook", "--", "--host", "0.0.0.0", "--port", "6006"]

FROM base AS os-dev

# Copy the rest of the source code for Vite dev server
COPY . .

EXPOSE 5173

# Default command starts the Vite dev server accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM base AS os-ci

# Copy the full codebase for CI tasks (lint, tests, build)
COPY . .
ENV NODE_ENV=test
ENV CI=true
RUN npm run lint && npm run test && npm run build
