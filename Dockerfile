FROM node:lts AS development

WORKDIR /app

# 1. First copy package.json and yarn.lock (for caching)
COPY package.json yarn.lock ./

# 2. Install all dependencies (including devDependencies)
RUN npm install

# 3. Copy the rest of the app
COPY . .

# 4. Build the Next.js app
RUN npm run build

# 5. Expose the port (if your app runs on 3010)
EXPOSE 3001

# 6. Run in development mode (with Hot Reload)
CMD ["npm", "start"]
