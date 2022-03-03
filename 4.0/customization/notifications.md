# Notifications

[[toc]]

## Overview

Nova notifications allow you to notify Nova users of events within your application, such as a report being ready to download or of an invoice that needs attention. Nova notifications are displayed within a slide-out menu that can be accessed via the "bell" icon within Nova's top navigation menu.

![Notifications](./../img/notifications.png)

## Sending Notifications

To send a notification, you simple need to send a `NovaNotification` instance to a user's `notify` method. Of course, before getting started, you should ensure that your user model is [notifiable](https://laravel.com/docs/notifications).

Nova notifications may be generated via the `NovaNotification` class, which provides convenient methods like `message`, `action`, `icon`, and `type`. The currently supported notification types include `success`, `error`, `warning`, and `info`:

```php
use Laravel\Nova\Notifications\NovaNotification;

$request->user()->notify(
    NovaNotification::make()
        ->message('Your report is ready to download.')
        ->action('Download', 'https://example.com/report.pdf')
        ->icon('download')
        ->type('info')
);
```

#### Notification Icons

Nova utilizes the free [Heroicons](https://heroicons.com/) icon set by [Steve Schoger](https://twitter.com/steveschoger). Therefore, you may simply specify the name of one of these icons when providing the icon name to the Nova notification's `icon` method.
