# Tabs

[[toc]]

::: warning Beta

This is currently in beta. The API, while stable, is subject to change while in the beta period.
:::

## Overview ​

The `Tab` panel allows you to organise fields and relationships within a Resource.

```php
namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Laravel\Nova\Tabs\Tab; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\HasManyThrough;


class Event extends Resource
{
    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array # [!code focus:11]
    {
        ID::make()->sortable(),

        // ...

        Tab::group('Relations', [ # [!code ++:4]
            HasMany::make('Orders'),
            HasManyThrough::make('Tickets'),
        ]),
    }
}
```