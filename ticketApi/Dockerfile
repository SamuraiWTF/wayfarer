# Base image
FROM node:14-slim

WORKDIR /app

# Copy and install requirements
COPY package*.json ./
RUN npm install

# Copy our app into the image. Doing this as a separate step creates a separate "layer"
# so if the application changes but the requirements.txt does not, the next image build
# process will start here instead of above.
COPY . .

EXPOSE 3000
CMD npm run start