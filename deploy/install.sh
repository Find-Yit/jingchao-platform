#!/usr/bin/env bash
set -euo pipefail
if [ "$(id -u)" != 0 ]; then
  echo 'Run this deployment script as root.' >&2
  exit 1
fi
APP_SOURCE=$(cd "$(dirname "$0")/.." && pwd)
if [ ! -x /usr/sbin/nginx ]; then
  apt-get update -qq
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx python3-venv
fi
if ! id zhixu >/dev/null 2>&1; then
  useradd --system --home-dir /var/lib/zhixu --shell /usr/sbin/nologin zhixu
fi
install -d -o zhixu -g zhixu -m 700 /var/lib/zhixu
install -d -m 755 /opt/zhixu/app /var/www/zhixu-acme
cp -R "$APP_SOURCE/static" /opt/zhixu/app/
cp "$APP_SOURCE/app.py" "$APP_SOURCE/seed.py" "$APP_SOURCE/assessment.py" "$APP_SOURCE/prompts.py" "$APP_SOURCE/meadow.py" "$APP_SOURCE/learning.py" "$APP_SOURCE/office.py" "$APP_SOURCE/office_lessons.json" "$APP_SOURCE/webstudio.py" "$APP_SOURCE/web_demo.html" "$APP_SOURCE/lessonkit.py" "$APP_SOURCE/lessonkit_ppt.py" "$APP_SOURCE/eras.py" "$APP_SOURCE/era_lessons.json" "$APP_SOURCE/pets.py" "$APP_SOURCE/requirements.txt" /opt/zhixu/app/
python3 -m venv /opt/zhixu/venv
/opt/zhixu/venv/bin/pip install --disable-pip-version-check --index-url https://pypi.org/simple -r /opt/zhixu/app/requirements.txt
install -m 644 "$APP_SOURCE/deploy/zhixu.service" /etc/systemd/system/zhixu.service
install -m 644 "$APP_SOURCE/deploy/zhixu.nginx.conf" /etc/nginx/sites-available/zhixu
ln -sfn /etc/nginx/sites-available/zhixu /etc/nginx/sites-enabled/zhixu
nginx -t
systemctl daemon-reload
systemctl enable --now zhixu
systemctl restart zhixu
systemctl enable --now nginx
systemctl reload nginx
for attempt in 1 2 3 4 5; do
  if curl -fsS http://127.0.0.1:8088/api/health; then
    systemctl --no-pager --full status zhixu | head -15
    exit 0
  fi
  sleep 2
done
echo 'Health check failed' >&2
journalctl -u zhixu --no-pager -n 30
exit 1
