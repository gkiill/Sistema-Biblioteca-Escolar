FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    postgresql-dev \
    icu-dev \
    libzip-dev \
    git \
    unzip \
    sqlite-dev

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pdo_sqlite \
    intl \
    zip \
    pcntl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-interaction --prefer-dist --optimize-autoloader || true

EXPOSE 8000

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-8000}"]