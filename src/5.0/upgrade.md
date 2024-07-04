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

### Updating Assets and Translations

Next, you should update your application's Nova assets and translation files. To get started, you may run the following commands to update your assets and translations.

**You may wish to store a copy of your current translation file before running this command so you can easily port any custom translations back into the new file after running these commands.**:

```bash
php artisan vendor:publish --tag=nova-assets --force
php artisan vendor:publish --tag=nova-lang --force
```

### Updating Third-Party Nova Packages ​

If your application relies on Nova tools or packages developed by third-parties, it is possible that these packages are not yet compatible with Nova 5.0 and will require an update from their maintainers.

## Upgrading Authentication Features

Let's update the Nova configuration file. First, ensure that the `api_middleware` configuration options within your application's `nova` configuration file appear as follows:

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


### With Authentication Routes

::: warning
Skip this section if your Nova's installation configured with custom authentication routes.
:::

Nova 5 now leverage [Laravel Fortify](https://laravel.com/docs/fortify) insteads of Laravel UI. The changes allows Nova 5 to enable 2-Factor Authentication, E-mail Verification and Password Confirmation. 

First, you need to update `routes()` and `register()` methods in `App\Providers\NovaServiceProvider` file:

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
                // Features::updatePasswords(),
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

### Without Authentication Features

::: warning
Skip this section if your Nova's installation configured without custom authentication routes.
:::

In application where the default login interface doesn't mean your use case it was possible to override the default routes using `nova.routes` configuration. In Nova 5, this has become easier via `App\Providers\NovaServiceProvider::routes()` as shown below:

```php
namespace App\Providers;

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
            ->withoutAuthenticationRoutes( # [!code ++:4]
                login: '/login',
                logout: '/logout',
            )
            ->withoutPasswordResetRoutes( # [!code ++:4]
                forgotPassword: '/forgot-password',
                resetPassword: '/reset-password',
            )
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

With above changes you can now remove the configuration override in `config/nova.php`:

```php
return [

    // ...

    'routes' => [ # [!code --:6] # [!code focus:6]
        'login' => '/login',
        'logout' => '/logout',
        'forgot_password' => '/forgot-password',
        'reset_password' => '/reset-password',
    ],

    // ...

];
```

## Updating Nova Components (Custom Tool, Cards, Fields, Filters)

### Inertia 1 Compatibility

With Nova 5, the frontend JavaScript now utilise Inertia.js v1 and will affect any projects what redirectly imports from `@inertiajs/inertia` or `@inertiajs/inertia-vue3`. You need to inspect your components/packages and ensure all reference has been updated as suggested in [Inertia's Upgrade Guide](https://inertiajs.com/upgrade-guide).

```vue
<script>
import { usePage } from '@inertiajs/inertia-vue3' // [!code --] // [!code focus]
import { Inertia } from '@inertiajs/inertia' // [!code --] // [!code focus]
import { router as Inertia, usePage } from '@inertiajs/vue3' // [!code ++] // [!code focus]

// ...

</script>
