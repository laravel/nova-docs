# The Basics

[[toc]]

## Searchable Columns

To define which resource fields are searchable, you may assign an array of database columns in the `search` property of your resource class. This includes `id` column by default, but you may override it to your needs:

```php
/**
 * The columns that should be searched.
 *
 * @var array
 */
public static $search = [
    'id', 'title', 'content',
];
```

:::warning Scout Integration

If you are using Nova's Scout integration, the `$search` column has no effect on your search results and may be ignored. You should manage the searchable columns in the Algolia dashboard.
:::

## Search Relations

Aside from current resource attributes, you may also search relation by using `{relation}.{attribute}` notation, for example the below code would search `name` on `author` relation for the resource:

```php
/**
 * The columns that should be searched.
 *
 * @var array
 */
public static $search = [
    'id', 'author.name'
];
```

### MorphTo Relationship

MorphTo relationship requires a different syntax where you would needs to filter types for the query, this can be done by using `Laravel\Nova\Searching\MorphToSearch`:

```php
use Laravel\Nova\Searching\MorphToSearch;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new MorphToSearch('commentable', 'title', ['App\Nova\Post'])];
}
```

## Search JSON paths

You can also search JSON path by using `{attribute}->{path}`, for example the below code would search for `address.postcode` under `meta` attribute for the resource:

```php
/**
 * The columns that should be searched.
 *
 * @var array
 */
public static $search = [
    'id', 'meta->address->postcode'
];
```
