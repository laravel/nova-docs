# Localization

[[toc]]

### Overview

Nova may be fully localized using Laravel's [localization services](https://laravel.com/docs/localization). After running the `nova:install` command during installation. Your application will contain a `lang/vendor/nova` translation directory.

Within this directory, you may customize the `en.json` file or create a new JSON translation file for your language. In addition, the `en` directory contains a few additional validation translation lines that are utilized by Nova.

#### Creating New Localization Files

To quickly create a new translation file for your language, you may execute the `nova:translate` Artisan command. This command will simply copy the default `en.json` translation file, allowing you to begin translating the strings into your own language:

```bash
php artisan nova:translate es
```

#### User Locale Overrides

Laravel Nova frontend libraries, including the browser, Numbro.js, Luxon, and other libraries will utilize the locale value available via `app()->getLocale()` by default. However, if your application is only using ISO 639-1 language codes (`en`), you may wish to consider migrating your languages to IETF language tags (`en-US`, `en-GB`) for wider support across the various frontend libraries used by Nova. 

To map your existing locales to IETF language tags, you may use the `Nova::userLocale` method. Typically, you should invoke this method in the `boot` method of your application's `NovaServiceProvider`:

```php
namespace App\Providers;

use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Boot any application services.
     */
    public function boot(): void
    {
        parent::boot();

        Nova::userLocale(function () { # [!code ++:7] # [!code focus:7]
            return match (app()->getLocale()) {
                'en' => 'en-US',
                'de' => 'de-DE',
                default => null,
            };
        });

        //
    }
}
```

### Resources

Resource names may be localized by overriding the `label` and `singularLabel` methods on the resource class:

```php
namespace App\Nova;

class Post extends Resource
{
    /**
     * Get the displayable label of the resource.
     *
     * @return string
     */
    public static function label() # [!code focus:4]
    {
        return __('Posts');
    }

    /**
     * Get the displayable singular label of the resource.
     *
     * @return string
     */
    public static function singularLabel() # [!code focus:4]
    {
        return __('Post');
    }
}
```

To customize labels for the resource's create and update buttons, you may override the `createButtonLabel` and `updateButtonLabel` methods on the resource:

```php
namespace App\Nova;

class Post extends Resource
{
    /**
     * Get the text for the create resource button.
     *
     * @return string|null
     */
    public static function createButtonLabel() # [!code focus:4]
    {
        return __('Publish Post');
    }

    /**
     * Get the text for the update resource button.
     *
     * @return string|null
     */
    public static function updateButtonLabel() # [!code focus:4]
    {
        return __('Save Changes');
    }
}
```

### Fields

Field names may be localized when you attach the field to your resource. The first argument to all fields is its display name, which you may customize. For example, you might localize the title of an email address field like so:

```php
namespace App\Nova;

use Laravel\Nova\Fields\Text;

class User extends Resource
{
    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            Text::make(__('Email Address'), 'email_address'), # [!code focus]
        ];
    }
}
```

### Relationships

Relationship field names may be customized by localizing the first argument passed to their field definition. The second and third arguments to Nova relationship fields are the relationship method name and the related Nova resource, respectively:

```php
namespace App\Nova;

use Laravel\Nova\Fields\HasMany;

class User extends Resource
{
    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            HasMany::make(__('Posts'), 'posts', Post::class), # [!code focus]
        ];
    }
}
```

In addition, you should also override the `label` and `singularLabel` methods on the related resource:

```php
namespace App\Nova;

class Post extends Resource
{
    /**
     * Get the displayable label of the resource.
     *
     * @return string
     */
    public static function label() # [!code focus:4]
    {
        return __('Posts');
    }

    /**
     * Get the displayable singular label of the resource.
     *
     * @return string
     */
    public static function singularLabel() # [!code focus:4]
    {
        return __('Post');
    }
}
```

### Filters

Filter names may be localized by overriding the `name` method on the filter class:

```php
/**
 * Get the displayable name of the filter.
 *
 * @return string
 */
public function name() # [!code focus:4]
{
    return __('Admin Users');
}
```

### Lenses

Lens names may be localized by overriding the `name` method on the lens class:

```php
/**
 * Get the displayable name of the lens.
 *
 * @return string
 */
public function name() # [!code focus:4]
{
    return __('Most Valuable Users');
}
```

### Actions

Action names may be localized by overriding the `name` method on the action class:

```php
/**
 * Get the displayable name of the action.
 *
 * @return string
 */
public function name() # [!code focus:4]
{
    return __('Email Account Profile');
}
```

### Metrics

Metric names may be localized by overriding the `name` method on the metric class:

```php
/**
 * Get the displayable name of the metric.
 *
 * @return string
 */
public function name() # [!code focus:4]
{
    return __('Total Users');
}
```

### Frontend

To propagate your localizations to the frontend, you should call the `Nova::translations` method within the `boot` method of your application's `App\Providers\NovaServiceProvider` class:

```php
namespace App\Providers;

use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Boot any application services.
     */
    public function boot(): void
    {
        parent::boot();

        Nova::serving(function () { # [!code ++:3] # [!code focus:3]
            Nova::translations($pathToFile);
        });

        //
    }
}
```

You may also pass an array of key / value pairs representing each localization:

```php
namespace App\Providers;

use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Boot any application services.
     */
    public function boot(): void
    {
        parent::boot();

        Nova::serving(function () { # [!code ++:5] # [!code focus:5]
            Nova::translations([
                'Total Users' => 'Total Users'
            ]);
        });

        //
    }
}
```

As in Laravel, you may use the `__` helper within your custom Vue components to access these translations. To accomplish this, add the following mixins to your Inertia page component or Vue component:

```vue
<template>
  <h2>{{ __('Total Users') }}</h2> // [!code focus]
</template>

<script>
import { Localization } from 'laravel-nova' // [!code focus:7]

export default {
  mixins: [Localization]

  // ...
}
</script>
```

If your components use the Vue Composition API, you may use the `useLocalization` composable to localize your component:

```vue
<template>
  <h2>{{ __('Total Users') }}</h2> // [!code focus]
</template>

<script setup>
import { useLocalization } from 'laravel-nova' // [!code focus]

const { __ } = useLocalization() // [!code focus]

// ...
</script>
```

