# Deploying the guide

The site is static. Everything it needs is in `docs/`.

## Vercel

Import this repository in Vercel. `vercel.json` already tells Vercel to serve `docs/` with no build step.

## Your own server (Ubuntu with nginx)

Run once on the server:

```
sudo apt update && sudo apt install -y nginx git certbot python3-certbot-nginx
sudo git clone https://github.com/0xDarkSeidBull/redbelly-kyc-explainer /var/www/redbelly-kyc-explainer
sudo cp /var/www/redbelly-kyc-explainer/deploy/nginx.conf /etc/nginx/sites-available/kyc-explainer
sudo nano /etc/nginx/sites-available/kyc-explainer      # replace kyc.example.com with your domain
sudo ln -s /etc/nginx/sites-available/kyc-explainer /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d your.domain.here                 # HTTPS
```

To publish a new version after a push to GitHub:

```
cd /var/www/redbelly-kyc-explainer && sudo git pull
```
