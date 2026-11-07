FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx supervisor \
    freetype libpng libjpeg-turbo libwebp libzip icu oniguruma \
    freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev \
    libzip-dev oniguruma-dev icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j$(nproc) \
    pdo pdo_mysql mbstring zip exif pcntl bcmath gd intl opcache \
    && apk del freetype-dev libpng-dev libjpeg-turbo-dev libwebp-dev libzip-dev oniguruma-dev icu-dev

RUN { \
        echo 'upload_max_filesize = 20M'; \
        echo 'post_max_size = 25M'; \
        echo 'memory_limit = 256M'; \
        echo 'max_execution_time = 300'; \
    } > /usr/local/etc/php/conf.d/99-uploads.ini

RUN mkdir -p /run/nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY supervisord.conf /etc/supervisord.conf

WORKDIR /var/www/html
COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \; \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache \
    && rm -f /var/www/html/public/storage \
    && ln -s /var/www/html/storage/app/public /var/www/html/public/storage

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN --mount=type=cache,target=/root/.composer/cache \
    composer install --no-dev --optimize-autoloader --no-interaction

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
