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
* Update to Heroicons v2
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

Next, install your updated Composer dependencies:

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
use Laravel\Nova\Actions\ActionResource;
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;
use Laravel\Nova\Http\Middleware\BootTools;
use Laravel\Nova\Http\Middleware\DispatchServingNovaEvent;
// use Laravel\Nova\Http\Middleware\EnsureEmailIsVerified; # [!code ++] # [!code focus]
use Laravel\Nova\Http\Middleware\HandleInertiaRequests;

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
Skip this section if your Nova's installation is configured with custom authentication routes.
:::

Nova 5 now leverages [Laravel Fortify](https://laravel.com/docs/fortify) instead of Laravel UI. The changes allow Nova 5 to enable Two Factor Authentication, E-mail Verification, and Password Confirmation. 

First, you need to update `register()` method and add new `fortify()` method in `App\Providers\NovaServiceProvider` class:

```php
namespace App\Providers;

use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Register the configurations for Laravel Fortify.
     */
    protected function fortify(): void  # [!code ++:5] # [!code focus:5]
    {
        Nova::fortify()
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

Once completed, you may look into customizing the authentication featured powered by **Laravel Fortify** on the [Authentication & Security](./installation.md#authentication-security) documentation.

### Without Authentication Features

::: warning
Skip this section if your Nova's installation is configured without custom authentication routes.
:::

In an application where the default login interface doesn't mean your use case, it was possible to override the default routes using `nova.routes` configuration. In Nova 5, this has become easier via `routes()` method in `App\Providers\NovaServiceProvider` class:

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
            ->withoutAuthenticationRoutes( # [!code ++:7]
                login: '/login', 
                logout: '/logout',
            )->withoutPasswordResetRoutes(
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

With the above changes, you can now remove the configuration override in `config/nova.php`:

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

With Nova 5, the frontend JavaScript now utilizes Inertia.js v1 and will affect any projects that directly import from `@inertiajs/inertia` or `@inertiajs/inertia-vue3`. You need to inspect your components/packages and ensure all references have been updated as suggested in [Inertia's Upgrade Guide](https://inertiajs.com/upgrade-guide).

```vue
<script>
import { usePage } from '@inertiajs/inertia-vue3' // [!code --] // [!code focus]
import { Inertia } from '@inertiajs/inertia' // [!code --] // [!code focus]
import { router as Inertia, usePage } from '@inertiajs/vue3' // [!code ++] // [!code focus]

// ...

</script>
```

### Nova Devtool

Nova 5 also introduces a new helper package for Nova Packages development to assist in asset compilation and preview the application while building the package. Please run the following command to install the package:

```bash
composer install --dev "laravel/nova-devtool"
```

Next, you should include the NPM dependencies for `laravel/nova-devtool` using the following command:

```bash
npm install --save-dev "vendor/laravel/nova-devtool"
```

#### Vendor Managed `nova.mix.js` File

Nova Devtool ships with a generic `nova.mix.js` instead of publishing the file on each 3rd-party components. For external 3rd-party component you just need to include change the following code in `webpack.mix.js`:

```js
let mix = require('laravel-mix')
let NovaExtension = require('laravel-nova-devtool') // [!code ++]

require('./nova.mix') // [!code --]
mix.extend('nova', new NovaExtension) // [!code ++]

mix
  .setPublicPath('dist')

  // ...
```

Finally, you can remove the existing `nova.mix.js` from the component root directory.

### Replacing `form-backend-validation`

`form-backend-validation` repository has been archived and should no longer be used by third-party packages or components. As a replacement developers are adviced to change any references to `form-backend-validation` such as:

```vue
<script>
import { Errors } from 'form-backend-validation' // [!code --] // [!code focus]
import { Errors } from 'laravel-nova' // [!code ++] // [!code focus]

// ...

</script>
```

Next, remove `form-backend-validation` from `package.json`:

```bash
npm remove form-backend-validation
```

## High Impact Changes

### Partition Metric `average()` usage

In order to standardise the method usage Nova 5 has made the following changes:

```php
/**
 * @method PartitionResult average($request, $model, $column, $groupBy)
 * @method PartitionResult average($request, $model, $groupBy, $column = null)
 */
```

To minimize the affect needed to make such changes, you should be able to instead do this:

```php
use App\Models\Order;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Metrics\PartitionResult;

/**
 * Calculate the value of the metric.
 */
public function calculate(NovaRequest $request): PartitionResult
{
    return $this->average( # [!code focus:4]
        $request, Order::class, 'price', 'department' # [!code --]
        $request, Order::class, column: 'price', groupBy: 'department' # [!code ++]
    );
}
```
## Medium Impact Changes ​

### Algolia Place Field ​Removed

Algolia [retired their "Places" API](https://www.algolia.com/blog/product/sunsetting-our-places-feature/) on May 31, 2022; therefore, the Place field was deprecated on Nova 4 and now removed in Nova 5.

## Low Impact Changes

### Update Published Stubs

Due to various changes in Nova 4.0, you should re-publish the Nova "stubs" if you have previously published them. You can accomplish this by executing the `nova:stubs` Artisan command with the `--force` option:

```bash
php artisan nova:stubs --force
```
