# Date Fields

[[toc]]

Nova offers two types of date fields: `Date` and `DateTime`. As you may have guessed, the `Date` field does not store time information while the `DateTime` field does:

```php
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array
{
    return [
        Date::make('Birthday'), # [!code focus:2]
        DateTime::make('Created At'),
    ];
}
```

### Options

#### Steps

By default, Nova will set a minimum "step" of 1 day for `Date` fields and 1 second for `DateTime` fields. You may modify the "step" value for both of these fields by providing an integer to the field's `step` methods:

```php
use Carbon\CarbonInterval;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array
{
    return [
        Date::make('Expired On') # [!code focus:2]
            ->step(604800), # [!code ++]

        DateTime::make('Published At') # [!code focus:2]
            ->step(60), # [!code ++]
    ];
}
```

Alternatively, you can also provide an integer or `Carbon\CarbonInterval` to the field's `step` methods:

```php
use Carbon\CarbonInterval; # [!code ++]
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array
{
    return [
        Date::make('Expired On') # [!code focus:3]
            ->step(604800), # [!code --]
            ->step(CarbonInterval::weeks(1)), // equivalent to 604800 seconds. # [!code ++]

        DateTime::make('Published At') # [!code focus:3]
            ->step(60), # [!code --]
            ->step(CarbonInterval::minutes(1)), // equivalent to 60 seconds. # [!code ++]
    ];
}
```

#### Minimum and Maximum Values

Sometimes you may wish to explicitly define minimum and maximum values for `Date` or `DateTime` fields. This can be done by passing a valid date expression, a date format supported by `strtotime`, or an instance of `Carbon\CarbonInterface` to the `min` and `max` methods of these fields:

```php
use Illuminate\Support\Carbon;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array
{
    return [
        Date::make('Expired On') # [!code focus:3]
            ->min('tomorrow') # [!code ++:2]
            ->max('next week'),

        DateTime::make('Published At') # [!code focus:3]
            ->min(Carbon::tomorrow()) # [!code ++:2]
            ->max(Carbon::today()->addWeek(1)),
    ];
}
```

### Timezones

By default, Nova users will always see dates presented in your application's "server-side" timezone as defined by the `timezone` configuration option in your application's `config/app.php` configuration file.

#### Customizing the Timezone

Sometimes you may wish to explicitly define the Nova user's timezone instead of using the application's timezone configuration. For example, perhaps your application allows users to select their own timezone so that they always see consistent date timezones even when traveling around the world.

To accomplish this, you may use the `Nova::userTimezone` method. Typically you should call this method in the `boot` method of your application's `NovaServiceProvider`:

```php
namespace App\Providers;

use Illuminate\Http\Request;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        parent::boot();

        Nova::userTimezone(function (Request $request) { # [!code ++:3] # [!code focus:3]
            return $request->user()?->timezone;
        });

        //
    }
}
```
