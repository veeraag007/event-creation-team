# Builds the integrated Next.js landing, authentication and event discovery frontend.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_EVENTS_API_URL=http://localhost:8081
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start", "--", "--port", "3001"]
