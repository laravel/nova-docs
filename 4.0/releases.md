# Release Notes

Nova 4 continues the improvements made in Nova 3 by introducing Inertia.js supports, Filterable Fields, Dependable Fields, Resource Replication, Resource Preview, Custom Main & User Menu, Nova Notification, Batchable Queued Actions, New Fields, New Progress Metric  and a variety of other bug fixes and usability improvements.

[[toc]]

### Inertia.js

Nova 4 introduce official supports for [Inertia.js](https://inertiajs.com) as replacement for Vue Router. The change would also easier custom tool and page to be developed for Laravel Nova with minimal knowledge to Vue. 

```js
Nova.booting((Vue, store) => {
  Nova.inertia('ProfilePage', require('./pages/ProfilePage').default)
})
```

Above code would register `ProfilePage` inertia page component to be used within Nova. Next, to create the route on Laravel you would need to write the following code:

```php
use Illuminate\Http\Request;
use Illuminate\Routing\Router;
use Laravel\Nova\Nova;

Nova::router()
    ->group(function (Router $router) {
        $router->get('profile', function (Request $request) {
            return inertia('ProfilePage', [
                'profile' => $request->user(),
            ]);
        });
    });
```

#### Navigation Helpers

With the introduction of Inertia.js, Nova 4 also now offer a new `Laravel\Nova\URL` class to handle creating relative and remote URL to be use between backend and frontend: 

```php
use Laravel\Nova\URL;

URL::make('/resources/users/3'); // returns '/nova/resources/users/3'

URL::remote('https://nova.laravel.com'); // returns 'https://nova.laravel.com'
```

On the frontend, you also have access to `url` and `visit` helpers to generate relative URL and trigger Inertia.js visit:

```js
Nova.url('/resources/users/2') // returns /nova/resources/users/2

Nova.visit('/resources/users/2') // navigate to /nova/resources/users/2
Nova.visit({ url: 'https://nova.laravel.com', remote: true }) // navigate out of Laravel Nova to https://nova.laravel.com
```
### Filterable Fields
### Dependable Fields
### Replicating Resource
### Resource Preview

Nova 4 introduce a detail preview feature on resource index to allows users see a quick-view of the detail without having to navigate out of current view. The feature are available for most fields by adding `showOnPreview`, e.g:

```php
Text::make('Name')->showOnPreview(),
```

### Custom Main & User Menu
### Nova Notification
### Batchable Queued Actions
### New Color, MultiSelect and URL Field
### New Progress Metric
