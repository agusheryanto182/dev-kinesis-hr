#!/bin/bash

# Kinesis HR Deployment Script
# This script helps deploy the Kinesis HR application with Docker Compose

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command_exists docker compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Setup environment variables
setup_environment() {
    print_info "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.template" ]; then
            cp env.template .env
            print_warning "Created .env file from template. Please update the values before continuing."
            print_info "Edit .env file with your actual configuration values:"
            print_info "  - Database credentials"
            print_info "  - NextAuth secret (generate with: openssl rand -base64 32)"
            print_info "  - Google OAuth credentials"
            print_info "  - Cloudinary credentials"
            print_info "  - Other API keys as needed"
            read -p "Press Enter after updating .env file..."
        else
            print_error ".env file not found and no template available"
            exit 1
        fi
    fi
    
    print_success "Environment variables configured"
}

# Initialize SSL certificates
init_ssl() {
    print_info "Initializing SSL certificates..."
    
    # Create a simple HTML file for Let's Encrypt verification
    mkdir -p nginx/html
    echo "<html><body><h1>Kinesis HR - SSL Verification</h1></body></html>" > nginx/html/index.html
    
    print_info "Starting Nginx for SSL certificate generation..."
    docker compose up -d nginx
    
    # Wait a moment for Nginx to start
    sleep 10
    
    print_info "Generating SSL certificate with Let's Encrypt..."
    print_warning "Make sure your domain app.kinesishr.online points to this server's IP address"
    
    # Update email in docker compose.yml before running
    read -p "Enter your email for Let's Encrypt notifications: " email
    
    if [ -n "$email" ]; then
        # Run certbot to get SSL certificate
        docker compose run --rm certbot certonly --webroot --webroot-path=/var/www/html --email "$email" --agree-tos --no-eff-email -d app.kinesishr.online
        
        if [ $? -eq 0 ]; then
            print_success "SSL certificate generated successfully"
        else
            print_error "SSL certificate generation failed"
            print_warning "You can skip SSL for now and set it up later"
        fi
    else
        print_warning "No email provided, skipping SSL certificate generation"
    fi
}

# Database migration
run_migrations() {
    print_info "Running database migrations..."
    
    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    docker compose exec app npx prisma migrate deploy
    
    if [ $? -eq 0 ]; then
        print_success "Database migrations completed"
    else
        print_error "Database migrations failed"
        exit 1
    fi
}

# Deploy application
deploy() {
    print_info "Starting Kinesis HR deployment..."
    
    # Build and start all services
    print_info "Building and starting services..."
    docker compose up -d --build
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 30
    
    # Check if application is healthy
    print_info "Checking application health..."
    if docker compose exec app curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Application is healthy"
    else
        print_warning "Application health check failed, but services are running"
    fi
    
    # Run database migrations
    run_migrations
    
    print_success "Deployment completed!"
    print_info "Application should be available at: https://app.kinesishr.online"
    print_info "Use 'docker compose logs -f' to view application logs"
}

# Stop deployment
stop() {
    print_info "Stopping Kinesis HR services..."
    docker compose down
    print_success "Services stopped"
}

# Show logs
logs() {
    print_info "Showing application logs..."
    docker compose logs -f "$1"
}

# Show status
status() {
    print_info "Service status:"
    docker compose ps
}

# Backup database
backup() {
    print_info "Creating database backup..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    
    docker compose exec postgres pg_dump -U postgres -d kinesis_hr > "$backup_file"
    
    if [ $? -eq 0 ]; then
        print_success "Database backup created: $backup_file"
    else
        print_error "Database backup failed"
    fi
}

# Main script logic
case "$1" in
    "deploy")
        check_prerequisites
        setup_environment
        deploy
        ;;
    "init-ssl")
        init_ssl
        ;;
    "stop")
        stop
        ;;
    "logs")
        logs "$2"
        ;;
    "status")
        status
        ;;
    "backup")
        backup
        ;;
    "restart")
        stop
        deploy
        ;;
    *)
        echo "Kinesis HR Deployment Script"
        echo ""
        echo "Usage: $0 {deploy|init-ssl|stop|logs|status|backup|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy     - Deploy the application"
        echo "  init-ssl   - Initialize SSL certificates"
        echo "  stop       - Stop all services"
        echo "  logs       - Show application logs (optional: service name)"
        echo "  status     - Show service status"
        echo "  backup     - Create database backup"
        echo "  restart    - Stop and redeploy"
        echo ""
        echo "Examples:"
        echo "  $0 deploy"
        echo "  $0 logs app"
        echo "  $0 status"
        exit 1
        ;;
esac
