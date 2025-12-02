# Use a solid base image (Debian-based Node)
FROM node:18-bullseye

# 1. Install System Dependencies
# We need LibreOffice (for DOCX->PDF) and Ghostscript/GraphicsMagick (for Images)
RUN apt-get update && apt-get install -y \
    libreoffice \
    ghostscript \
    graphicsmagick \
    && rm -rf /var/lib/apt/lists/*

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package definitions first (for better caching)
COPY package.json package-lock.json* ./

# 4. Install Node dependencies
RUN npm install

# 5. Copy the rest of your backend code
COPY . .

# 6. Expose the port Render expects
EXPOSE 10000

# 7. Start the server
CMD ["node", "server.js"]