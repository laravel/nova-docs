# Date Fields

[[toc]]

Nova offers two types of date fields: `Date` and `DateTime`. As you may have guessed, the `Date` field does not store time information, while the `DateTime` field does:

```php
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;

Date::make('Birthday')
DateTime::make('Created At')
```

### Timezones

By default, Nova users will always see dates presented in their local timezone based on their browser's locale information.

In addition, users may always set dates in their local timezone. The dates will automatically be converted to your application's "server-side" timezone as defined by the `timezone` option in your `app` configuration file.

#### Customizing The Timezone

Sometimes you may wish to explicitly define the Nova user's timezone instead of using the browser's locale information. For example, perhaps your application allows users to select their own timezone so that they always see consistent date timezones even when traveling around the world.

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
    Nova::userTimezone(function (Request $request) {
        return $request->user()->timezone;
    });
}
```

#### Format Date

MySQL datetime `2018-09-11 11:05:05` is not that readable. Luckly you can format the output of your `Date` and `DateTime` fields by calling `->format(DD MMMM YYYY)`.

```php
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\DateTime;

Date::make('Birthday')->format('DD MMM'),
DateTime::make('Created At')->format('DD MMM YYYY')
```

:::warning Format String

Nova uses [moment.js](https://momentjs.com/docs/#/parsing/string-format/) to format the frontend output dates. Make sure you are using moment supported parsing iso-8601 strings in the `format()` method. PHP date format strings will give you some funcky output.
:::
