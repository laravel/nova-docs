# Scout Integration

[[toc]]

By default, Nova searches your resources using the resource's database columns.
 However, this can become inefficient and lacks support for robust fuzzy matching capabilities provided by dedicated search engines.

For this reason, Nova integrates seamlessly with [Laravel Scout](https://laravel.com/docs/scout). When the `Laravel\Scout\Searchable` trait is attached to a model associated with a Nova resource, Nova will automatically begin using Scout when performing searches against that resource. There is no other configuration required.

## Customizing Scout Searches

If you would like to call methods on the `Laravel\Scout\Builder` instance before it executes your search query against your search engine, you may override the `scoutQuery` method on your resource:

```php
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Build a Scout search query for the given resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @param  \Laravel\Scout\Builder  $query
 * @return \Laravel\Scout\Builder
 */
public static function scoutQuery(NovaRequest $request, $query)
{
    return $query;
}
```

### Limiting Scout Search Results

You can customize the amount of search results returned from your Scout search engine by defining the `scoutSearchResults` property on the resource class that is associated with the Scout searchable model:

```php
/**
 * The number of results to display when searching the resource using Scout.
 *
 * @var int
 */
public static $scoutSearchResults = 200;
```

## Disabling Scout Search

You may disable Scout search support for a specific resource by defining a `usesScout` method on the resource class. When Scout search support is disabled, simple database queries will be used to search against the given resource, even if the associated resource model includes the Scout `Searchable` trait:

```php
/**
 * Determine if this resource uses Laravel Scout.
 *
 * @return bool
 */
public static function usesScout()
{
    return false;
}
```
