FROM php:8.3-fpm

# Dependencias
RUN apt-get update && apt-get install -y \
    gnupg2 curl unzip git libpq-dev libzip-dev zip build-essential unixodbc-dev apt-transport-https \
    && rm -rf /var/lib/apt/lists/*

# SQL Server drivers
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/trusted.gpg.d/microsoft.gpg \
    && curl -sSL https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && pecl install sqlsrv pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Instalar extensiones adicionales de PHP
RUN docker-php-ext-install pdo pdo_pgsql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# ⚠️ PRIMERO copiamos los archivos del proyecto
COPY . .

# ⚠️ LUEGO ejecutamos composer install
RUN composer install --no-dev --optimize-autoloader || true

EXPOSE 8000

# Cambiamos el CMD para usar artisan serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]