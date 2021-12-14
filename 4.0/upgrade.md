# Upgrade Guide

[[toc]]

## High Impact Changes

### PHP 7.3.0 Required

The new minimum PHP version is now 7.3.0.

### Updating Composer Dependencies

Update `laravel/nova` dependencies in your `composer.json` file:

```json
"laravel/nova": "^4.0",
```

Laravel Nova 4 also introduce dependency requirement changes as per following:

* Changed `doctrine/dbal` version supports from `^2.9` to `^2.13.3|^3.1.2`.
* Changed `laravel/ui` version supports from `^2.0|^3.0` to `^3.3`.
* Changed `symfony` packages version supports from `^5.0` to `^5.1.4`.
* Removed `cakephp/chronos` and `moontoast/math` dependencies.

### `$request` parameter type-hint

**Optional for PHP 7.4 and above**

In Laravel Nova 4, we have standardise the type-hint to use `Laravel\Nova\Http\Requests\NovaRequest` insteads of `Illuminate\Http\Request`. We advise everyone to update the following methods:

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

## Medium Impact Changes

