# Isolated Sandbox Java Execution Service
FROM eclipse-temurin:21-jdk-alpine

# Install Node.js & npm
RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Run as non-root unprivileged user for security
RUN addgroup -S sandboxgroup && adduser -S sandboxuser -G sandboxgroup
RUN mkdir -p /tmp/codevoyage_sandbox && chown -R sandboxuser:sandboxgroup /tmp/codevoyage_sandbox /app

USER sandboxuser

EXPOSE 5050

CMD ["node", "dist/index.js"]
