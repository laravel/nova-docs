# CSS / JavaScript

[[toc]]

## CSS

Nova utilizes the [Tailwind.css](https://tailwindcss.com/docs/what-is-tailwind/) utility library for all styling. So, you are free to leverage all Tailwind features and classes that are needed by your custom components.

## JavaScript

When building custom Nova tools, resource tools, cards, and fields, you may use a variety of helpers that are globally available to your JavaScript components.

### Axios

The [Axios HTTP library](https://github.com/axios/axios) is globally available, allowing you to easily make requests to your custom component's Laravel controllers:

```js
axios.get('/nova-vendor/stripe-inspector/endpoint').then(response => {
    // ...
})
```

### Event Bus

### Notifications

### Global Variables

The global `Nova` JavaScript object contains the current Nova `base` path and `userId`:

```js
const userId = Nova.userId;
const basePath = Nova.base;
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
            'user' => $event->request->user()->toArray(),
        ]);
    });
}
```

Once the variable has been provided to Nova via the `provideToScript` method, you may access it on the global `Nova` JavaScript object:

```php
const name = Nova.user.name;
```

### Other Available Libraries

In addition to Axios, the [Underscore.js](https://underscorejs.org/) and [Moment.js](https://momentjs.com/) libraries are globally available to your custom components.
