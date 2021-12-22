# Release Notes

Nova 4 continues the improvements made in Nova 3 by introducing Inertia.js supports ... and a variety of other bug fixes and usability improvements.

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

### Filterable Fields
### Dependable Fields
### Replicating Resource
### Resource Preview
### Custom Main & User Menu
### Nova Notification
### Batchable Queued Actions
### New Color, MultiSelect and URL Field
### New Progress Metric
