# Validation

[[toc]]

Unless you like to live dangerously, any Nova fields that are displayed on the Nova creation / update screens will need some validation. Thankfully, it's a cinch to attach all of the Laravel validation rules you're familiar with to your Nova resource fields. Let's get started.

## Rules

### Attaching Rules

When defining a field on a resource, you may use the `rules` method to attach [validation rules](https://laravel.com/docs/validation#available-validation-rules) to the field:

```php
Text::make('Name')
    ->sortable()
    ->rules('required', 'max:255'),
```

Of course, if you are leveraging Laravel's support for [validation rule objects](https://laravel.com/docs/validation#using-rule-objects), you may attach those to resources as well:

```php
use App\Rules\ValidState;

Text::make('State')
    ->sortable()
    ->rules('required', new ValidState),
```

Additionally, you may use [custom Closure rules](https://laravel.com/docs/validation#using-closures) to validate your resource fields:

```php
Text::make('State')
    ->sortable()
    ->rules('required', function($attribute, $value, $fail) {
        if (strtoupper($value) !== $value) {
            return $fail('The '.$attribute.' field must be uppercase.');
        }
    }),
```

### Creation Rules

If you would like to define rules that only apply when a resource is being created, you may use the `creationRules` method:

```php
Text::make('Email')
    ->sortable()
    ->rules('required', 'email', 'max:255')
    ->creationRules('unique:users,email')
    ->updateRules('unique:users,email,{{resourceId}}'),
```

### Update Rules

Likewise, if you would like to define rules that only apply when a resource is being updated, you may use the `updateRules` method. If necessary, you may use `resourceId` place-holder within your rule definition. This place-holder will automatically be replaced with the primary key of the resource being updated:

```php
Text::make('Email')
    ->sortable()
    ->rules('required', 'email', 'max:255')
    ->creationRules('unique:users,email')
    ->updateRules('unique:users,email,{{resourceId}}'),
```

## After Validation Hooks

Nova also provides several methods that allow you to perform tasks after a resource has been validated:

* [`afterValidation`](#after-validation-method)
* [`afterCreationValidation`](#after-creation-validation-method)
* [`afterUpdateValidation`](#after-update-validation-method)

#### The `afterValidation` Method

The `afterValidation` method will always be called after a resource has been validated during its creation or during an update. This method will be called before calling `afterCreationValidation` or `afterUpdateValidation`:

```php
/**
 * Handle any post-validation processing.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @param  \Illuminate\Validation\Validator  $validator
 * @return void
 */
protected static function afterValidation(NovaRequest $request, $validator)
{
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong with this field!');
    }
}
```

#### The `afterCreationValidation` Method

The `afterCreationValidation` method will be called after a resource that is being created has been validated:

```php
/**
 * Handle any post-creation validation processing.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @param  \Illuminate\Validation\Validator  $validator
 * @return void
 */
protected static function afterCreationValidation(NovaRequest $request, $validator)
{
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong with this field!');
    }
}
```

#### The `afterUpdateValidation` Method

The `afterCreationValidation` method will be called after a resource that is being updated has been validated:

```php
/**
 * Handle any post-update validation processing.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @param  \Illuminate\Validation\Validator  $validator
 * @return void
 */
protected static function afterUpdateValidation(NovaRequest $request, $validator)
{
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add('field', 'Something is wrong with this field!');
    }
}
```
