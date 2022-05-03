# Upgrade Guide

[[toc]]

## Dependency Upgrades

Nova's upstream dependencies have been upgraded. You will find a complete list of our dependency upgrades below:

#### Server

* PHP 7.3+
* Laravel Framework 8.0+
* Updated `doctrine/dbal` from `^2.9` to `^2.13.3|^3.1.2`
* Updated `laravel/ui` from `^2.0|^3.0` to `^3.3`
* Updated `symfony/*` from `^5.0` to `^5.4|^6.0`
* Removed `cakephp/chronos` and `moontoast/math` dependencies

#### Client

* Updated supported Laravel Mix version from `v1` to `v6`
* Removed `flatpickr` and `moment.js`

### Updating Composer Dependencies

You should update your `laravel/nova` dependency to `^4.0` in your application's `composer.json` file:

```json
"laravel/nova": "^4.0",
```

After purchasing a Nova 4.0 license, you should update your [Composer auth.json file](https://getcomposer.org/doc/articles/http-basic-authentication.md) to use your newly generated license key instead of your previous Nova 3 API token or account password.

Next, install your updated your Composer dependencies:

```shell
composer update mirrors

composer update
```

After updating your application's Composer dependencies, you should migrate your database:

```shell
php artisan migrate
```

### Updating Configuration, Assets, and Translations

Next, you should update your application's Nova configuration, assets, and translation files. To get started, you may run the following commands to update your assets and translations.

**You may wish to store a copy of your current translation file before running this command so you can easily port any custom translations back into the new file after running these commands.** In addition, we will generate a "Main" dashboard for your Nova installation:

```bash
php artisan nova:dashboard Main

php -r "file_exists('./resources/views/vendor/nova/layout.blade.php') && unlink('./resources/views/vendor/nova/layout.blade.php');"

php artisan vendor:publish --tag=nova-assets --force
php artisan vendor:publish --tag=nova-lang --force
php artisan view:clear
```

Next, let's update the Nova configuration file. First, ensure that the `middleware` and `api_middleware` configuration options within your application's `nova` configuration file appear as follows:

```php
use Laravel\Nova\Http\Middleware\Authenticate;
use Laravel\Nova\Http\Middleware\Authorize;
use Laravel\Nova\Http\Middleware\BootTools;
use Laravel\Nova\Http\Middleware\DispatchServingNovaEvent;
use Laravel\Nova\Http\Middleware\HandleInertiaRequests;

return [

    // ...
    
    'middleware' => [
        'web',
        HandleInertiaRequests::class,
        DispatchServingNovaEvent::class,
        BootTools::class,
    ],

    'api_middleware' => [
        'nova',
        Authenticate::class,
        Authorize::class,
    ],

    // ... 
];
```

Next, ensure your application's `nova` configuration file contains a `storage_disk` configuration option:

```php
'storage_disk' => env('NOVA_STORAGE_DISK', 'public'),
```

Once your configuration has been updated, you should review the following list of changes and upgrade your application accordingly.

### Updating Third-Party Nova Packages

If your application relies on Nova tools or packages developed by third-parties, it is possible that these packages are not yet compatible with Nova 4.0 and will require an update from their maintainers.

## High Impact Changes

### Nova Request

Nova 4 updates a variety of methods to accept a `Laravel\Nova\Http\Requests\NovaRequest` instance instead of an `Illuminate\Http\Request` instance. An overview of the methods that have been updated is provided below so you may update your method signatures accordingly.

#### Resources

The `fields`, `fieldsForIndex`, `fieldsForDetail`, `fieldsForCreate`, `fieldsForUpdate`, `cards`, `filters`, `lenses`, and `actions` methods:

```php
class Resource
{
    public function fields(NovaRequest $request) {} 
    public function fieldsForIndex(NovaRequest $request) {} 
    public function fieldsForDetail(NovaRequest $request) {} 
    public function fieldsForCreate(NovaRequest $request) {} 
    public function fieldsForUpdate(NovaRequest $request) {} 
    public function cards(NovaRequest $request) {}
    public function filters(NovaRequest $request) {}
    public function lenses(NovaRequest $request) {}
    public function actions(NovaRequest $request) {}
}
```

#### Lenses

The `fields`, `filters`, and `actions` methods:

```php
class Lens
{
    public function fields(NovaRequest $request) {} 
    public function filters(NovaRequest $request) {}
    public function actions(NovaRequest $request) {}
} 
```

#### Actions

The `fields` method:

```php
class Action
{
    public function fields(NovaRequest $request) {} 
}
```

#### Filters

The `apply` and `options` methods:

```php
class Filter
{
    public function apply(NovaRequest $request, $query, $value) {}
    public function options(NovaRequest $request) {}
}
```

### Main Dashboard Class

In previous releases of Nova, the "Main" dashboard cards were defined via the `cards` method of your application's `NovaServiceProvider`. However, in Nova 4, a dedicated `Main` dashboard class must be created via the following command:

```bash
php artisan nova:dashboard Main
```

Next, move the contents of the `cards` method from your `NovaServiceProvider` to the `cards` method of your new `App\Nova\Dashboards\Main` class and register the `Main` dashboard within the `dashboards` method of your `NovaServiceProvider`:

```php
use App\Nova\Dashboards\Main;

/**
 * Get the extra dashboards that should be displayed on the Nova dashboard.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        new Main,
    ];
}
```

### Dashboard Methods

In Nova 4, the `cards` and `uriKey` methods defined on dashboard classes are no longer static. You should update your methods accordingly:

```php
/**
 * Get the displayable name of the dashboard.
 *
 * @return string
 */
public function label()
{
    return 'Post Stats';
}

/**
 * Get the URI key for the dashboard.
 *
 * @return string
 */
public function uriKey()
{
    return 'posts-dashboard';
}
``` 

### Client-Side Timezone Detection

Nova 4 removes the ability to rely on the client machine timezone in order to display timezone related information. Instead, Nova 4 utilizes the application's "server side" timezone as defined by the timezone option in your application's `app` configuration file.

Please refer to our documentation regarding [timezone customization](./resources/date-fields.html#customizing-the-timezone) for more information.

### `Date` / `DateTime` Fields & HTML5

Nova 4 utilizes native `<input type="date" />` and `<input type="datetime-local" />` elements to render the `Date` and `DateTime` fields. Therefore, the following methods have been removed from Nova 4:

* `firstDayOfWeek()`
* `format()`
* `pickerFormat()`
* `pickerDisplayFormat()`
* `incrementPickerHourBy()`
* `incrementPickerMinuteBy()`

### Algolia Place Field

Unfortunately, Algolia is [retiring their "Places" API](https://www.algolia.com/blog/product/sunsetting-our-places-feature/) on May 31, 2022; therefore, the `Place` field has been deprecated and we encourage you to migrate to `Text` fields for street addresses and cities.

## Medium Impact Changes

### Updating Custom Tool, Cards, Fields, Filters

:::tip Prerequisites

To ease upgrading custom packages to Nova 4, please review and copy the following files from Laravel Nova's `src/Console/stubs` directory to your own custom package:

* `nova.mix.js`
* `packages.js` 
* `webpack.mix.js`
:::

Since Nova 4 upgrades our frontend dependencies to Inertia, Vue 3, and Tailwind 3, it is necessary to review all custom tools and upgrade them accordingly. A general overview of the necessary changes can be found below; however, your custom Nova packages may require additional changes if they are depending on third-party packages that only support Vue 2 or prior versions of Tailwind.

#### Vue 3

**This change primarily affects the installation of custom tools that utilize Vue routing.**

Nova 4 has been updated to use Vue 3, in order to upgrade all custom cards, custom fields, custom filters, resource tools, and tools to support Vue 3, please make the following changes to your application's `webpack.mix.js`:

```js
// Before...
mix.js('resources/js/field.js', 'js') 

// After...
require('./nova.mix')

mix.js('resources/js/field.js', 'js').vue({ version: 3 })
  .nova('vendor/package')
```

#### Replacing Vue Router With Inertia.js

**This change primarily affects the installation of custom tools that utilize Vue routing.**

Nova 4 has replaced Vue router with [Inertia.js](https://inertiajs.com). Therefore, custom tools should migrate from registering Vue routes to registering Inertia.js page components and backend routes. For example, given the following Nova 3 Vue router registration:

```js
// Within tool.js...

Nova.booting((Vue, router) => {
  router.addRoutes([
    {
      name: 'sidebar-tool',
      path: '/sidebar-tool',
      component: require('./components/Tool'),
    },
  ])
})
````

When using Nova 4, you should register the tool component with Inertia like so:

```js
// Within tool.js...

Nova.booting((Vue) => {
  Nova.inertia('SidebarTool', require('./component/Tool').default)
})
```

Once your Vue component has been registered, you should define a server-side route definition for your tool so that it may be rendered:

```php
// Within ToolServiceProvider.php...

use Laravel\Nova\Nova;

Nova::router()
    ->group(function ($router) {
        $router->get('sidebar-tool', function ($request) {
            return inertia('SidebarTool');
        });
    });
```

#### Removal Of `laravel-nova` NPM Dependency

**This change primarily affects the installation of custom tools that utilize Vue routing.**

:::tip Prerequisite

To ease upgrading custom packages to support Nova 4, please review and copy the following files from Laravel Nova's `src/Console/stubs` especially the following files:

* `nova.mix.js`
* `packages.js` 
* `webpack.mix.js`
:::

Previous versions of Nova required the `laravel-nova` NPM package. In 4.0, this is no longer the case as each mixin has been integrated into Nova itself. To upgrade any custom packages you've created, you must update your `webpack.mix.js` file to define an alias to `vendor/laravel/nova/resources/js/mixins/packages.js`:

Typically, custom Nova tools, resource tools, cards, and other custom packages that are being developed within a `nova-components` directory of a Laravel application can reference Nova's own `packages.js` file by defining a `laravel-nova` alias that points to the file within the Nova installation that is located within your root application's `vendor` directory. This alias is typically defined within the custom package's `nova.mix.js` file:

```js
'laravel-nova': path.join(
  __dirname,
  '../../vendor/laravel/nova/resources/js/mixins/packages.js'
),
```

Custom Nova packages that are developed outside of a `nova-components` directory should declare `laravel/nova` as a "dev" Composer dependency, and then define a `laravel-nova` Mix alias that points to the `packages.js` file within your custom package's `vendor` directory:

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

### Event Cancellation On Save

Nova 3 ignores event cancellation when creating or updating a resource. For example, the following code will still persist the `User` resource to the database, even though the even listener returns `false`:

```php
User::updating(function ($model) {
    return false;
});
``` 

However, this code will throw a `Laravel\Nova\Exceptions\ResourceSaveCancelledException` exception in Nova 4.

### `Field::default` Method Only Applies To Create, Attach, & Action Requests

Nova 4 will no longer resolve default values for "index" and "detail" requests. If you need to define a model's default attribute values, please utilize Eloquent's `$attributes` property:

```php
use Illuminate\Database\Eloquent\Model;

class User extends Model 
{
    /**
     * The model's attributes.
     *
     * @var array
     */
    protected $attributes = [
        'timezone' => 'UTC',
    ];
}
```

### Relationship Name Conventions

Given the following field definition, Nova 3 will assume the relationship method is named `purchased_books`; however, Nova 4 will correctly assume the relationship method is named `purchasedBooks`.

```php
BelongsToMany::make('Purchased Books'),
```

### `Action::actionClass` Method Removed

Nova 4 no longer allows adding custom CSS styles to an action confirmation modal's buttons via the action's `actionClass` method.

## Low Impact Changes

### Eloquent User Provider Required

Nova 4 requires the authentication user provider to be `eloquent` in order to resolve information regarding the currently authenticated user.

In your application's default `config/auth.php` configuration file, the Eloquent user provider is specified and it is instructed to use the `App\Models\User` model when retrieving users. You may change these values within your configuration file based on the needs of your application.

### Reduce Encoded Filter String Length

Nova 4 introduces a shorter key-value map in filter string URLs which reduces the overall length of the URL. This change doesn't affect bookmarked URLs; however, third party package tool developers who interact deeply with Vuex may wish to ensure their packages still work after this change.

### `Action::showOnTableRow` Method

The `Action::showOnTableRow` method has been deprecated. Instead, we suggest updating your code to use the `showInline` method:

```php
// Before...
(new ConsolidateTransaction)->showOnTableRow(),

// After...
(new ConsolidateTransaction)->showInline(),
(new ConsolidateTransaction)->onlyInline(),
(new ConsolidateTransaction)->exceptInline(),
```

### Authorization Precedence

Nova 4 introduce the following tweaks to authorization order / precedence:

* Authorizing if a user can `view` a resource no longer depends on the `viewAny` permission.
* Actions can be executed regardless of `view` and `viewAny` permissions.
* Destructive actions will now authorize via their own `canRun` method before falling back to the model's policy.

Further detail regarding Nova authorization is available within the [resource policy documentation](./resources/authorization.html#policies) and [action authorization documentation](./actions/registering-actions.md#authorization).

### Update Published Stubs

Due to various changes in Nova 4.0, you should re-publish the Nova "stubs" if you have previously published them. You can accomplish this by executing the `nova:stubs` Artisan command with the `--force` option:

```bash
php artisan nova:stubs --force
```
