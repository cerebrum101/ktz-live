FROM node:22-alpine
RUN apk add --no-cache g++
WORKDIR /app
COPY . .
RUN g++ -std=c++17 -O2 core.cpp -o core && npm test
EXPOSE 3000
CMD ["node","server.js"]
