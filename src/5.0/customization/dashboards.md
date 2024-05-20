# Dashboards

[[toc]]

## Overview

Nova dashboards provide a convenient way to build information overview pages that contain a variety of [metrics](./../metrics/defining-metrics.md) and [cards](../customization/cards.md).

![Dashboard](./img/dashboard.png)

### Default Dashboard

Nova ships with a default `App\Nova\Dashboards\Main` dashboard class containing a `cards` method. You can customize which cards are present on the default dashboard via this method:

```php
/**
 * Get the cards that should be displayed on the Nova dashboard.
 *
 * @return array
 */
public function cards()
{
    return [
        new Help,
    ];
}
```

More information regarding dashboard metrics can be found [within our documentation on metrics](../metrics/registering-metrics.html#dashboard-metrics).

## Defining Dashboards

Custom dashboards may be generated using the `nova:dashboard` Artisan command. By default, all new dashboards will be placed in the `app/Nova/Dashboards` directory:

```bash
php artisan nova:dashboard UserInsights
```

Once your dashboard class has been generated, you're ready to customize it. Each dashboard class contains a `cards` method. This method should return an array of card or metric classes:

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
            TotalUsers::make(),
            UsersOverTime::make(),
        ];
    }
}
```

#### Dashboard Names

By default, Nova will use the dashboard's class name to determine the displayable name of your dashboard that should be placed in the left-side navigation bar. You may customize the name of the dashboard displayed in the left-side navigation bar by overriding the `name` method within your dashboard class:

```php
/**
 * Get the displayable name of the dashboard.
 *
 * @return string
 */
public function name()
{
    return 'User Insights';
}
```

#### Dashboard URI Keys

If you need to change the URI of the dashboard, you may override the dashboard class' `uriKey` method. Of course, the URI represents the browser location that Nova will navigate to in when you click on the dashboard link in the left-side navigation bar:

```php
/**
 * Get the URI key of the dashboard.
 *
 * @return string
 */
public function uriKey()
{
    return 'user-insights-improved';
}
```

## Registering Dashboards

To register a dashboard, add the dashboard to the array returned by the `dashboards` method of your application's `App/Providers/NovaServiceProvider` class. Once you have added the dashboard to this method, it will become available for navigation in Nova's left-side navigation bar:

```php
use App\Nova\Dashboards\Main;
use App\Nova\Dashboards\UserInsights;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        Main::make(),
        UserInsights::make(),
    ];
}
```

#### Customizing Dashboard Menus

You can customize the dashboard's menu by defining a `menu` method on your dashboard class:

```php
use Illuminate\Http\Request;
use Laravel\Nova\Menu\MenuItem;

/**
 * Get the menu that should represent the dashboard.
 *
 * @return \Laravel\Nova\Menu\MenuItem
 */
public function menu(Request $request)
{
    return parent::menu($request)->withBadge(function () {
        return 'NEW!';
    });
}
```

Please refer to the documentation on [menu customization](./menus) for more information.

### Refreshing Dashboard Metrics

Occasionally, you may wish to refresh all the metrics' values inside your dashboard. You may do this by enabling the refresh button by using the `showRefreshButton` method on the dashboard instance:

```php
use App\Nova\Dashboards\Main;
use App\Nova\Dashboards\UserInsights;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        Main::make(),
        UserInsights::make()->showRefreshButton(),
    ];
}
```

### Authorization

If you would like to only expose a given dashboard to certain users, you may invoke the `canSee` method when registering your dashboard. The `canSee` method accepts a closure which should return `true` or `false`. The closure will receive the incoming HTTP request:

```php
use App\Models\User;
use App\Nova\Dashboards\Main;
use App\Nova\Dashboards\UserInsights;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        Main::make(),
        UserInsights::make()->canSee(function ($request) {
            return $request->user()->can('viewUserInsights', User::class);
        }),
    ];
}
```

In the example above, we are using Laravel's `Authorizable` trait's can method on our `User` model to determine if the authorized user is authorized for the `viewUserInsights` action. However, since proxying to authorization policy methods is a common use-case for `canSee`, you may use the `canSeeWhen` method to achieve the same behavior. The `canSeeWhen` method has the same method signature as the `Illuminate\Foundation\Auth\Access\Authorizable` trait's `can` method:

```php
use App\Models\User;
use App\Nova\Dashboards\Main;
use App\Nova\Dashboards\UserInsights;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
 *
 * @return array
 */
protected function dashboards()
{
    return [
        Main::make(),
        UserInsights::make()->canSeeWhen('viewUserInsights', User::class),
    ];
}
```
