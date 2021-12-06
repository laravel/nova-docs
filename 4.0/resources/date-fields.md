# Date Fields

[[toc]]

Nova offers two types of date fields: `Date` and `DateTime`. As you may have guessed, the `Date` field does not store time information, while the `DateTime` field does:

```php
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;

Date::make('Birthday'),

DateTime::make('Created At'),
```

### Timezones

By default, Nova users will always see dates presented in your application's "server-side" timezone as defined by the `timezone` option in your `app` configuration file.

#### Customizing The Timezone

Sometimes you may wish to explicitly define the Nova user's timezone instead of using the application's "server-side" timezone information. For example, perhaps your application allows users to select their own timezone so that they always see consistent date timezones even when traveling around the world.

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
        return $request->user()->timezone;
    });
}
```
