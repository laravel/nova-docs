# Panels

[[toc]]

## Field Panels

If your resource contains many fields, your resource "detail" page can become crowded. For that reason, you may choose to break up groups of fields into their own "panels":

![Field Panel Example](./img/panels.png)

You may accomplish this by creating a new `Panel` instance within the `fields` method of a resource. Each panel requires a name and an array of fields that belong to that panel:

```php
use Laravel\Nova\Panel; # [!code ++] # [!code focus]
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

// ...

return [
    ID::make()->sortable(), # [!code focus:7]

    Panel::make('Profile', [ # [!code ++:5]
        Text::make('Full Name'),
        Date::make('Date of Birth'),
        Text::make('Place of Birth'),
    ]),
];
```

### Limit Displayed Fields

You may limit the amount of fields shown in a panel by default using the `limit` method:

```php
use Laravel\Nova\Panel;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

// ...

return [
    ID::make()->sortable(),

    Panel::make('Profile', [ # [!code focus:5]
        Text::make('Full Name'),
        Date::make('Date of Birth'),
        Text::make('Place of Birth'),
    ])->limit(1), # [!code ++]
];
```

Panels with a defined field limit will display a **Show All Fields** button in order to allow the user to view all of the defined fields when needed.

### Collapsable Panels 

You can also set panel to be collapsable using by adding `collapsable()` method. This method utilise JavaScript's `localStorage` feature to remember the current state:

```php
use Laravel\Nova\Panel;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

// ...

return [
    ID::make()->sortable(),

    Panel::make('Profile', [ # [!code focus:6]
        Text::make('Full Name'),
        Date::make('Date of Birth'),
        Text::make('Place of Birth'),
    ])->limit(1) # [!code --]
    ])->collapsable(), # [!code ++]
];
```

You may also indicate a panel should always be collapsed by default via the `collapsedByDefault` method:

```php
use Laravel\Nova\Panel;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

// ...

return [
    ID::make()->sortable(),

    Panel::make('Profile', [ # [!code focus:6]
        Text::make('Full Name'),
        Date::make('Date of Birth'),
        Text::make('Place of Birth'),
    ])->collapsable() # [!code --]
    ])->collapsedByDefault(), # [!code ++]
];
```

## Tabs

::: warning Beta

This is currently in beta. The API, while stable, is subject to change while in the beta period.
:::

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
                Currency::make('Price')->asMinorUnits(),
                Number::make('Tickets Available'),
                Number::make('Tickets Sold'),
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