
FROM node:22

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

# Set the environment variable for the port
ENV PORT=3000
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
