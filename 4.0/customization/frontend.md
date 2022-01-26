# CSS / JavaScript

[[toc]]

## JavaScript

When building custom Nova tools, resource tools, cards, and fields, you may use a variety of helpers that are globally available to your JavaScript components.

#### Nova Requests

You may use the `Nova.request()` method to make XHR request using the [Axios](https://github.com/axios/axios) API. This method configures its own instance of Axios that has pre-configured interceptors to handle and redirect on `401`, `403`, and `500` level HTTP server responses:

```js
Nova.request().get('/nova-vendor/stripe-inspector/endpoint').then(response => {
    // ...
})
```

### Event Bus

The global `Nova` JavaScript object may be used as an event bus by your custom components. The bus provides the following methods, which correspond to and have the same behavior as the event methods [provided by tiny-emitter](https://www.npmjs.com/package/tiny-emitter):

```js
Nova.$on(event, callback)
Nova.$once(event, callback)
Nova.$off(event, callback)
Nova.$emit(event, [...args])
```

### Notifications

Nova configuration automatically registers the [toasted plugin](https://github.com/shakee93/toastedjs). So, within your custom components, you may leverage the `Nova.$toasted` object to display simple notifications:

```js
Nova.$toasted.show('It worked!', { type: 'success' })
Nova.$toasted.show('It failed!', { type: 'error' })
```

### Shortcuts

Nova provides two convenience methods for managing keyboard shortcuts, powered by [Mousetrap](https://craig.is/killing/mice). You may use this within your custom components to register and unregister shortcuts:

```js
// Add single keyboard shortcut...
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

The global `Nova` JavaScript object's `config` property contains the current Nova `base` path and `userId`:

```js
const userId = Nova.config.userId;
const basePath = Nova.config.base;
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

Once the variable has been provided to Nova via the `provideToScript` method, you may access it on the global `Nova` JavaScript object:

```js
const driver = Nova.config('mail_driver');
```

### Localizations

Localizations can be passed to the frontend from within your `NovaServiceProvider`. To learn more, check out the [full custom localization documentation](./../customization/localization.md#Frontend).

### Vue DevTools

By default, Nova's JavaScript is compiled for production. As such, you will not be able to access the Vue DevTools out of the box without compiling Nova's JavaScript for development. To accomplish this, you may use the following terminal commands from the root of your Nova project:

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
