# Release Notes

Nova 4 continues the improvements made in Nova 3.x by introducing a thoroughly updated responsive design built on Tailwind 3, Vue 3, and Inertia.js. Don't worry - it supports dark mode. In addition, Nova 4 introduces support for collapsable relations, painless branding, notifications, action callbacks, new fields, dependent fields, filterable fields, custom menus, new metrics, batchable actions, search improvements, and much more.

### Responsive Design

Nova 4 introduces a thoroughly refreshed user interface that is now fully responsive, so you can manage your data on the go:

@SCREENSHOT

And, of course, the interface supports "dark mode":

@SCREENSHOT

### Painless Branding

A new `brand` configuration option has been added to the `nova` configuration file, allowing you to easily customize the "primary color" and logo used within the Nova interface without the need to create a custom Nova "theme":

### Collapsable Relations

Nova 4 allows you to collapse relations for a given resource type so that they are no longer loaded by default when viewing the relation. Nova will store your collapsed relations in local storage so that it remembers your preferences, resulting in drastic performance improvements when viewing resource types that have dozens of relationships:

@SCREENSHOT

### Action::then Callback

A new `Action::then` method allows you to easily execute code after an action has finished executing against all of its selected resources. This feature allows you to easily generate reports or other send notifications when an action has finished executing:

```php
/**
 * Get the actions available for the resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function actions(NovaRequest $request)
{
    return [
        (new Actions\EmailAccountProfile)->then(function ($models) {
            $models->each(function ($model) {
                //
            });
        }),
    ];
}
```

### Batchable Actions

Actions may now take advantage of Laravel's [job batching](https://laravel.com/docs/queues#job-batching) functionality, offering the ability to register batch callbacks that perform additional tasks once the entire batch of actions has finished executing:

```php
/**
 * Prepare the given batch for execution.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Bus\PendingBatch  $batch
 * @return void
 */
public function withBatch(ActionFields $fields, PendingBatch $batch)
{
    $batch->then(function (Batch $batch) {
        // All jobs completed successfully...

        $selectedModels = $batch->resourceIds;
    })->catch(function (Batch $batch, Throwable $e) {
        // First batch job failure detected...
    })->finally(function (Batch $batch) {
        // The batch has finished executing...
    });
}
```

To learn more about making actions batchable, please consult the [action batching documentation](./actions/defining-actions.md#job-batching).

### New Fields

Nova 4 introduces several new field types, including `Color`, `UiAvatar`, `MultiSelect` and `URL`. For more information on using these fields, please consult the [field documentation](./resources/fields.md).

@SCREENSHOT (Of color field?)

### Dependent Fields

Nova 4 also introduces support for "dependent" fields. The new `dependsOn` method allows you to specify that a field's configuration depends on one or more other field's values. The `dependsOn` method accepts an `array` of dependent field attributes and a closure that modifies the configuration of the current field instance.

Dependent fields allow advanced customization, such as toggling read-only mode, field value, validation rules, and more based on the state of another field:

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

// Recipient field configuration is customized based on purchase type...
Text::make('Recipient')
    ->readonly()
    ->dependsOn(
        ['type'],
        function (Text $field, NovaRequest $request, FormData $formData) {
            if ($formData->type === 'gift') {
                $field->readonly(false)->rules(['required', 'email']);
            }
        }
    ),
```

### Filterable Fields

Nova 4 introduces a new `filterable` method that allows you to enable convenient, automatic [filtering](./filters/defining-filters.md) functionality for a given field on resources, relationships, and lenses without creating a custom filter. The Nova generated filter will automatically be made available via the resource filter menu on the resource's index:

```php
DateTime::make('Created At')->filterable(),
```

![Filterable fields](./resources/img/filterable-fields-date.png)

### Notifications

Nova 4 also introduces support for "Nova notifications", a brand new notification menu within Nova that you may use to display information for your Nova users. For example, you could use this menu to notify users that a report has been generated, or that an invoice needs attention.

@SCREENSHOT (AS WELL AS CODE EXAMPLE)

### Custom Menus

In addition, Nova now supports totally custom side-bar and user menus. In fact, you can fully customize every link entry in Nova's left-side navigation bar, including the creation of menu sections, menu groups, and more:

@SCREENSHOT

To learn more about building your own custom menus, please consult the [custom menu documentation](./customization/menus.md).

### Progress Metric

The new "progress" metric allows you to track your progress towards a given goal. For example, you may wish to track your new user registrations for the month against a target goal. It's a cinch with the new progress metric:

![Progress Metric](./metrics/img/progress.png)

To learn more about building and defining metrics, please consult the [metric documentation](./metrics/defining-metrics.md).

### Resource Replication

Sometimes, you may want to create a new resource while using all of the data from an existing resource as a starting point. Nova's new resource replication feature does just that. After clicking the replicate button, you'll be whisked away to a resource creation form with all of the replicated resource's data hydrated into the form and ready for tweaking.

![Resource Replication](./img/replicate.png)

### Resource Preview Modal

The brand new resource preview modal gives you a sneak peek at the resource's data without leaving the resource index page, providing a great way to learn more about a resource without interrupting your flow.

![Resource Preview](./resources/img/resource-preview.png)

### HasOne::ofMany

The `HasOne` relationship field can now be transformed into an "has one of many" Eloquent relationship using the `ofMany` method. For example, let's assume a `User` model `hasMany` `Post` models. We may add the "has one of many" relationship to our `User` Nova resource like so:

```php
use Laravel\Nova\Fields\HasOne;

HasOne::ofMany('Latest Post', 'latestPost', 'App\Nova\Post'),
```

Of course, "morph one of many" relationships are also supported:

```php
use Laravel\Nova\Fields\MorphOne;

MorphOne::ofMany('Latest Comment', 'latestComment', 'App\Nova\Comment'),
```

### Inline HasOne Creation

Resources that have `HasOne` relationships may now create the data for those relationships directly in the parent resource's creation form. This new ability makes it a breeze to create the parent resource and its child in one, convenient operation.

![Inline Relationship Creation](./img/has-one-inline.png)

### Search Improvements

Typically, Nova searches your database columns using simple `LIKE` clauses. However, if you are using MySQL or Postgres, you may now take advantage of any full-text indexes you have defined:

```php
use Laravel\Nova\Query\Search\SearchableText;

/**
 * Get the searchable columns for the resource.
 *
 * @return array
 */
public static function searchableColumns()
{
    return ['id', new SearchableText('title')];
}
```

In addition, Nova 4 even allows you to search within a resource's relationships and JSON columns:

```php
use Laravel\Nova\Query\Search\SearchableJson;
use Laravel\Nova\Query\Search\SearchableRelation;

public static function searchableColumns()
{
    return [
        'id',
        new SearchableRelation('author', 'name')
        new SearchableJson('meta->tag')
    ];
}
```

To learn more about Nova's search features, please consult the [comprehensive search documentation](./search/README.md).
