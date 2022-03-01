# Dashboards

[[toc]]

## Overview

Nova dashboards provide a convenient way to build information overview pages that contain a variety of [metrics](./../metrics/defining-metrics.md) and [cards](../customization/cards.md).

### Default Dashboard

Nova ships with a default dashboard which displays the cards and metrics returned by the `cards` method defined in your application's `App/Providers/NovaServiceProvider` class. To learn more about dashboard metrics, please consult our comprehensive documentation on [metrics](../metrics/registering-metrics.html#dashboard-metrics).

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
            new TotalUsers,
            new UsersOverTime,
        ];
    }
}
```

#### Dashboard Names

By default, Nova will use the class name as the name of your dashboard. You may customize the name of the dashboard displayed in the left-side navigation bar by overriding the `label` method within your dashboard class:

```php
/**
 * Get the displayable name of the dashboard.
 *
 * @return string
 */
public function label()
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
use App\Nova\Dashboards\UserInsights;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
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

If you would like to only expose a given dashboard to certain users, you may invoke the `canSee` method when registering your dashboard. The `canSee` method accepts a closure which should return `true` or `false`. The closure will receive the incoming HTTP request:

```php
use App\Models\User;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
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
use App\Models\User;

/**
 * Get the dashboards that should be listed in the Nova sidebar.
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
