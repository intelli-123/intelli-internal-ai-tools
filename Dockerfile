# 1. Use an official lightweight Node.js image
FROM node:20-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package files first (better caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm ci

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port the app runs on
EXPOSE 3100

# 7. Define the command to run the app
CMD ["npm", "run", "dev"]