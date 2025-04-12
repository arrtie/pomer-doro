FROM node:23-slim

# Update package lists and install git
# Combine RUN commands to reduce layers
# Clean up apt cache to reduce image size
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /opt/pomer-doro