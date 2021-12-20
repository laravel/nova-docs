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
    'title', 'author',
];
```

:::warning Scout Integration

If you are using Nova's Scout integration, the `$search` column has no effect on your search results and may be ignored. You should manage the searchable columns in the Algolia dashboard.
:::

## Search Relations

// @TODO

### Polymorphic Relationship

// @TODO

## Search JSON paths

// @TODOs
