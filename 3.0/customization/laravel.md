
# Laravel

[[toc]]

### Overview

Nova is build to work with a new Laravel or existing Laravel project out of the box, this section will show you how to customise Nova to work better with Laravel.

### Registering Custom Error Reporting

Nova shipped with a custom Exception Handler instead of using the default `App\Exceptions\ExceptionHandler` to ensure all exceptions from Nova are handled properly. However if you need to integrate 3rd party reporting tool with you need to use `Nova::report()` method to register custom reporting with Nova.

```php
use Laravel\Nova\Nova;

Nova::report(funtion ($exception) {
    if (app()->bound('sentry')) {
        app('sentry')->captureException($exception);
    }
});
```

:::tip Where to register <code>Nova::report()</code>

We recommend to register it under `App\Providers\NovaServiceProvider::register()` method.
:::

### By-passing Nova catch-all routes

Nova routes register a catch-all routes to intercept all request and propagate it to Vue router. However if you need to handle any other routes you can use [Laravel Fallback Routes](https://laravel.com/docs/8.x/routing#fallback-routes)

```php
Route::fallback(function ($fallbackPlaceholder) {
    // ...
});
```

If you need to more control instead of `$fallbackPlaceholder`, you need to register the route manually and ends with `fallback()`:

```php
Route::get('/{locale}/{page}', function ($locale, $page) {
    // 
})->where('locale', 'en|es')->fallback();
```

### View Partials

After installing Nova, Laravel will contains multiple view partials for Laravel Nova under `resources/views/vendor/nova/partials` where you can customised, the files includes:

* footer.blade.php
* logo.blade.php
* [meta.blade.php](#customizing-html-metadata)
* user.blade.php

#### Customizing HTML metadata

You can customize HTML metadata for Nova such as favicon etc by editing `resources/views/vendor/nova/partials.meta.blade.php`.
