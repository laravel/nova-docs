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
    public function fields(NovaRequest $request): array # [!code focus:28]
    {
        ID::make()->sortable(),

        // ...

        Tab::group('Details', [ # [!code ++:16]
            Tab::make('Purchases', [
                Currency::make('Price')->asMinorUnits()->rules('required'),
                Number::make('Tickets Available')->rules('required')->min(1),

                Number::make('Tickets Sold')->exceptOnForms()->rules('required'),
            ]),

            Tab::make('Registrations', [
                // ...
            ]),

            Tab::make('Event & Venue', [
                // ...
            ]),
        ])->showTitle(),

        Tab::group('Relations', [ # [!code ++:4]
            HasMany::make('Orders'),
            HasManyThrough::make('Tickets'),
        ]),
    }
}
```