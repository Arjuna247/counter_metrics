# Counter Metrics

A full-stack application for tracking button click metrics with real-time monitoring using Prometheus and Grafana.

## Overview

This project demonstrates a complete monitoring solution that tracks user interactions (button clicks) and visualizes them through Prometheus and Grafana. It includes custom metrics for click counts, intervals, and press duration.

## Architecture

- **Frontend**: HTML/JavaScript UI for user interaction
- **Backend**: Node.js/Express API with Prometheus metrics
- **Prometheus**: Time-series database for metrics storage
- **Grafana**: Visualization dashboard
- **Node Exporter**: System-level metrics
- **Docker Compose**: Container orchestration

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Quick Start

### Using Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Access the services:
# - Frontend: http://localhost:5500
# - Backend Metrics: http://localhost:3002/metrics
# - Prometheus: http://localhost:9095
# - Grafana: http://localhost:3001
# - Node Exporter: http://localhost:9100
```

### Local Development

**Backend:**
```bash
cd backend
npm install
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## Services & Ports

| Service | Internal Port | External Port | URL |
|---------|--------------|---------------|-----|
| Frontend | 5500 | 5500 | http://localhost:5500 |
| Backend | 3001 | 3002 | http://localhost:3002 |
| Prometheus | 9090 | 9095 | http://localhost:9095 |
| Grafana | 3000 | 3001 | http://localhost:3001 |
| Node Exporter | 9100 | 9100 | http://localhost:9100 |

## Metrics Collected

### Custom Metrics
- `button_click_count_total` (Counter): Total number of button clicks
- `button_click_interval_ms` (Gauge): Time between consecutive clicks
- `button_click_duration_ms` (Gauge): How long the button was pressed

### System Metrics
- CPU, memory, disk usage (via Node Exporter)
- Container metrics (via cAdvisor on Linux/macOS)

## Features

✅ Real-time button click tracking
✅ Prometheus metrics integration
✅ Grafana visualization support
✅ Docker health checks
✅ Auto-restart on failure
✅ Input validation and error handling
✅ CORS protection
✅ Environment-based configuration

## Recent Fixes (v1.0)

All critical errors have been resolved:

1. ✅ Removed orphaned code from frontend script
2. ✅ Fixed Dockerfile CMD to use correct filename
3. ✅ Fixed race condition in duration calculation
4. ✅ Added environment-based backend URL configuration
5. ✅ Added comprehensive fetch error handling
6. ✅ Added DOM element null checks
7. ✅ Created proper package.json for frontend
8. ✅ Added Docker health checks and restart policies
9. ✅ Added input validation in backend
10. ✅ Improved CORS configuration with origin restrictions

## Configuration

### Backend URL

The frontend automatically detects the environment:
- **Docker**: Uses internal hostname `http://backend:3001`
- **Localhost**: Uses exposed port `http://localhost:3002`

You can override this by setting `window.BACKEND_URL` in `frontend/config.js`.

### Environment Variables

Set in `docker-compose.yml`:
- `NODE_ENV=production` (backend)
- `BACKEND_URL=http://backend:3001` (frontend)

## Platform Notes

### Windows
- cAdvisor is disabled by default (incompatible volume mounts)
- All other services work normally

### Linux/macOS
- Uncomment cAdvisor service in `docker-compose.yml`
- Uncomment cAdvisor job in `prometheus.yml`

## Grafana Setup

1. Access Grafana at http://localhost:3001
2. Default credentials: `admin` / `admin`
3. Add Prometheus data source:
   - URL: `http://prometheus:9090`
4. Create dashboards using the custom metrics

## Troubleshooting

**Frontend can't connect to backend:**
- Check if backend container is healthy: `docker ps`
- Verify backend URL in browser console
- Ensure CORS origins include your frontend URL

**Prometheus not scraping metrics:**
- Check backend `/metrics` endpoint: http://localhost:3002/metrics
- Verify Prometheus targets: http://localhost:9095/targets

**Container won't start:**
- Check logs: `docker-compose logs <service-name>`
- Verify health checks: `docker inspect <container-name>`

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
npm test

# Frontend tests (if implemented)
cd frontend
npm test
```

### Building for Production
```bash
docker-compose build --no-cache
docker-compose up -d
```

## Project Structure

```
counter_metrics/
├── backend/
│   ├── backend.js          # Express server with Prometheus
│   ├── package.json        # Dependencies
│   └── Dockerfile          # Container config
├── frontend/
│   ├── index.html          # UI
│   ├── script.js           # Click tracking logic
│   ├── config.js           # Environment config
│   ├── style.css           # Styling
│   ├── server.js           # Static file server
│   ├── package.json        # Dependencies
│   └── Dockerfile          # Container config
├── docker-compose.yml      # Service orchestration
├── prometheus.yml          # Prometheus config
└── README.md              # This file
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
