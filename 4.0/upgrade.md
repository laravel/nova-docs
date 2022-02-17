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

### Updating Configuration, Assets, and Translations

Next, you should update your application's Nova configuration, assets, and translation files. To get started, you may run the following commands to update your assets and translations. In addition, we will generate a "Main" dashboard for your Nova installation:

```bash
php artisan nova:dashboard Main

php -r "file_exists('./resources/views/vendor/nova/layout.blade.php') && unlink('./resources/views/vendor/nova/layout.blade.php');"

php artisan vendor:publish --tag=nova-assets --force
php artisan vendor:publish --tag=nova-lang --force
php artisan view:clear
```

Next, let's update your Nova configuration file. First, ensure that the `middleware` and `api_middleware` configuration options within your application's `nova` configuration file appear like the following:

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

## High Impact Changes

### Nova Request

Nova 4 updates many methods to accept a `Laravel\Nova\Http\Requests\NovaRequest` instance instead of an `Illuminate\Http\Request` instance. An overview of the methods that have been updated is provided below so you may update your method signatures accordingly.

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

Next, move the contents of the `cards` method from your `NovaServiceProvider` to the `cards` method of your new `App\Nova\Dashboards\Main` class.

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

## Medium Impact Changes

### Vue 3

Nova 4 has been updated to use Vue 3, in order to upgrade all custom cards, custom fields, custom filters, resource tools, and tools to support Vue 3, please make the following changes to your application's `webpack.mix.js`:

```js
// Before...
mix.js('resources/js/field.js', 'js') 

// After...
mix.js('resources/js/field.js', 'js').vue({ version: 3 })
  .webpackConfig({
    externals: {
      vue: 'Vue',
    },
    output: {
      uniqueName: 'vendor/package',
    }
  })
```

### Replacing Vue Router With Inertia.js

**This change primarily affects the installation of custom tools that utilize Vue routing.**

Nova 4 has replaced Vue router with [Inertia.js](https://inertiajs.com). Therefore, custom tools should migrate from registering Vue routes to registering Inertia.js page components and backend routes. For example, given the following Nova 3 Vue router registration:

```js
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
        }
    });
```

### Removal Of `laravel-nova` NPM Dependencies

Nova 4 has merged `laravel-nova` codebase into `laravel/nova` repository and this would any Custom Fields and Tools depending on `laravel-nova` mixins. You need to manually copy all relevants files to `resources/js/mixins` and update `webpack.mix.js`:

```js
let mix = require('laravel-mix')
let path = require('path')

mix.alias({
  '@': path.join(__dirname, 'resources/js/'),
})
```

To import the mixin you can do the following:

```js
// Before
import { FormField, HandlesValidationErrors } from 'laravel-nova'

// After
import { FormField, HandlesValidationErrors } from '@/mixins'
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

Given the following field definition, Nova 3 will assume the relationship method is named `purchased_books`; however, Nova 4 will assume the relationship method is named `purchasedBooks`.

```php
BelongsToMany::make('Purchased Books'),
```

### `Action::actionClass` Method Removed

Nova 4 no longer allows adding custom CSS styles to an action confirmation modal's buttons via the action's `actionClass` method.

### `Filter` Options Array Format

The `Filter` class' `options` method should now return an array with items containing a `label` key instead of a `name` key:

```php
// Before...
public function options(Request $request)
{
    return [
        'yes' => ['name' => 'Yes'],
        'no' => ['name' => 'No'],
    ];
}

// After...
public function options(NovaRequest $request)
{
    return [
        'yes' => ['label' => 'Yes'],
        'no' => ['label' => 'No'],
    ];
}
```

## Low Impact Changes

### Reduce Encoded Filter String Length

Nova 4 introduces a shorter key-value map in filter string URLs which reduces the overall length of the URL. This change doesn't affect bookmarked URLs; however, third party package tool developers who interact deeply with Vuex may wish to ensure their packages still work after this change.

### `Action::showOnTableRow` Method

The `Action::showOnTableRow` method has been deprecated. Instead, we suggest updating your code to use the `showInline` method:

```php
// Before...
(new ConsolidateTransaction)->showOnTableRow(),

// After...
(new ConsolidateTransaction)->showInline(),
```

### Authorizing Actions Per-Resource

In Nova 3, you can conditionally display an action based on some state in the resource's underlying model via the `resource` property on a resource or lens instance:

```php
use Illuminate\Database\Eloquent\Model;
use Laravel\Nova\Http\Requests\ActionRequest;

/**
 * Get the actions available for the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function actions(Request $request)
{
    return [
        (new Actions\CancelTrial)->canSee(function ($request) {
            if ($request instanceof ActionRequest) {
                return true;  
            }

            return $this->resource instanceof Model && $this->resource->isOnTrial();
        }),
    ];
}
```

In Nova 4, `canRun` will be executed alongside `canSee` except when dealing with "Select All Matching". This allows users to focus `canSee` for User authorization for the action and `canRun` for model authorization for the action:

```php
/**
 * Get the actions available for the resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function actions(Request $request)
{
    return [
        (new Actions\CancelTrial)->canRun(function ($request, $user) {
            return $user->isOnTrial();
        }),
    ];
}
```

You may want to skipped displaying the `CancelTrial` when "Select All Matching" is selected by adding the following:

```php
(new Actions\CancelTrial)->canSee(function ($request) {
    return ! $request->allResourcesSelected();
})->canRun(function ($request, $user) {
    return $user->isOnTrial();
}),
```

### Authorization Precedence

Nova 4 introduce the following tweaks to authorization order / precedence:

* Authorizing a resource `view` permission no longer depends the `viewAny` permission.
* Actions can be executed regardless of `view` and `viewAny` permissions.
* Destructive actions will now authorize via their own `canRun` method before falling back to the model's policy.

Further detail regarding Nova authorization is available within the [policy documentation](./resources/authorization.html#policies).
