# Defining Actions

[[toc]]

Nova actions allow you to perform custom tasks on one or more Eloquent models. For example, you might write an action that sends an email to a user containing account data they have requested. Or, you might write an action to transfer a group of records to another user.

Once an action has been attached to a resource definition, you may initiate it from the resource's index or detail screens:

![Action](./img/action.png)

## Overview

Nova actions may be generated using the `nova:action` Artisan command. By default, all actions are placed in the `app/Nova/Actions` directory:

```sh
php artisan nova:action EmailAccountProfile
```

To learn how to define Nova actions, let's look at an example. In this example, we'll define an action that sends an email message to a user or group of users:

```php
<?php

namespace App\Nova\Actions;

use App\AccountData;
use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class EmailAccountProfile extends Action
{
    use InteractsWithQueue, Queueable, SerializesModels;

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
     * @return array
     */
    public function fields()
    {
        return [];
    }
}
```

The most important method of an action is the `handle` method. The `handle` method receives the values for any fields attached to the action, as well as a collection of selected models. The `handle` method **always** receives a `Collection` of models, even if the action is only being performed against a single model.

Within the `handle` method, you may perform whatever tasks are necessary to complete the action. You are free to update database records, send emails, call other services, etc. The sky is the limit!

## Action Fields

Sometimes you may wish to gather additional information from the user before dispatching an action. For this reason, Nova allows you to attach most of Nova's supported [fields](./../resources/fields.md) directly to an action. When the action is initiated, Nova will prompt the user to provide input for the fields:

![Action Field](./img/action-field.png)

To add a field to an action, add the field to the array of fields returned by the action's `fields` method:

```php
use Laravel\Nova\Fields\Text;

/**
 * Get the fields available on the action.
 *
 * @return array
 */
public function fields()
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

## Action Responses

Typically, when an action is executed, a generic "success" messages is displayed in the Nova UI. However, you are free to customize this response using a variety of methods on the `Action` class.

To display a custom "success" message, you may return the result of the `Action::message` method from your `handle` method:

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

To return a red, "danger" message, you may use the `Action::danger` method:

```php
return Action::danger('Something went wrong!');
```

#### Redirect Responses

To redirect the user to an entirely new location after the action is executed, you may use the `Action::redirect` method:

```php
return Action::redirect('https://example.com');
```

#### Download Responses

To initiate a file download after the action is executed, you may use the `Action::download` method. The `download` method accepts the URL of the file to be downloaded as its first argument, and the desired name of the file as its second argument:

```php
return Action::download('https://example.com/invoice.pdf', 'Invoice.pdf');
```

## Queued Actions

Occasionally, you may have actions that take a while to finish running. For this reason, Nova makes it a cinch to [queue](https://laravel.com/docs/queues) your actions. To instruct Nova to queue an action instead of running it synchronously, mark the action with the `ShouldQueue` interface:

```php
<?php

namespace App\Nova\Actions;

use App\AccountData;
use Illuminate\Bus\Queueable;
use Laravel\Nova\Actions\Action;
use Illuminate\Support\Collection;
use Laravel\Nova\Fields\ActionFields;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class EmailAccountProfile extends Action implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    // ...
}
```

When using queued actions, don't forget to configure and start queue workers for your application. Otherwise, your actions won't be processed.

:::danger Queued Action Files

At this time, Nova does not support attaching `File` fields to a queued action. If you need to attach a `File` field to an action, the action must be run synchronously.
:::

#### Customizing The Connection And Queue

You may customize the queue connection and queue name that the action is queued on by defining the `$connection` and `$queue` properties on your action:

```php
/**
 * The name of the connection the job should be sent to.
 *
 * @var string|null
 */
public $connection = 'redis';

/**
 * The name of the queue the job should be sent to.
 *
 * @var string|null
 */
public $queue = 'emails';
```

## Action Log

It is often useful to view a log of the actions that have been run against a resource. Additionally, when queueing actions, it's often important to know when they are actually finished. Thankfully, Nova makes it a breeze to add an action log to a resource by attaching the `Laravel\Nova\Actionable` trait to the resource's corresponding Eloquent model.

For example, we may attach the `Laravel\Nova\Actionable` trait to the `User` Eloquent model:

```php
<?php

namespace App;

use Laravel\Nova\Actionable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Actionable, Notifiable;

    // ...
}
```

Once the trait has been attached to the model, Nova will automatically begin displaying an action log at the bottom of the resource's detail screen:

![Action Log](./img/action-log.png)

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
