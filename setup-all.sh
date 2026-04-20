#!/bin/bash

# Setup script for FairGig Monorepo
ROOT_DIR=$(pwd)
export PATH=/usr/local/bin:$PATH

echo "📦 Installing dependencies for all services..."

# Node services
services=(
    "fair-gig-monorepo/services/authService"
    "fair-gig-monorepo/services/earnings-service"
    "fair-gig-monorepo/services/grievance-service"
    "fair-gig-monorepo/services/analytics-service"
    "fair-gig-monorepo/services/certificate-service"
    "client"
)

export PATH=/usr/local/bin:/Users/mac/Library/Python/3.9/bin:$PATH

for service in "${services[@]}"; do
    echo "Installing dependencies for $service..."
    cd "$ROOT_DIR/$service" && npm install
    if [ "$service" == "client" ]; then
        echo "Ensuring Tailwind dependencies are present for client..."
        npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer
    fi
done

# Python services
echo "Installing dependencies for Python services..."
python3 -m pip install -r "$ROOT_DIR/fair-gig-monorepo/services/anomaly-detection-service/requirements.txt"
python3 -m pip install -r "$ROOT_DIR/fair-gig-monorepo/services/profile-service/requirements.txt"

echo "✅ Setup complete!"
