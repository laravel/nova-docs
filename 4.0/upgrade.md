# Upgrade Guide

[[toc]]

## High Impact Changes

### Requirements

Laravel Nova has a few requirements changes you should be aware of before upgrading:

- PHP 7.3+
- Laravel Framework 8.0+

### Updating Composer Dependencies

Update `laravel/nova` dependencies in your `composer.json` file:

```json
"laravel/nova": "^4.0",
```

Laravel Nova 4 also introduce dependency requirement changes that may impact your application if you also requires it, the details are as per following:

* Changed `doctrine/dbal` version supports from `^2.9` to `^2.13.3|^3.1.2`
* Changed `laravel/ui` version supports from `^2.0|^3.0` to `^3.3`
* Changed `symfony` packages version supports from `^5.0` to `^5.1.4`
* Removed `cakephp/chronos` and `moontoast/math` dependencies

### `$request` parameter type-hint

**Optional for PHP 7.4 and above**

In Laravel Nova 4, we have standardise the type-hint to use `Laravel\Nova\Http\Requests\NovaRequest` insteads of `Illuminate\Http\Request` except for methods that can be accessed outside of Laravel Nova requests. We advise everyone to update the following methods:

#### Resources

`fields()`, `fieldsForIndex()`, `fieldsForDetail()`, `fieldsForCreate()`, `fieldsForUpdate()`, `cards()`, `filters()`, `lenses()` and `actions()` methods has been updated from `Illuminate\Http\Request $request` to `Laravel\Nova\Http\Requests\NovaRequest $request`:

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

`fields()`, `filters()` and `actions()` methods has been updated from `Illuminate\Http\Request $request` to `Laravel\Nova\Http\Requests\NovaRequest $request`:

```php
class Lens {
    public function fields(NovaRequest $request) {} 
    public function filters(NovaRequest $request) {}
    public function actions(NovaRequest $request) {}
} 
```

#### Actions

`fields()` method has been updated from `Illuminate\Http\Request $request` to `Laravel\Nova\Http\Requests\NovaRequest $request`:

```php
class Action {
    public function fields(NovaRequest $request) {} 
}
```

#### Filters

`apply()` method has been updated from `Illuminate\Http\Request $request` to `Laravel\Nova\Http\Requests\NovaRequest $request`:

```php
class Filter {
    public function apply(NovaRequest $request, $query, $value) {}
}
```

### Main Dashboard class

In Laravel Nova 3, you would only need to define Main dashboard cards via `App\Providers\NovaServiceProvider::cards()` method. In Laravel Nova 4, you would need to register a custom class for Main Dashboard by running the following command:

```bash
php artisan nova:dashboard Main
```

Next, move the contain on `cards` method from `App\Providers\NovaServiceProvider` class to `App\Nova\Dashboards\Main` class. 

### Dynamic Dashboard classes

In Laravel Nova 4, `cards()` and `uriKey()` methods are no longer defined as `public static function`, please change it to `public function` as shown in the example below:

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

### Remove detecting timezone from browser local time

Laravel Nova 4 remove the ability to rely on client machine time to display timezone related information and instead utilise application's "server-side" timezone as defined by the timezone option in your app configuration file.

Please refer [Customizing The Timezone](./resources/date-fields.html#customizing-the-timezone) documentation for further detail.

## Medium Impact Changes

### Replacing Vue Router with Inertia.js

// @TODO

### Considers event cancellation when saving a Resource

Laravel Nova 3 ignores event cancellation when saving a Resource. As an example the following code will still trigger saving the resource.

```php
User::updating(function ($model) {
    return false;
});
``` 

Above code will cancel saving the Resource in Laravel Nova 4 and throws `Laravel\Nova\Exceptions\ResourceSaveCancelledException` excepton.

### Reduce encoded filter string using a shorter key-value map

### `Field::default()` now only resolved for Create, Attach, and Action requests

Laravel Nova 4 will no longer resolve fields default values for Index and Detail requests, if you need to define default attribute values please utilise Eloquent's ` attributes` property, for example:

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

## Low Impact Changes

### Change `SelectFilter::options()` format to match with `Select` field

// @TODO

### Use a consistent approach to guess relationships between Laravel and Laravel Nova.

// @TODO

### Remove deprecated `Action::availableForEntireResource()`

// @TODO

### Register `viewNova` policy globally

// @TODO

### `HasOneThrough` and `HasManyThrough` fields no longer can create new relation resources

// @TODO
