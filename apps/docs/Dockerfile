FROM node:20-slim

WORKDIR /app
COPY . .

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build

EXPOSE 4000
CMD ["pnpm", "start"]
