# Release Notes

Nova 4 continues the improvements made in Nova 3 by introducing Inertia.js support, Filterable Fields, Dependent Fields, Resource Replication, Resource Preview Modals, Custom Main & User Menu, Nova Notifications, Batchable Queued Actions, New Fields, Progress Metrics, and a variety of other usability improvements.

[[toc]]

### Inertia.js

Nova 4 introduce official supports for [Inertia.js](https://inertiajs.com) as replacement for Vue router. The change would also easier custom tool and page to be developed for Laravel Nova with minimal knowledge to Vue. 

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

::: tip Routing Helper
The `Nova::router()` helper will automatically configures `nova.domain`, `nova.path` and `nova.middleware` to the registered route group.
:::

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

Nova 4 introduce `filterable` method and allows you to create magic filter based on the given field on Resource, Related Resource and Lenses. This method by default is called without any parameters:

```php
BelongsTo::make('User')->filterable(),
```

You may also customised it to accept a callback to execute custom query such as:

```php
Text::make('Email')->filterable(function ($request, $query, $value, $attribute) {
    $query->where($attribute, 'LIKE', "{$value}%");
}),
```

### Dependent Fields

Nova 4 introduce `dependsOn` method and allows you to customize how a field can depends on another field(s) values. The method accept an `array` of dependent field attributes and a callback to modify the configuration of current field instance, this allows further customisation such as toggling read-only, field value, validation rules etc.

```php
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

Select::make('Purchase Type', 'type')
    ->options([
        'personal' => 'Personal',
        'gift' => 'Gift',
    ]),

// Receiver field should only be enabled only when Purchase Type has been set 
// to "gift" and enable "required" and "email" validation rules.
Text::make('Receiver')
    ->readonly()
    ->dependsOn(
        ['type'], 
        function (Text $field, NovaRequest $request, FormData $formData) {
            if ($formData->type === 'gift') {
                $field->readonly(false)
                    ->rules(['required', 'email']);
            }
        }
    ),
```

### Replicating Resource

Nova 4 introduce the ability to replicate a resource and this is enabled by default now as long as the user has `create` and `update` ability enabled. You can also create custom authorization specifically for replication by adding `replicate` method to the resource Model Policy class. For example, if you want to disable replicating User resource you can add the following to `UserPolicy`:

```php
/**
 * Determine whether the user can replicate the model.
 *
 * @param  \App\Models\User  $user
 * @param  \App\Models\User  $model
 * @return mixed
 */
public function replicate(User $user, User $model)
{
    return false;
}
```

### Resource Preview

Nova 4 introduce a detail preview feature on resource index to allows users see a quick-view of the detail without having to navigate out of current view. The feature are available for most fields by adding `showOnPreview`, e.g:

```php
Text::make('Name')->showOnPreview(),
```

### Custom User Menu

Nova 4 now allows full customization on the User Menu. For example, you can create a link to own resource detail by adding the following to `boot` method on `App\Providers\NovaServiceProvider`:

```php
use Illuminate\Http\Request;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Nova;

Nova::userMenu(function (Request $request) {
    return [
        MenuItem::make('My Account')->path('/resources/users/'.$request->user()->id),
    ];
});
```

### Batchable Queued Actions

Nova 4 now requires Job Batching when dispatching Queued Job. Before getting started, you should create a database migration to build a table to contain meta information about your job batches, such as their completion percentage. This migration may be generated using the `queue:batches-table` Artisan command:

```bash
php artisan queue:batches-table

php artisan migrate
```

Next, Nova allows you to configure job batching completion callbacks by registering the callbacks from `withBatch` method:

```php
use Illuminate\Bus\Batch;
use Illuminate\Bus\PendingBatch;
use Laravel\Nova\Fields\ActionFields;

/**
 * Register `then`, `catch` and `finally` event on batchable job.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Bus\PendingBatch  $batch
 * @return void
 */
public function withBatch(ActionFields $fields, PendingBatch $batch)
{
    $batch->then(function (Batch $batch) {
        // All jobs completed successfully...
    })->catch(function (Batch $batch, Throwable $e) {
        // First batch job failure detected...
    })->finally(function (Batch $batch) {
        // The batch has finished executing...
    });
}
```

To learn more about Batchable Queued Actions, please consult [the documentation](./actions/defining-actions.html#queued-actions).

### Search Relations

Nova 4 now includes support to natively allows searching columns as well as relations and JSON path: 

```php
use CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Nova\Query\Search\Column;
use Laravel\Nova\Query\Search\FullText;
use Laravel\Nova\Query\Search\JsonSelector;
use Laravel\Nova\Query\Search\PrimaryKey;
use Laravel\Nova\Query\Search\MorphRelation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return [
        new PrimaryKey('id'), 
        new Column('slug'),
        new FullText('title'),
        new Relation('author', 'name'),
        new MorphRelation('commentable', 'title', ['App\Nova\Post']),
        new JsonSelector('meta->address->postcode'),
        function (Builder $query, string $search) {
            $date = rescue(function () {
                return CarbonImmutable::parse($search);
            }, null, false);

            if (! is_null($date) {
                $query->orWhereBetween($query->qualifyColumn('created_at'), [
                    $date->startOfDay(),
                    $date->endOfDay(),
                ]);
            }

            return $query;
        },
    ];
}
```

This also can be simplify with:


```php
use CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Laravel\Nova\Query\Search\FullText;
use Laravel\Nova\Query\Search\MorphRelation;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return [
        'id', 
        'slug',
        new FullText('title'),
        'author.name',
        new MorphRelation('commentable', 'title', ['App\Nova\Post']),
        'meta->address->postcode',
        function (Builder $query, string $search) {
            $date = rescue(function () {
                return CarbonImmutable::parse($search);
            }, null, false);

            if (! is_null($date) {
                $query->orWhereBetween($query->qualifyColumn('created_at'), [
                    $date->startOfDay(),
                    $date->endOfDay(),
                ]);
            }

            return $query;
        },
    ];
}
```


To learn more about Search Relations, please consult [the documentation](./search/#search-relations).

### New Fields

Nova 4 includes 3 new native fields:

* [Color](./resources/fields.html#color-field)
* [MultiSelect](./resources/fields.html#multiselect-field)
* [URL](./resources/fields.html#url-field)

```php
use Laravel\Nova\Fields\Color;
use Laravel\Nova\Fields\MultiSelect;
use Laravel\Nova\Fields\URL;

return [
    Color::make('Color', 'label_color'),

    MultiSelect::make('Size')->options([
        'S' => 'Small',
        'M' => 'Medium',
        'L' => 'Large',
    ])->displayUsingLabels(),

    URL::make('GitHub URL'),
];
```

### New Progress Metric

Progress metrics display current progress againsts target value via a bar chart. For example, a progress metric might display the number of active users created againsts total users:

// @SCREENSHOT

Progress metrics may be generated using the `nova:progress` Artisan command. By default, all new metrics will be placed in the `app/Nova/Metrics` directory:

```bash
php artisan nova:progress ActiveUsers
```

### Nova Notification

Nova 4 also introduce a new Notification Panel which implements Laravel Notification implementing `Laravel\Nova\Notifications\NovaChannel`. You can create custom notification using the following code:

```php
use Illuminate\Support\Facades\URL;
use Laravel\Nova\Notifications\NovaNotification;

$request->user()->notify(
    NovaNotification::make()
        ->message('Document ready for download')
        ->url(URL::signedRoute('download-file', ['file' => $file]))
);
```

### Preventing Accidental Form Abandonment

Nova 4 now will automatically add Prevent Form Abandonment to Resource CRUD and Action Modal, it'll now warn users when they attempt to abandon the form.
