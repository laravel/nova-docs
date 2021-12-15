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

## Medium Impact Changes

### Replacing Vue Router with Inertia.js

### Considers event cancellation when saving a Resource

### Reduce encoded filter string using a shorter key-value map

## Low Impact Changes

### Change `SelectFilter::options()` format to match with `Select` field

### Use a consistent approach to guess relationships between Laravel and Laravel Nova.

### Remove deprecated `Action::availableForEntireResource()`

### Register `viewNova` policy globally

### `HasOneThrough` and `HasManyThrough` fields no longer can create new relation resources
