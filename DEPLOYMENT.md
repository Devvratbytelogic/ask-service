# Deployment Guide — Ask Service (Next.js)

> **Stack:** Next.js 16 · Node.js · PM2 · Nginx · Ubuntu VPS

---

## Table of Contents

1. [Server Prerequisites](#1-server-prerequisites)
2. [SSH into the VPS](#2-ssh-into-the-vps)
3. [Install Node.js & npm](#3-install-nodejs--npm)
4. [Install PM2](#4-install-pm2)
5. [Set Up SSH Key for GitHub](#5-set-up-ssh-key-for-github)
6. [Clone the Repository](#6-clone-the-repository)
7. [Environment Variables](#7-environment-variables)
8. [Install Dependencies & Build](#8-install-dependencies--build)
9. [Run with PM2](#9-run-with-pm2)
10. [Install & Configure Nginx](#10-install--configure-nginx)
11. [SSL with Certbot (HTTPS)](#11-ssl-with-certbot-https)
12. [Updating the Deployment](#12-updating-the-deployment)
13. [Useful PM2 & Nginx Commands](#13-useful-pm2--nginx-commands)

---

## 1. Server Prerequisites


| Requirement | Minimum                          |
| ----------- | -------------------------------- |
| OS          | Ubuntu 22.04 LTS                 |
| RAM         | 1 GB (2 GB recommended)          |
| Node.js     | 20.x LTS                         |
| Open ports  | 22 (SSH), 80 (HTTP), 443 (HTTPS) |


Make sure your domain DNS **A record** points to your VPS IP before setting up Nginx/SSL.

---

## 2. SSH into the VPS

```bash
ssh root@<YOUR_VPS_IP>
# or with a specific user
ssh ubuntu@<YOUR_VPS_IP>
```

---

## 3. Install Node.js & npm

```bash
# Install Node.js 20.x LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node -v   # should print v20.x.x
npm -v
```

---

## 4. Install PM2

```bash
sudo npm install -g pm2

# Verify
pm2 -v
```

---

## 5. Set Up SSH Key for GitHub

Generate a deploy key on the VPS and add it to the GitHub repository so the server can pull code.

```bash
# Generate a new SSH key pair (press Enter to accept defaults)
ssh-keygen -t ed25519 -C "deploy@ask-service-vps"

# Display the public key
cat ~/.ssh/id_ed25519.pub
```

Copy the printed public key, then go to:

> **GitHub → Repository → Settings → Deploy keys → Add deploy key**

Paste the key, give it a title (e.g. `VPS Deploy Key`), and save.

Test the connection:

```bash
ssh -T git@github.com
# Expected: Hi Devvratbytelogic/ask-service! You've successfully authenticated...
```

---

## 6. Clone the Repository

```bash
# Choose your deployment directory
mkdir -p /var/www
cd /var/www

git clone git@github.com:Devvratbytelogic/ask-service.git
cd ask-service
```

---

## 7. Environment Variables

Create the production `.env.local` file. **Never commit this file to git.**

```bash
nano /var/www/ask-service/.env.local
```

Paste and update the values below:

```env
NODE_ENV=production

# Backend API base URL (your actual production API)
NEXT_PUBLIC_API_BASE_URL=https://ask.webdesignnoida.in/api

# Socket.IO server URL
NEXT_PUBLIC_SOCKET_URL=https://ask.webdesignnoida.in
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

---

## 8. Install Dependencies & Build

```bash
cd /var/www/ask-service

# Install production dependencies
npm install

# Build the Next.js app
npm run build
```

The build output will be placed in `.next/`.

---

## 9. Run with PM2

### Start the app

```bash
cd /var/www/ask-service

pm2 start npm --name "ask-service" -- start
```

By default `next start` runs on **port 3000**. To use a different port:

```bash
pm2 start npm --name "ask-service" -- start -- -p 3001
```

### Save the PM2 process list & enable auto-restart on reboot

```bash
pm2 save
pm2 startup
# PM2 will print a command — copy and run it, e.g.:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
```

### Verify the app is running

```bash
pm2 status
pm2 logs ask-service
curl http://localhost:3000
```

---

## 10. Install & Configure Nginx

### Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Create an Nginx site configuration

Replace `ask.webdesignnoida.in` with your actual domain.

```bash
sudo nano /etc/nginx/sites-available/ask-service
```

Paste the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ask.webdesignnoida.in www.ask.webdesignnoida.in;

    # Redirect HTTP → HTTPS (uncomment after SSL is set up)
    # return 301 https://$host$request_uri;

    # Logging
    access_log /var/log/nginx/ask-service.access.log;
    error_log  /var/log/nginx/ask-service.error.log;

    # Proxy to Next.js
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        'upgrade';
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }

    # Static assets — serve directly through Nginx for better performance
    location /_next/static/ {
        alias /var/www/ask-service/.next/static/;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias /var/www/ask-service/public/;
        expires 7d;
        access_log off;
    }
}
```

### Enable the site and reload Nginx

```bash
sudo ln -s /etc/nginx/sites-available/ask-service /etc/nginx/sites-enabled/

# Remove default site if it conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Test the config
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

---

## 11. SSL with Certbot (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtain & auto-configure SSL certificate
sudo certbot --nginx -d ask.webdesignnoida.in -d www.ask.webdesignnoida.in

# Follow the prompts — Certbot will update your Nginx config automatically
# Choose option 2 (Redirect) to auto-redirect HTTP → HTTPS
```

Certbot automatically renews certificates. Test auto-renewal:

```bash
sudo certbot renew --dry-run
```

---

## 12. Updating the Deployment

Run these commands whenever you push new code to `main`:

```bash
cd /var/www/ask-service

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild the app
npm run build

# Reload PM2 with zero downtime
pm2 reload ask-service
```

---

## 13. Useful PM2 & Nginx Commands

### PM2


| Command                            | Description                  |
| ---------------------------------- | ---------------------------- |
| `pm2 status`                       | List all running processes   |
| `pm2 logs ask-service`             | Tail live logs               |
| `pm2 logs ask-service --lines 100` | Last 100 log lines           |
| `pm2 restart ask-service`          | Hard restart                 |
| `pm2 reload ask-service`           | Zero-downtime reload         |
| `pm2 stop ask-service`             | Stop the app                 |
| `pm2 delete ask-service`           | Remove from PM2              |
| `pm2 monit`                        | Real-time CPU/memory monitor |


### Nginx


| Command                                             | Description                    |
| --------------------------------------------------- | ------------------------------ |
| `sudo nginx -t`                                     | Test configuration syntax      |
| `sudo systemctl reload nginx`                       | Reload config without downtime |
| `sudo systemctl restart nginx`                      | Full restart                   |
| `sudo systemctl status nginx`                       | Check Nginx status             |
| `sudo tail -f /var/log/nginx/ask-service.error.log` | Watch error logs               |


---

## Firewall (UFW) — Optional but Recommended

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

> **Tip:** After the first deployment, bookmark the `deploy.sh` script. Every future update is just one `bash deploy.sh` from the server.

