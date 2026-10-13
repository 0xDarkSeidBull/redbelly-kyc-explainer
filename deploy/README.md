# Deploying the guide

The site is static. Everything it needs is in `docs/`.

## Vercel

Import this repository in Vercel. `vercel.json` already tells Vercel to serve `docs/` with no build step.

## Your own server with Caddy (how the live site runs)

The live guide at https://kyc.test-hub.xyz is served by Caddy, which also handles HTTPS. Clone the repository and add this block to `/etc/caddy/Caddyfile`:

```
sudo git clone https://github.com/0xDarkSeidBull/redbelly-kyc-explainer /var/www/redbelly-kyc-explainer
```

```
kyc.test-hub.xyz {
    root * /var/www/redbelly-kyc-explainer/docs
    file_server
}
```

```
sudo caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile && sudo systemctl reload caddy
```

## Your own server with nginx (if port 80 is free)

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
