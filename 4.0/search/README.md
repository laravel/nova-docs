# The Basics

[[toc]]

## Searchable Columns

To define which resource fields are searchable, you may assign an array of database columns to the `search` property of your resource class. This array includes the `id` column by default:

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

## Full-Text Indexes

Typically, Nova searches your database columns using simple `LIKE` clauses. However, if you are using MySQL or Postgres, you may take advantage of any full-text indexes you have defined. To do so, you should define a `searchableColumns` method on your Nova resource class instead of defining a `$search` property. This method should return an array of columns that are searchable. By returning an instance of `Laravel\Nova\Query\Search\FullText` you may instruct Nova to utilize your full-text indexes when querying a given column:

```php
use Laravel\Nova\Query\Search\FullText;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new FullText('title')];
}
```

## Searching Relationships

Laravel Nova also allows you to search again a resource's related models. For example, imagine a `Post` model that is related to a `User` model via a `author` relatonship. This relationship may be queried by returning an instance of `Laravel\Nova\Query\Search\Relation` from your resource's `searchableColumns` method. If this method does not exist on your resource, you may define it. Once the `searchableColumns` method has been defined, you may remove the `$search` property from your resource:

```php
use Laravel\Nova\Query\Search\Relation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new Relation('author', 'name')];
}
```

Alternatively, you may define a relationship field that should be search by adding the field to your resource's `$search` property using "dot notation":

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

### MorphTo Relationships

"Morph to" relationships can be made searchable by returning an instance of `Laravel\Nova\Query\Search\MorphRelation` from your resource's `searchableColumns` method. The `MorphRelation` instance allows you to specify which types of morphed models should be searched:

```php
use Laravel\Nova\Query\Search\MorphRelation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new MorphRelation('commentable', 'title', ['App\Nova\Post'])];
}
```

## Searching JSON Data

If your resource includes a column that contains a JSON string. You may search within the JSON object by returning a `Laravel\Nova\Query\Search\JsonSelector` instance from your resource's `searchableColumns` method. If this method does not exist on your resource, you may define it. Once the `searchableColumns` method has been defined, you may remove the `$search` property from your resource:

```php
use Laravel\Nova\Query\Search\JsonSelector;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new JsonSelector('meta->address->postcode')];
}
```
