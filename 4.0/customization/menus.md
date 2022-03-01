# Menus

[[toc]]

## Overview

By default, Nova's main sidebar menu displays all of your application's dashboards, resources, and any custom tools you have registered.

When displaying the main menu, Nova will order your dashboards according to the order they are defined inside your `App\Providers\NovaServiceProvider`. Nova will also group your resources under the "Resources" section according to the `group` property defined in the `Resource` class. Any custom tools you have registered will be listed in the order they are defined inside your `NovaServiceProvider`.

// @SCREENSHOT

## Customizing the Main Menu

While Nova's default main menu works for many applications, there are times you may wish to completely customize it for your needs. You can define your own main menu by calling the `mainMenu` method inside your `App\Providers\NovaServiceProvider` and returning the items you wish to display:

```php
<?php

namespace App\Providers;

use App\Nova\License;
use App\Nova\Release;
use App\Nova\Series;
use App\Nova\User;
use Illuminate\Http\Request;
use Laravel\Nova\Nova\Dashboards\Main;
use Laravel\Nova\Menu\Menu;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Menu\MenuSection;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Nova::mainMenu(function (Request $request) {
            return [
                MenuSection::dashboard(Main::class)->icon('chart-bar'),

                MenuSection::make('Customers', [
                    MenuItem::resource(User::class)
                    MenuItem::resource(License::class)
                ])
                    ->icon('user')
                    ->collapsable(),

                MenuSection::make('Content', [
                    MenuItem::resource(Series::class),
                    MenuItem::resource(Release::class)
                ])
                    ->icon('document-text')
                    ->collapsable(),
            ];
        });
    }
}
```

## Customizing the User Menu

Nova also allows you to change the user menu found in the upper right navigation area. You can customize Nova's user menu by calling the `userMenu` method inside your `NovaServiceProvider`:

```php
<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Laravel\Nova\Menu\Menu;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Nova;
use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Nova::userMenu(function (Request $request, Menu $menu) {
            if ($request->user()->isImpersonating()) {
                $menu->append(
                    MenuItem::make('Stop Impersonating')->path('/impersonate/stop')
                );
            }

            $menu->prepend(
                MenuItem::make('My Profile', "/resources/user/{$request->user()->getKey()}")
            );

            return $menu;
        });
    }
}
```

::: tip User Menu Logout Link
By default Nova is configured to display a "logout" link in the user menu.
:::

::: warning
Nova's user menu only supports `MenuItem` objects. Using `MenuSection` or `MenuGroup` inside the user menu will throw an `Exception`.
:::

## Appending and Prepending items to a Menu

You may call `append` and `prepend` on a menu instance to place new menu items in the menu as you wish. This is typically useful when defining a custom `userMenu` where you don't want to completely replace the existing menu:

```php
Nova::userMenu(function (Request $request, Menu $menu) {
    return $menu
        ->append(MenuItem::externalLink('API Docs', 'http://example.com'))
        ->prepend(MenuItem::link('My Profile', '/resources/users/'.$request->user()->getKey()));
    });
```

## Menu Sections

Menu sections represent a top level navigation item and are typically displayed with an icon representing it. You can create a new menu section by calling its `make` method and defining any `MenuItem` or `MenuGroup` items:

```php
MenuSection::make('Business', [
    MenuGroup::make('Licensing', [
        MenuItem::dashboard('Sales', Sales::class),
        MenuItem::resource('Licenses', License::class),
        MenuItem::resource('Refunds', License::class),
        MenuItem::externalLink('Stripe Payments', 'https://dashboard.stripe.com/payments?status%5B%5D=successful'),
    ]),
]),
```

Instead of displaying a list of links, menu sections may also be a simple link themselves. To do this, call the `make` method, and pass a path to the `path` helper:

```php
MenuSection::make('Dashboard')->path('/dashboards/main')
```

To add a menu section to a single `Dashboard` you may call the `dashboard` method and pass in the name of the class:

```php
MenuSection::dashboard('Sales', Sales::class),
```

:::warning
Menu sections that are defined as `collapsable` do not support also being a link. Calling `path` on a menu section when it's `collapseable` will result in no link being shown.
:::

You can customize the icon displayed for your menu section by calling the `icon` method on the section:

```php
MenuSection::make('Resources', [
    // items
])->icon('briefcase')
```

::: tip Heroicons
Nova utilizes the free icon set [Heroicons](https://heroicons.com/) from designer [Steve Schoger](https://twitter.com/steveschoger). You can pass in the name of the icon as a value for the `icon` method.
:::

You may make your menu sections collapsable by using the `collapsable` helper method on the section:

```php
MenuSection::make('Resources', [
    //
])->collapsable()
```

Nova will remember the open state for the section between sessions.

## Menu Groups

Sometimes you may need another logical level between your menu sections and menu items. In this case, menu groups are useful. The allow you to group menu items under their own heading:

```php
MenuSection::make('Business', [
    MenuGroup::make('Licensing', [
        MenuItem::dashboard('Sales', Sales::class),
        MenuItem::resource('Licenses', License::class),
        MenuItem::resource('Refunds', License::class),
        MenuItem::externalLink('Stripe Payments', 'https://dashboard.stripe.com/payments?status%5B%5D=successful'),
    ]),
]),
```

Nova will display the group inside the section. You may make your menu groups collapsable by using the `collapsable` helper method on the group:

```php
MenuGroup::make('Resources', [
    //
])->collapsable()
```

Nova will remember the open state for the group between sessions.

## Menu Items

Menu items represent the different links to areas inside and outside of your application. Nova ships with several convenience methods for creating different types of menu items.

To create a link to an internal area of Nova, call the `link` factory method on `MenuItem`:

```php
MenuItem::link('Cashier', '/cashier')
```

To create a menu item linking to a `Resource` index, use the `resource` factory method:

```php
MenuItem::resource('Customers', \App\Nova\User::class)
```

You can create a link to any of your `Dashboard` items by calling the `dashboard` factory method:

```php
MenuItem::dashboard('Home', \App\Nova\Dashboards\Main::class)
```

To create a link outside of your Nova application, you may use the `externalLink` factory method.

```php
MenuItem::externalLink('Documentation', 'https://nova.laravel.com/docs')
```

You may also call the `method` helper to pass in the HTTP method, request data, and any headers needed. This is typically useful for things like logout links, which should be `POST` requests.

```php
MenuItem::externalLink('Logout', 'https://api.yoursite.com/logout')
    ->method('POST', ['user' => 'hemp'], ['API_TOKEN' => 'abcdefg1234567'])
```
