#!/bin/sh

set -eu

cd /var/www/html

if [ ! -f .env ]; then
    cp .env.example .env
fi

set_env() {
    key="$1"
    value="$2"

    if grep -q "^${key}=" .env; then
        sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
        printf '\n%s=%s\n' "$key" "$value" >> .env
    fi
}

set_env APP_NAME "${APP_NAME:-Colorbox}"
set_env APP_ENV "${APP_ENV:-local}"
set_env APP_DEBUG "${APP_DEBUG:-true}"
set_env APP_URL "${APP_URL:-http://localhost:8000}"
set_env DB_CONNECTION "${DB_CONNECTION:-pgsql}"
set_env DB_HOST "${DB_HOST:-postgres}"
set_env DB_PORT "${DB_PORT:-5432}"
set_env DB_DATABASE "${DB_DATABASE:-colorbox}"
set_env DB_USERNAME "${DB_USERNAME:-postgres}"
set_env DB_PASSWORD "${DB_PASSWORD:-postgres}"
set_env SHIPMENT_WEBHOOK_TOKEN "${SHIPMENT_WEBHOOK_TOKEN:-sandbox-webhook-token}"

export PGPASSWORD="${DB_PASSWORD:-postgres}"

until pg_isready -h "${DB_HOST:-postgres}" -p "${DB_PORT:-5432}" -U "${DB_USERNAME:-postgres}" -d "${DB_DATABASE:-colorbox}" >/dev/null 2>&1; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

if grep -q '^APP_KEY=$' .env || ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force --no-interaction
fi

php artisan config:clear --no-interaction

if [ ! -L public/storage ]; then
    php artisan storage:link --no-interaction || true
fi

php artisan migrate --force --no-interaction

exec php artisan serve --host=0.0.0.0 --port=8000
