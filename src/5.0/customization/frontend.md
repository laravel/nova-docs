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

### Manual Navigation

The global `Nova` JavaScript object offers a `visit` method that may be invoked to navigate to other URLs within your Nova dashboard:

```js
// Navigate to User's detail page...
Nova.visit(`/resources/users/${userId}`)

// Navigate to remote URL...
Nova.visit({ url: 'https://nova.laravel.com', remote: true })
```

The `visit` method accepts an array of navigation options as its second argument. As the `visit` method uses Inertia's own `visit` method behind the scenes, all of [Inertia's `visit` options](https://legacy.inertiajs.com/manual-visits) are supported by Nova's `visit` method:

```js
Nova.visit(`/resources/users/${userId}`, {
  onFinish: () => Nova.success(`User ${userId} detail page.`)
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
use Laravel\Nova\Events\ServingNova; # [!code ++]
use Laravel\Nova\Nova;

/**
 * Boot any application services.
 */
public function boot(): void
{
    //

    Nova::serving(function (ServingNova $event) { # [!code ++:5] # [!code focus:5]
        Nova::provideToScript([
            'mail_driver' => config('mail.default'),
        ]);
    });

    //
}
```

Once the variable has been provided to Nova via the `provideToScript` method, you may access it using the global `Nova` JavaScript object's `config` method:

```js
const driver = Nova.config('mail_driver');
```

### Localizations

Localization strings can be passed to the frontend via your `NovaServiceProvider`. To learn more, please consult the [full custom localization documentation](./../customization/localization.md#Frontend).

### Using Nova Mixins

Custom Nova tools, resource tools, cards, and other custom packages that are being developed within a `nova-components` directory of a Laravel application can utilize `laravel-nova` mixins by importing `nova.mix.js` Mix Extension from the Nova Devtool installation that is located within your root application's `vendor` directory. This extension should be placed in your package's `webpack.mix.js`:

```js
mix.extend('nova', new require('./vendor/laravel/nova-devtool/nova.mix')) // [!code focus]

mix // [!code focus]
  .setPublicPath('dist')
  .js('resources/js/card.js', 'js')
  .vue({ version: 3 })
  .css('resources/css/card.css', 'css')
  .nova('acme/analytics') // [!code focus]
```

:::tip NPM Requirements

Laravel Nova's assets are built using **lockfile** version `3` and require NPM 9+.
:::

### Vue DevTools

By default, Nova's JavaScript is compiled for production. As such, you will not be able to access the Vue DevTools out of the box without compiling Nova's JavaScript for development. To accomplish this, you may issue the following terminal commands from the root of your Nova project:

```bash
cd ./vendor/laravel/nova
mv webpack.mix.js.dist webpack.mix.js
npm ci
npm run dev
rm -rf node_modules
cd -
php artisan nova:publish
```

Please note, compiling Nova's assets for production purposes is not supported.
