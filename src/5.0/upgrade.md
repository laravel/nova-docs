# Upgrade Guide

[[toc]]

## Dependency Upgrades

Nova's upstream dependencies have been upgraded. You will find a complete list of our dependency upgrades below:

#### Server

* PHP 8.1+
* Laravel Framework 10.34+ and 11.0+
* Replace `laravel/ui` with `laravel/fortify` v1.21+
* Removed `doctrine/dbal`

#### Client

* Update to `@inertiajs/vue3` v1
* Update `trix` to v2
* Remove deprecated `form-backend-validation`
* Remove deprecated `places.js`

### Updating Composer Dependencies

You should update your `laravel/nova` dependency to `^5.0` in your application's `composer.json` file:

```json
    "require": {

        // ...

        "laravel/nova": "^4.0", // [!code --] # [!code focus]
        "laravel/nova": "^5.0", // [!code ++] # [!code focus]

    }
```

Next, install your updated your Composer dependencies:

```shell
composer update mirrors

composer update
```

### Upgrading Authentication Features

Nova 5 now leverage [Laravel Fortify](https://laravel.com/docs/fortify) insteads of Laravel UI. The changes allows Nova 5 to enable 2-Factor Authentication, E-mail Verification and Password Confirmation. First, you need to update `routes()` and `register()` methods in `App\Providers\NovaServiceProvider` file:

```php
namespace App\Providers;

use Laravel\Fortify\Features; # [!code ++] # [!code focus]
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Register the Nova routes.
     */
    protected function routes(): void # [!code focus:12]
    {
        Nova::routes()
            ->withFortifyFeatures([ # [!code ++:5]
                Features::updatePasswords(),
                // Features::emailVerification(),
                // Features::twoFactorAuthentication(['confirm' => true, 'confirmPassword' => true]),
            ])
            ->withAuthenticationRoutes()
            ->withPasswordResetRoutes()
            ->register();
    }

    /**
     * Register any application services.
     */
    public function register(): void # [!code focus:6]
    {
        parent::register(); # [!code ++]

        //
    }
}
```

Next, let's update the Nova configuration file. First, ensure that the `api_middleware` configuration options within your application's `nova` configuration file appear as follows:

```php
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;
use Laravel\Nova\Http\Middleware\EnsureEmailIsVerified; # [!code ++] # [!code focus]

return [

    // ...

    'api_middleware' => [ # [!code focus:6]
        'nova',
        Authenticate::class,
        // EnsureEmailIsVerified::class, # [!code ++]
        Authorize::class,
    ],

];
```


### Updating Assets and Translations

Next, you should update your application's Nova assets and translation files. To get started, you may run the following commands to update your assets and translations.

**You may wish to store a copy of your current translation file before running this command so you can easily port any custom translations back into the new file after running these commands.**:

```bash
php artisan vendor:publish --tag=nova-assets --force
php artisan vendor:publish --tag=nova-lang --force
```

### Updating Third-Party Nova Packages ​

If your application relies on Nova tools or packages developed by third-parties, it is possible that these packages are not yet compatible with Nova 5.0 and will require an update from their maintainers.

### Run Database Migrations

After updating your application's Composer dependencies, you should migrate your database:

```shell
php artisan migrate
```