FROM node:20-alpine
WORKDIR /app


ARG GROQ_API_KEY
ENV GROQ_API_KEY=$GROQ_API_KEY

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]