# Date Fields

[[toc]]

Nova offers two types of date fields: `Date` and `DateTime`. As you may have guessed, the `Date` field does not store time information while the `DateTime` field does:

```php
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;

Date::make('Birthday'),
DateTime::make('Created At'),
```

### Options

#### Steps

By default, Nova will set a minimum "step" of 1 day for `Date` fields and 1 second for `DateTime` fields. You may modify the "step" value for both of these fields by providing an integer or `Carbon\CarbonInterval` to the field's `step` methods:

```php
use Carbon\CarbonInterval;

Date::make('Expired On')->step(7),
Date::make('Expired On')->step(CarbonInterval::weeks(1)),

DateTime::make('Published At')->step(60),
DateTime::make('Published At')->step(CarbonInterval::minutes(1)),
```

#### Minimum and Maximum Values

Sometimes you may wish to explicitly define minimum and maximum values for `Date` or `DateTime` fields. This can be done by passing a valid date expression, a date format supported by `strtotime`, or an instance of `Carbon\CarbonInterface` to the `min` and `max` methods of these fields:

```php
use Carbon\Carbon;

Date::make('Expired On')
    ->min('tomorrow')
    ->max('next week'),

Date::make('Expired On')
    ->min(Carbon::tomorrow())
    ->max(Carbon::today()->addWeek(1)),
```

### Timezones

By default, Nova users will always see dates presented in your application's "server-side" timezone as defined by the `timezone` configuration option in your application's `config/app.php` configuration file.

#### Customizing The Timezone

Sometimes you may wish to explicitly define the Nova user's timezone instead of using the application's timezone configuration. For example, perhaps your application allows users to select their own timezone so that they always see consistent date timezones even when traveling around the world.

To accomplish this, you may use the `Nova::userTimezone` method. Typically you should call this method in the `boot` method of your application's `NovaServiceProvider`:

```php
use Laravel\Nova\Nova;
use Illuminate\Http\Request;

/**
 * Bootstrap any application services.
 *
 * @return void
 */
public function boot()
{
    parent::boot();

    Nova::userTimezone(function (Request $request) {
        return $request->user()?->timezone;
    });
}
```
