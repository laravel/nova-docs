# Defining Actions

[[toc]]

Nova actions allow you to perform custom tasks on one or more Eloquent models. For example, you might write an action that sends an email to a user containing account data they have requested. Or, you might write an action to transfer a group of records to another user.

Once an action has been attached to a resource definition, you may initiate it from the resource's index or detail pages:

![Action](./img/action.png)

If an action is enabled for display on the resource's table row, you may also initiate the action from the resource's action dropdown menu via the resource index page. These actions are referred to as "Inline Actions":

![Inline Action](./img/inline-actions.png)

## Overview

Nova actions may be generated using the `nova:action` Artisan command. By default, all actions are placed in the `app/Nova/Actions` directory:

```bash
php artisan nova:action EmailAccountProfile
```

You may generate a [destructive action](#destructive-actions) by passing the `--destructive` option:

```bash
php artisan nova:action DeleteUserData --destructive
```

To learn how to define Nova actions, let's look at an example. In this example, we'll define an action that sends an email message to a user or group of users:

```php
<?php

namespace App\Nova\Actions;

use App\Models\AccountData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\ActionFields;

class EmailAccountProfile extends Action
{
    use InteractsWithQueue, Queueable;

    /**
    * Perform the action on the given models.
    *
    * @param  \Laravel\Nova\Fields\ActionFields  $fields
    * @param  \Illuminate\Support\Collection  $models
    * @return mixed
    */
    public function handle(ActionFields $fields, Collection $models)
    {
        foreach ($models as $model) {
            (new AccountData($model))->send();
        }
    }

    /**
    * Get the fields available on the action.
    *
    * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
    * @return array
    */
    public function fields(NovaRequest $request)
    {
        return [];
    }
}
```

The most important method of an action is the `handle` method. The `handle` method receives the values for any fields attached to the action, as well as a collection of selected models. The `handle` method **always** receives a `Collection` of models, even if the action is only being performed against a single model.

Within the `handle` method, you may perform whatever tasks are necessary to complete the action. You are free to update database records, send emails, call other services, etc. The sky is the limit!

#### Action Titles

Typically, Nova utilizes the action's class name to determine the displayable name of the action that should be shown in the action selection menu. If you would like to change the displayable name of the action, you may define a `name` property on the action class:

```php
/**
 * The displayable name of the action.
 *
 * @var string
 */
public $name = 'Action Title';
```

## Destructive Actions

You may designate an action as destructive or dangerous by defining an action class that extends `Laravel\Nova\Actions\DestructiveAction`. This will change the color of the action's confirm button to red:

![Destructive Action](./img/action-destructive.png)

::: warning Destructive Actions & Policies

When a destructive action is added to a resource that has an associated authorization policy, the policy's `delete` method must return `true` in order for the action to run.
:::

## Action Fields

Sometimes you may wish to gather additional information from the user before dispatching an action. For this reason, Nova allows you to attach most of Nova's supported [fields](./../resources/fields.md) directly to an action. When the action is initiated, Nova will prompt the user to provide input for the fields:

![Action Field](./img/action-field.png)

To add a field to an action, add the field to the array of fields returned by the action's `fields` method:

```php
use Laravel\Nova\Fields\Text;

/**
 * Get the fields available on the action.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function fields(NovaRequest $request)
{
    return [
        Text::make('Subject'),
    ];
}
```

Finally, within your action's `handle` method, you may access your fields using dynamic accessors on the provided `ActionFields` instance:

```php
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        (new AccountData($model))->send($fields->subject);
    }
}
```

#### Action Fields Default Values

You may use the `default` method to set the default value for an action field:

```php
Text::make('Subject')->default(function ($request) {
    return 'Test: Subject';
}),
```

## Action Responses

Typically, when an action is executed, a generic "success" messages is displayed in the Nova UI. However, you are free to customize this response using a variety of methods available via the `Action` class. To display a custom "success" message, you may invoke the `Action::message` method from your `handle` method:

```php
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    // ...

    return Action::message('It worked!');
}
```

To return a red, "danger" message, you may invoke the `Action::danger` method:

```php
return Action::danger('Something went wrong!');
```

### Redirect Responses

To redirect the user to an entirely new location after the action is executed, you may use the `Action::redirect` method:

```php
return Action::redirect('https://example.com');
```

To redirect the user to another location within Nova, you may use the `Action::visit` method:

```php
return Action::visit('/resources/posts/new', [
    'viaResource' => 'users',
    'viaResourceId' => 1,
    'viaRelationship' => 'posts'
]);
```

To redirect the user to a new location in a new browser tab, you may use the `Action::openInNewTab` method:

```php
return Action::openInNewTab('https://example.com');
```

### Download Responses

To initiate a file download after the action is executed, you may use the `Action::download` method. The `download` method accepts the URL of the file to be downloaded as its first argument, and the desired name of the file as its second argument:

```php
return Action::download('https://example.com/invoice.pdf', 'Invoice.pdf');
```

### Custom Modal Responses

In addition to the customization options provided before and during an action's execution, Nova also supports the ability to present a custom modal response to the user. This allows you to provide additional context or follow-up actions to the user, customized to your use-case.

For example, let's imagine you have defined an action named `GenerateApiToken`, which creates unique tokens for use with a REST API. Using a custom action response modal, you could show the user running the action a modal allowing them to copy the newly-generated API token to their clipboard.

Using the `nova:asset` Artisan command, you may [generate a custom asset](./../customization/assets.md) and register the custom modal with Nova's Vue instance:

```js
import ApiTokenCopier from './components/ApiTokenCopier'

Nova.booting(Vue => {
  Vue.component('api-token-copier', ApiTokenCopier)
})
```

Next, you may use the `modal` method within your action's `handle` method, which will instruct Nova to show the modal after running the action, passing the Vue component's name and any additional data you specify to the component:

```php
public function handle(ActionFields $fields, Collection $models)
{
    if ($models->count() > 1) {
        return Action::danger('Please run this on only one user resource.');
    }

    $models->first()->update(['api_token' => $token = Str::random(32)]);

    return Action::modal('api-token-copier', [
        'message' => 'The API token was generated!',
        'token' => $token,
    ]);
}
```

## Queued Actions

Occasionally, you may have actions that take a while to finish running. For this reason, Nova makes it a cinch to [queue](https://laravel.com/docs/queues) your actions. To instruct Nova to queue an action instead of running it synchronously, mark the action with the `ShouldQueue` interface:

```php
<?php

namespace App\Nova\Actions;

use App\AccountData;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Contacts\BatchableAction;
use Laravel\Nova\Fields\ActionFields;

class EmailAccountProfile extends Action implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    // ...
}
```

You may quickly create a queued Nova action by providing the `--queued` option when executing the `nova:action` Artisan command:

```bash
php artisan nova:action EmailAccountProfile --queued
```

When using queued actions, don't forget to configure and start [queue workers](https://laravel.com/docs/queues) for your application. Otherwise, your actions won't be processed.

:::danger Queued Action Files

At this time, Nova does not support attaching `File` fields to a queued action. If you need to attach a `File` field to an action, the action must be run synchronously.
:::

### Customizing The Connection And Queue

You may customize the queue connection and queue name that the action is queued on by setting the `$connection` and `$queue` properties within the action's constructor:

```php
/**
 * Create a new action instance.
 *
 * @return void
 */
public function __construct()
{
    $this->connection = 'redis';
    $this->queue = 'emails';
}
```

### Job Batching

You may also instruct Nova to queue actions as a [batch](https://laravel.com/docs/queues#job-batching) by marking the action with the `Laravel\Nova\Contracts\BatchableAction` interface. In addition, the action should use the `Illuminate\Bus\Batchable` trait.

When an action is batchable, you should define a `withBatch` method that will be responsible for configuring the action's [batch callbacks](https://laravel.com/docs/queues#dispatching-batches). This allows you to define code that should run after an entire batch of actions finishes executing against multiple selected resources. In fact, you can even access the model IDs for all of the models that were selected when the batched action was executed:

```php
<?php

namespace App\Nova\Actions;

use App\AccountData;
use Illuminate\Bus\Batch;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\PendingBatch;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Collection;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Contacts\BatchableAction;
use Laravel\Nova\Fields\ActionFields;

class EmailAccountProfile extends Action implements BatchableAction, ShouldQueue
{
    use Batchable, InteractsWithQueue, Queueable;

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
}
```

## Action Log

It is often useful to view a log of the actions that have been run against a particular resource. Additionally, when queueing actions, it's often important to know when the queued actions have actually finished executing. Thankfully, Nova makes it a breeze to add an action log to a resource by attaching the `Laravel\Nova\Actions\Actionable` trait to the resource's corresponding Eloquent model.

For example, we may attach the `Laravel\Nova\Actions\Actionable` trait to the `User` Eloquent model:

```php
<?php

namespace App;

use Laravel\Nova\Actions\Actionable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Actionable, Notifiable;

    // ...
}
```

Once the trait has been attached to the model, Nova will automatically begin displaying an action log at the bottom of the resource's detail page:

![Action Log](./img/action-log.png)

### Disabling The Action Log

If you do not want to record an action in the action log, you may disable this behavior by adding a `withoutActionEvents` property on your action class:

```php
/**
 * Disables action log events for this action.
 *
 * @var bool
 */
public $withoutActionEvents = true;
```

Or, using the `withoutActionEvents` method, you may disable the action log for an action when the action is attached to a resource. Disabling the action log is often particularly helpful when an action is often executed against thousands of resources at once, since it allows you to avoid thousands of slow, sequential action log database inserts:

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
        (new SomeAction)->withoutActionEvents()
    ];
}
```

### Queued Action Statuses

While a queued action is running, you may update the action's "status" for any of the models that were passed to the action via its model collection. For example, you may use the action's `markAsFinished` method to indicate that the action has completed processing a particular model:

```php
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        (new AccountData($model))->send($fields->subject);

        $this->markAsFinished($model);
    }
}
```

Or, if you would like to indicate that an action has "failed" for a given model, you may use the `markAsFailed` method:

```php
/**
 * Perform the action on the given models.
 *
 * @param  \Laravel\Nova\Fields\ActionFields  $fields
 * @param  \Illuminate\Support\Collection  $models
 * @return mixed
 */
public function handle(ActionFields $fields, Collection $models)
{
    foreach ($models as $model) {
        try {
            (new AccountData($model))->send($fields->subject);
        } catch (Exception $e) {
            $this->markAsFailed($model, $e);
        }
    }
}
```

## Action Modal Customization

By default, actions will ask the user for confirmation before running. You can customize the confirmation message, confirm button, and cancel button to give the user more context before running the action. This is done by calling the `confirmText`, `confirmButtonText`, and `cancelButtonText` methods when defining the action:

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
        (new Actions\ActivateUser)
            ->confirmText('Are you sure you want to activate this user?')
            ->confirmButtonText('Activate')
            ->cancelButtonText("Don't activate"),
    ];
}
```
