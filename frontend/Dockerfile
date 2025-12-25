FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# For Vite/React, we host it so Docker can see it
CMD ["npm", "run", "dev", "--", "--host"]