FROM node:20-slim

WORKDIR /app
COPY . .

COPY pnpm-workspace.yaml package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 4000
CMD ["pnpm", "start"]
