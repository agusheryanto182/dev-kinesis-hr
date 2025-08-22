# Kinesis HR - Deployment Guide

This guide will help you deploy the Kinesis HR application to production using Docker Compose with HTTPS support.

## Prerequisites

Before deploying, ensure you have:

1. **Server Requirements:**
   - Linux server (Ubuntu/Debian recommended)
   - Minimum 2 GB RAM, 2 CPU cores
   - 20 GB disk space
   - Docker and Docker Compose installed

2. **Domain Setup:**
   - Domain `app.kinesishr.online` pointing to your server's IP address
   - DNS propagation completed (can take up to 24 hours)

3. **Required Accounts/Services:**
   - Google OAuth credentials
   - Cloudinary account for image storage
   - Dify AI account for chatbot functionality
   - Gemini AI API key
   - LiveKit account for video interviews
   - Email service (Gmail/SMTP) for notifications

## Quick Start

### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply group changes
```

### 2. Clone and Setup Project

```bash
# Clone your project
git clone <your-repository-url>
cd kinesis-hr

# Copy environment template
cp env.template .env
```

### 3. Configure Environment Variables

Edit the `.env` file with your actual values:

```bash
nano .env
```

**Important configurations:**

```env
# Database (Change the password!)
POSTGRES_PASSWORD=your-secure-password-here

# NextAuth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=https://app.kinesishr.online

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Add other API keys as needed...
```

### 4. Deploy Application

```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh deploy
```

The script will:

- Check prerequisites
- Setup environment
- Build and start services
- Run database migrations
- Generate SSL certificates (with Let's Encrypt)

### 5. Verify Deployment

After deployment, check:

```bash
# Check service status
./deploy.sh status

# View application logs
./deploy.sh logs app

# Check if application is accessible
curl -I https://app.kinesishr.online
```

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Start Services

```bash
# Start PostgreSQL first
docker-compose up -d postgres

# Wait for database to be ready
sleep 10

# Start the application
docker-compose up -d app

# Start Nginx
docker-compose up -d nginx
```

### 2. Setup SSL Certificate

```bash
# Create verification directory
mkdir -p nginx/html

# Generate certificate with Let's Encrypt
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/html \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d app.kinesishr.online
```

### 3. Run Database Migrations

```bash
docker-compose exec app npx prisma migrate deploy
```

## Configuration Details

### Docker Services

The deployment includes these services:

1. **PostgreSQL Database** (`postgres`)
   - Port: 5432 (internal)
   - Volume: `postgres_data`
   - Health checks enabled

2. **Next.js Application** (`app`)
   - Port: 3000 (internal)
   - Depends on PostgreSQL
   - Health checks enabled

3. **Nginx Reverse Proxy** (`nginx`)
   - Ports: 80, 443
   - SSL termination
   - Rate limiting
   - Gzip compression

4. **Certbot** (`certbot`)
   - SSL certificate management
   - Automatic renewal (setup separately)

### Nginx Configuration

The Nginx configuration provides:

- **HTTP to HTTPS redirect**
- **SSL/TLS security headers**
- **Rate limiting for API endpoints**
- **WebSocket support**
- **Static file caching**
- **File upload handling (50MB limit)**

### Security Features

- SSL/TLS encryption
- Security headers (HSTS, XSS protection, etc.)
- Rate limiting on API endpoints
- Strict auth endpoint rate limiting
- Non-root Docker user

## Maintenance

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
./deploy.sh logs app
./deploy.sh logs nginx
./deploy.sh logs postgres
```

### Database Backup

```bash
# Create backup
./deploy.sh backup

# Manual backup
docker-compose exec postgres pg_dump -U postgres -d kinesis_hr > backup.sql
```

### Updating Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./deploy.sh restart
```

### SSL Certificate Renewal

```bash
# Test renewal
docker-compose run --rm certbot renew --dry-run

# Actual renewal (setup as cron job)
docker-compose run --rm certbot renew
docker-compose exec nginx nginx -s reload
```

### Monitoring

```bash
# Check service status
./deploy.sh status

# Monitor resource usage
docker stats

# Check application health
curl https://app.kinesishr.online/api/health
```

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues:**

   ```bash
   # Check if domain points to server
   nslookup app.kinesishr.online

   # Manually generate certificate
   ./deploy.sh init-ssl
   ```

2. **Database Connection Issues:**

   ```bash
   # Check PostgreSQL logs
   ./deploy.sh logs postgres

   # Verify database is running
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **Application Not Starting:**

   ```bash
   # Check application logs
   ./deploy.sh logs app

   # Verify environment variables
   docker-compose exec app printenv | grep -E "DATABASE_URL|NEXTAUTH"
   ```

4. **Nginx Configuration Issues:**

   ```bash
   # Test Nginx configuration
   docker-compose exec nginx nginx -t

   # Reload configuration
   docker-compose exec nginx nginx -s reload
   ```

### Performance Tuning

1. **Database Performance:**
   - Increase PostgreSQL memory settings
   - Setup connection pooling
   - Regular database maintenance

2. **Application Performance:**
   - Monitor memory usage
   - Scale with multiple app instances
   - Use Redis for session storage

3. **Nginx Optimization:**
   - Adjust worker processes
   - Fine-tune caching headers
   - Optimize gzip settings

## Security Considerations

1. **Environment Variables:**
   - Use strong passwords
   - Rotate secrets regularly
   - Never commit `.env` files

2. **Server Security:**
   - Keep system updated
   - Use firewall (ufw/iptables)
   - Regular security patches

3. **SSL/TLS:**
   - Monitor certificate expiration
   - Use strong cipher suites
   - Enable HSTS

4. **Database Security:**
   - Regular backups
   - Network isolation
   - Strong authentication

## Support

For issues or questions:

1. Check application logs: `./deploy.sh logs app`
2. Review this documentation
3. Check Docker Compose status: `./deploy.sh status`
4. Verify health endpoint: `curl https://app.kinesishr.online/api/health`

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
