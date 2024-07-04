# Registering Filters

[[toc]]

Once you have defined a filter, you are ready to attach it to a resource. Each resource generated by Nova contains a `filters` method. To attach a filter to a resource, you should simply add it to the array of filters returned by this method:

```php
use App\Nova\Filters\UserType; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the filters available for the resource.
 *
 * @return array<int, \Laravel\Nova\Filters\Filter>
 */
public function filters(NovaRequest $request): array # [!code focus:7]
{
    return []; # [!code --]
    return [ # [!code ++:3]
        new UserType(),
    ];
}
```

Alternatively, you may use the **make** method to instantiate your filter:

```php
use App\Nova\Filters\UserType;

// ... 

return [
    new UserType(), # [!code --] # [!code focus]
    UserType::make(), # [!code ++] # [!code focus]
];
```