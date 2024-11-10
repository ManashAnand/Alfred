# Use Ubuntu as the base image
FROM ubuntu:22.04

# Install Python, curl, and other dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean

# Rest of your Dockerfile continues as before
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN python3 -m venv venv
ENV PATH="/app/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 3000 8000
# ... existing code ...
CMD ["/bin/bash", "-c", ". venv/bin/activate && npm run dev"]
