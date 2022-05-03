# CSS / JavaScript

[[toc]]

When building custom Nova tools, resource tools, cards, and fields, you may use a variety of helpers that are globally available to your JavaScript components.

### Nova Requests

You may use the `Nova.request()` method to make XHR requests to backend routes provided by your application or custom tools, cards, and fields. The `Nova.request()` method is powered by [Axios](https://github.com/axios/axios) and offers the same API. However, the `Nova.request()` method configures its own instance of Axios that has pre-configured interceptors to properly handle and redirect on `401`, `403`, and `500` level HTTP server responses:

```js
Nova.request().get('/nova-vendor/stripe-inspector/endpoint').then(response => {
    // ...
})
```

### Event Bus

The global `Nova` JavaScript object may be used as an event bus by your custom components. The bus provides the following methods, which correspond to and have the same behavior as the event methods provided by [tiny-emitter](https://www.npmjs.com/package/tiny-emitter):

```js
Nova.$on(event, callback)
Nova.$once(event, callback)
Nova.$off(event, callback)
Nova.$emit(event, [...args])
```

### Notifications

You may display toast notification to users of your custom frontend components by calling the `success`, `error`, `info`, or `warning` methods on the global `Nova` object:

```js
Nova.success('It worked!')
Nova.error('It failed!')
```

### Shortcuts

Nova provides two convenience methods for managing keyboard shortcuts, powered by [Mousetrap](https://craig.is/killing/mice). You may use these methods within your custom components to register and unregister shortcuts:

```js
// Add a single keyboard shortcut...
Nova.addShortcut('ctrl+k', event => {
    // Callback...
})

// Add multiple keyboard shortcuts...
Nova.addShortcut(['ctrl+k', 'command+k'], event => {
    // Callback...
})

// Add a sequence shortcut...
Nova.addShortcut('* a', event => {
    // Callback...
})

// Remove a shortcut...
Nova.disableShortcut('ctrl+k')

// Remove multiple shortcuts...
Nova.disableShortcut(['ctrl+k', 'command+k'])
```

### Global Variables

The global `Nova` JavaScript object's `config` method allows you to get the current Nova `base` path and `userId` configuration values:

```js
const userId = Nova.config('userId');
const basePath = Nova.config('base');
```

However, you are free to add additional values to this object using the `Nova::provideToScript` method. You may call this method within a `Nova::serving` listener, which should typically be registered in the `boot` method of your application or custom component's service provider:

```php
use Laravel\Nova\Nova;
use Laravel\Nova\Events\ServingNova;

/**
 * Bootstrap any application services.
 *
 * @return void
 */
public function boot()
{
    Nova::serving(function (ServingNova $event) {
        Nova::provideToScript([
            'mail_driver' => config('mail.default'),
        ]);
    });
}
```

Once the variable has been provided to Nova via the `provideToScript` method, you may access it using the global `Nova` JavaScript object's `config` method:

```js
const driver = Nova.config('mail_driver');
```

### Localizations

Localization strings can be passed to the frontend via your `NovaServiceProvider`. To learn more, please consult the [full custom localization documentation](./../customization/localization.md#Frontend).

### Using Nova Mixins

Custom Nova tools, resource tools, cards, and other custom packages that are being developed within a `nova-components` directory of a Laravel application can reference Nova's own `packages.js` file by defining a `laravel-nova` alias that points to this file within the Nova installation that is located within your root application's `vendor` directory. This alias should be placed in your package's `nova.mix.js`:

```js
'laravel-nova': path.join(
  __dirname,
  '../../vendor/laravel/nova/resources/js/mixins/packages.js'
),
```

Custom Nova packages that are developed outside of a `nova-components` directory should declare `laravel/nova` as a "dev" Composer dependency. Then, define a `laravel-nova` Mix alias that points to the `packages.js` file within your custom package's `vendor` directory:

```js
'laravel-nova': path.join(
  __dirname,
  'vendor/laravel/nova/resources/js/mixins/packages.js'
),
```

In order to compile custom packages assets with `laravel-nova` mixins you are required to prepare `laravel/nova`'s `node_modules` by running the following command:

```bash
npm run nova:install

# Or use the explicit command...
npm --prefix='vendor/laravel/nova' ci
```

### Vue DevTools

By default, Nova's JavaScript is compiled for production. As such, you will not be able to access the Vue DevTools out of the box without compiling Nova's JavaScript for development. To accomplish this, you may issue the following terminal commands from the root of your Nova project:

```bash
cd ./vendor/laravel/nova
mv webpack.mix.js.dist webpack.mix.js
npm install
npm run dev
rm -rf node_modules
cd -
php artisan nova:publish
```

Please note, compiling Nova's assets for production purposes is not supported.
