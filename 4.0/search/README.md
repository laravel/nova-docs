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

If you are using Nova's Scout integration, the `$search` property has no effect on your search results and may be ignored. You should manage the searchable columns within the Algolia or Meilisearch dashboard.
:::

## Full-Text Indexes

Typically, Nova searches your database columns using simple `LIKE` clauses. However, if you are using MySQL or Postgres, you may take advantage of any full-text indexes you have defined. To do so, you should define a `searchableColumns` method on your Nova resource class instead of defining a `$search` property.

The `searchableColumns` method should return an array of columns that are searchable. You may include an instance of `Laravel\Nova\Query\Search\FullText` within this array to instruct Nova to utilize your full-text indexes when querying a given column:

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

Laravel Nova also allows you to search against a resource's related models. For example, imagine a `Post` model that is related to a `User` model via an `author` relatonship. You may indicate that this relationship data should be considered when searching for users by returning an instance of `Laravel\Nova\Query\Search\Relation` from your resource's `searchableColumns` method.

If the `searchableColumns` method does not exist on your resource, you should define it. Once the `searchableColumns` method has been defined, you may remove the `$search` property from your resource:

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

For convenience, you may define a relationship that should be searched by adding the field to your resource's `$search` property using "dot notation":

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

"Morph to" relationships can be made searchable by returning an instance of `Laravel\Nova\Query\Search\MorphRelation` from your resource's `searchableColumns` method. The `MorphRelation` class allows you to specify which types of morphed models should be searched:

```php
use App\Nova\Post;
use Laravel\Nova\Query\Search\MorphRelation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new MorphRelation('commentable', 'title', [Post::class])];
}
```

## Searching JSON Data

If the database table associated with your resource includes a column that contains a JSON string, you may instruct Nova to search within the JSON string by returning a `Laravel\Nova\Query\Search\JsonSelector` instance from your resource's `searchableColumns` method.

If the `searchableColumns` method does not exist on your resource, you should define it. Once the `searchableColumns` method has been defined, you may remove the `$search` property from your resource:

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
