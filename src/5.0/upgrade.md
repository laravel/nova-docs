# Upgrade Guide

[[toc]]

## Dependency Upgrades

Nova's upstream dependencies have been upgraded. You will find a complete list of our dependency upgrades below:

#### Server

* PHP 8.1+
* Laravel Framework 10.34+
* Replace `laravel/ui` with `laravel/fortify`
* Removed `doctrine/dbal`

#### Client

* Update to Inertia.js v1
* Update `trix` to v2
* Remove deprecated `form-backend-validation`

### Updating Composer Dependencies

You should update your `laravel/nova` dependency to `^5.0` in your application's `composer.json` file:

```diff
-   "laravel/nova": "^4.0",
+   "laravel/nova": "^5.0",
```

Next, install your updated your Composer dependencies:

```shell
composer update mirrors

composer update
```

Next, update `App\Providers\NovaServiceProvider` file to include call to `parent::register()` if the method exists:

```diff
public function register(): void
{
+   parent::register();

    //
}
```

After updating your application's Composer dependencies, you should migrate your database:

```shell
php artisan migrate
```

### Updating Configuration, Assets, and Translations

Next, you should update your application's Nova configuration, assets, and translation files. To get started, you may run the following commands to update your assets and translations.

**You may wish to store a copy of your current translation file before running this command so you can easily port any custom translations back into the new file after running these commands.**:

```bash
php artisan vendor:publish --tag=nova-assets --force
php artisan vendor:publish --tag=nova-lang --force
```

Next, let's update the Nova configuration file. First, ensure that the `api_middleware` configuration options within your application's `nova` configuration file appear as follows:

```php
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;
use Laravel\Nova\Http\Middleware\EnsureEmailIsVerified; # [!code ++]

return [

    // ...

    'api_middleware' => [
        'nova',
        Authenticate::class,
        // EnsureEmailIsVerified::class, # [!code ++]
        Authorize::class,
    ],

    // ...
];
```
