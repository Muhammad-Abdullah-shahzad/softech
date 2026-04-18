#!/bin/bash

# FairGig Monorepo Start Script (Robust Version)
ROOT_DIR=$(pwd)
export PATH=/usr/local/bin:/Users/mac/Library/Python/3.9/bin:$PATH

echo "🚀 Starting FairGig Microservices..."

# Function to clear ports
clear_ports() {
    echo "🧹 Cleaning up ports..."
    local ports=(8000 5000 5002 5003 5004 5005 5173)
    for port in "${ports[@]}"; do
        pid=$(lsof -ti :$port)
        if [ ! -z "$pid" ]; then
            echo "Killing process on port $port"
            kill -9 $pid 2>/dev/null
        fi
    done
}

# Run cleanup
clear_ports

# Function to start a service
start_node_service() {
    local dir=$1
    local port=$2
    local name=$3
    echo -e "🟢 \033[1;32mStarting $name\033[0m on port $port..."
    cd "$ROOT_DIR/$dir" && (npm run dev > /dev/null 2>&1 &)
}

start_python_service() {
    local dir=$1
    local port=$2
    local name=$3
    echo -e "🟢 \033[1;32mStarting $name\033[0m on port $port..."
    cd "$ROOT_DIR/$dir" && (python3 -m uvicorn app.main:app --port $port > /dev/null 2>&1 &)
}

# Start all services
start_python_service "fair-gig-monorepo/services/anomaly-detection-service" 8000 "Anomaly Detection"
start_node_service "fair-gig-monorepo/services/authService" 5000 "Auth Service"
start_node_service "fair-gig-monorepo/services/earnings-service" 5002 "Earnings Service"
start_node_service "fair-gig-monorepo/services/grievance-service" 5003 "Grievance Service"
start_node_service "fair-gig-monorepo/services/analytics-service" 5004 "Analytics Service"
start_node_service "fair-gig-monorepo/services/certificate-service" 5005 "Certificate Service"
start_node_service "client" 5173 "Frontend"

echo "------------------------------------------------"
echo "All start commands dispatched."
echo "Access the dashboard at http://localhost:5173"
echo "Check your terminal for dependency errors (npm install might be needed)."
