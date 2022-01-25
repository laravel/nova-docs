# Upgrade Guide

[[toc]]

## Dependency Upgrades

Nova's upstream dependencies have been upgraded. You will find a complete list of our dependency upgrades below:

#### Server

* PHP 7.3+
* Laravel Framework 8.0+
* Updated `doctrine/dbal` from `^2.9` to `^2.13.3|^3.1.2`
* Updated `laravel/ui` from `^2.0|^3.0` to `^3.3`
* Updated `symfony/*` from `^5.0` to `^5.4|^6.0
* Updated `cakephp/chronos` and `moontoast/math` dependencies

#### Client

* Updated supported Laravel Mix version from `v1` to `v6`
* Removed `flatpickr` and `moment.js`

### Updating Composer Dependencies

You should update your `laravel/nova` dependency to `^4.0` in your application's `composer.json` file:

```json
"laravel/nova": "^4.0",
```

Next, you need to create Main dashboard and replace configuration, language and views which is simplified using the following command:

```bash
php artisan nova:upgrade
```

Next, you should reviews the following changes and adjust your Nova application based on the suggestions.

## High Impact Changes

### Nova Request

**This change is required when using PHP 7.3; however, the change is optional for applications running on PHP 7.4 and above.**

In Nova 4, many methods have been updated to accept a `Laravel\Nova\Http\Requests\NovaRequest` instance instead of `Illuminate\Http\Request`. An overview of the methods that have been updated is provided below.

#### Resources

The `fields`, `fieldsForIndex`, `fieldsForDetail`, `fieldsForCreate`, `fieldsForUpdate`, `cards`, `filters`, `lenses`, and `actions` methods:

```php
class Resource {
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
class Lens {
    public function fields(NovaRequest $request) {} 
    public function filters(NovaRequest $request) {}
    public function actions(NovaRequest $request) {}
} 
```

#### Actions

The `fields` method:

```php
class Action {
    public function fields(NovaRequest $request) {} 
}
```

#### Filters

The `apply` and `options` methods:

```php
class Filter {
    public function apply(NovaRequest $request, $query, $value) {}
    public function options(NovaRequest $request) {}
}
```

### Main Dashboard class

In Nova 3, you would only need to define Main dashboard cards via `App\Providers\NovaServiceProvider::cards` method. In Nova 4, you would need to register a custom class for Main Dashboard by running the following command:

```bash
php artisan nova:dashboard Main
```

Next, move the contain on `cards` method from `App\Providers\NovaServiceProvider` class to `App\Nova\Dashboards\Main` class. 

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

### Client-side Timezone Detection

Nova 4 removes the ability to rely on the client machine time in order to display timezone related information. Instead, Nova 4 utilizes the application's "server side" timezone as defined by the timezone option in your `app` configuration file.

Please refer to our documentation regarding [timezone customization](./resources/date-fields.html#customizing-the-timezone) for more information.

### `Date` and `DateTime` Fields & HTML5

Nova 4 utilizes native `<input type="date" />` and `<input type="datetime-local" />` elements to render the `Date` and `DateTime` fields. Therefore, the following methods have been removed from Nova 4:

* `firstDayOfWeek()`
* `format()`
* `pickerFormat()`
* `pickerDisplayFormat()`
* `incrementPickerHourBy()`
* `incrementPickerMinuteBy()`

## Medium Impact Changes

### Replacing Vue Router With Inertia.js

**This change primarily affects the installation of custom tools that utilize Vue routing.**

Nova 4 has replaced Vue router with [Inertia.js](https://inertiajs.com). You should migrate from registering Vue routes to registering Inertia.js page components and backend routes. For example, given the following Nova 3 Vue router registration:

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

You should perform the following when using Nova 4:

```js
// tool.js

Nova.booting((Vue) => {
  Nova.inertia('SidebarTool', require('./component/Tool').default)
})
```

```php
// ToolServiceProvider.php

use Laravel\Nova\Nova;

Nova::router()
    ->group(function ($router) {
        $router->get('sidebar-tool', function ($request) {
            return inertia('SidebarTool');
        }
    });
```

### Event Cancellation On Save

Nova 3 ignores event cancellation when creating or updating a resource. For example, the following code will still save the `User` resource to the database:

```php
User::updating(function ($model) {
    return false;
});
``` 

However, this code will throw a `Laravel\Nova\Exceptions\ResourceSaveCancelledException` exception in Nova 4.

### `Field::default` method resolves value only for Create, Attach, and Action requests

Nova 4 will no longer resolve fields default values for Index and Detail requests, if you need to define default attribute values please utilise Eloquent's ` attributes` property, for example:

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

### Use a consistent approach to guess relationships between Laravel and Nova

Given following definition, Nova 3 will translate the relationship name as `purchase_books` while Nova 4 would translate it as `purchaseBooks`.

```php
BelongsToMany::make('Purchase Books'),
```

### `Action::actionClass` method has been removed

Nova 4 no longer give access to add custom CSS style to action confirmation modal button using values `actionClass` method and instead only handles `Action` and `DestructiveAction`. In screnario where you still needs to create custom confirmation modal please create a custom Vue Component and assign the name to `$component` property:

```php
/**
 * The action's component.
 *
 * @var string
 */
public $component = 'CustomConfirmActionModal';
```

### Batchable Queued Actions

Nova 4 now requires Job Batching when dispatching Queued Job. Before getting started, you should create a database migration to build a table to contain meta information about your job batches, such as their completion percentage. This migration may be generated using the `queue:batches-table` Artisan command:

```bash
php artisan queue:batches-table

php artisan migrate
```

## Low Impact Changes

### Change `SelectFilter::options` format to match with `Select` field

The following syntax has been updated for `SelectFilter::options` return `array` format to match `Select` field:

```php
// Before
public function options(Request $request)
{
    return [
        'yes' => ['name' => 'Yes'],
        'no' => ['name' => 'No'],
    ];
} 

// After
public function options(NovaRequest $request)
{
    return [
        'yes' => ['label' => 'Yes'],
        'no' => ['label' => 'No'],
    ]; 
}
```

### `HasOneThrough` and `HasManyThrough` fields no longer can create new relation resources

Nova 4 will no longer allow creating `HasOneThrough` or `HasManyThrough` relationship from a Resource Detail, both relationship fields should be consider as read-only.

### Reduce encoded filter string using a shorter key-value map

Nova 4 has introduce shorter key-value map which reduces the length of encoded filters string value. This changes doesn't affect bookmarked URLs however 3rd party package tool developers may require to update project code if it have deep integration with Filters Vuex store. 

### `Action::showOnTableRow` method deprecation

`Action::showOnTableRow` method has been deprecated starting on Nova 4 and we recommends everyone to update to `showInline` method instead:

```php
// Before
(new ConsolidateTransaction())->showOnTableRow(),

// AFter
(new ConsolidateTransaction())->showInline(),
```

### Changes to Authorization

Nova 4 introduce following authorization breaking changes:

* `view` policy no longer depends on `viewAny` policy.
* Action can be executed regardless of `view` and `viewAny` policy.
* Destructive Action now will use `canRun` method before checking on model policy.

Further detail regarding authorization availables on the [policy documentation](./resources/authorization.html#policies).
