# Global Search

[[toc]]

Nova not only allows you to search within specific resources and relationships, you may also globally search across all your resources using the global search input within the top-navigation bar of the Nova administration panel:

![Global Search](./img/global-search.png)

### Title / Subtitle Attributes

When a resource is shown within the search results, the results will display the "title" of the resource. For example, a `User` resource may use the `name` attribute as its title. Then, when the resource is shown within the global search results, that attribute will be displayed.

To customize the "title" attribute of a resource, you may define a `title` property on the resource class:

```php
public static $title = 'name';
```

Alternatively, you may override the resource's `title` method:

```php
/**
 * Get the value that should be displayed to represent the resource.
 *
 * @return string
 */
public function title()
{
    return $this->name;
}
```

#### Subtitles

You may also display a smaller "subtitle" attribute within the global search results. The subtitle will be placed directly under the title attribute. In this screenshot, you can see that the `Post` resource's author is displayed as a subtitle, allowing the quick identification of who wrote the post:

![Global Search](./img/global-search.png)

To define a resource's subtitle, override the `subtitle` method of the resource:

```php
/**
 * Get the search result subtitle for the resource.
 *
 * @return string
 */
public function subtitle()
{
    return "Author: {$this->user->name}";
}
```

:::tip Eager Loading

If your subtitle accesses information on a related resource, you should consider adding the related resource to your resource's [eager load array](./../resources/README.md#eager-loading).
:::

### Disabling Global Search

By default, all Nova resources are globally searchable; however, you may exclude a given resource from the global search by overriding the `globallySearchable` property on the resource:

```php
/**
 * Indicates if the resoruce should be globally searchable.
 *
 * @var bool
 */
public static $globallySearchable = false;
```
