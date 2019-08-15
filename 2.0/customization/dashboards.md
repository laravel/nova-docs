# Dashboards

[[toc]]

## Overview

Nova dashboards provide a way of grouping similar information provided by [metrics](./../metrics/defining-metrics.md) or [cards](../customization/cards.md).

## Default Dashboard

Nova ships with a default dashboard which pulls cards and metrics from the `cards` method defined in  `app/Providers/NovaServiceProvider`. More information about Dashboard Metrics can be found [here](../metrics/registering-metrics.html#dashboard-metrics).

## Defining Dashboards

Custom dashboards may be generated using the `nova:dashboard` Artisan command. By default, all new dashboards will be placed in the `app/Nova/Dashboards` directory:

```
php artisan nova:dashboard UserInsights
```

Once your dashboard class has been generated, you're ready to customize it. Each dashboard metric class contains a `cards` method. This method should return an array of card or metric classes:

```php
<?php

namespace App\Nova\Dashboards;

use Laravel\Nova\Dashboard;
use App\Nova\Metrics\TotalUsers;
use App\Nova\Metrics\UsersOverTime;

class UserInsights extends Dashboard
{
    /**
     * Get the cards for the dashboard.
     *
     * @return array
     */
    public function cards()
    {
        return [
            new TotalUsers,
            new UsersOverTime,
        ];
    }
}
```

### Customizing Dashboards

By default, Nova will use the class name as the name of your dashboard. You may customize the name of the dashboard displayed in the navigation bar by overriding the `label` method within your dashboard:

```php
/**
 * Get the displayable name of the dashboard.
 *
 * @return string
 */
public static function label()
{
    return 'User Insights';
}
```

If you need to change the URI key of the dashboard that is used by Nova, you may override the `uriKey` method:

```php
/**
 * Get the URI key of the dashboard.
 *
 * @return string
 */
public static function uriKey()
{
    return 'user-insights-improved';
}
```

## Registering Dashboards

To register a dashboard, add the dashboard to the array returned by the `dashboards` method of your `app/Providers/NovaServiceProvider` class:

```php
use App\Nova\Dashboards\UserInsights;

/**
 * Get the extra dashboards that should be displayed on the Nova dashboard.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        new UserInsights,
    ];
}
```

## Authorization

If you would like to only expose a given dashboard to certain users, you may chain the `canSee` method on to your dashboard registration. The `canSee` method accepts a Closure which should return `true` or `false`. The Closure will receive the incoming HTTP request:

```php
use App\User;

/**
 * Get the extra dashboards that should be displayed on the Nova dashboard.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        (new Dashboards\UserInsights)->canSee(function ($request) {
            return $request->user()->can('viewUserInsights', User::class);
        }),
    ];
}
```

In the example above, we are using Laravel's `Authorizable` trait's can method on our `User` model to determine if the authorized user is authorized for the `viewUserInsights` action. However, since proxying to authorization policy methods is a common use-case for `canSee`, you may use the `canSeeWhen` method to achieve the same behavior. The `canSeeWhen` method has the same method signature as the `Illuminate\Foundation\Auth\Access\Authorizable` trait's `can` method:

```php
use App\User;

/**
 * Get the extra dashboards that should be displayed on the Nova dashboard.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        (new Dashboards\UserInsights)->canSeeWhen('viewUserInsights', User::class),
    ];
}
```
