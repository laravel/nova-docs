# Validation

[[toc]]

Unless you like to live dangerously, any Nova fields that are displayed on the Nova creation / update pages will need some validation. Thankfully, it's a cinch to attach all of the Laravel validation rules you're familiar with to your Nova resource fields. Let's get started.

## Rules

### Attaching Rules

When defining a field on a resource, you may use the `rules` method to attach [validation rules](https://laravel.com/docs/validation#available-validation-rules) to the field:

```php
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array
{
    return [
        Text::make('Name') # [!code focus:2]
            ->rules('required', 'max:255'),  # [!code ++]
    ];
}
```

Of course, if you are leveraging Laravel's support for [validation rule objects](https://laravel.com/docs/validation#using-rule-objects), you may attach those to resources as well:

```php
use App\Rules\ValidState;
use Laravel\Nova\Fields\Text;

// ...

return [
    Text::make('Name') # [!code focus:2]
        ->rules('required', new ValidState),  # [!code ++]
];
```

You may also provide rules to the `rules` method via an array or Closure:

```php
use App\Rules\ValidState; # [!code ++]
use Laravel\Nova\Fields\Text;

// ...

return [
    // Using an array... # [!code focus:3]
    Text::make('Shipping State')
        ->rules(['required', new ValidState]), # [!code ++]

    // Using a Closure... # [!code focus:6]
    Text::make('Billing State')
        ->rules(fn ($request) => [ # [!code ++:4]
            'required', 
            new ValidState(),
        ]);
];
```

Additionally, you may use [custom closure rules](https://laravel.com/docs/validation#using-closures) to validate your resource fields:

```php
use Laravel\Nova\Fields\Text;

// ...

return [
    Text::make('State') # [!code focus:9]
        ->rules('required', function ($attribute, $value, $fail) { # [!code ++:5]
            if (strtoupper($value) !== $value) {
                return $fail('The '.$attribute.' field must be uppercase.');
            }
        }),
];
```

### Creation Rules

If you would like to define rules that only apply when a resource is being created, you may use the `creationRules` method:

```php
use Laravel\Nova\Fields\Text;

// ...

return [
    Text::make('Email') # [!code focus:3]
        ->rules('required', 'email', 'max:255')
        ->creationRules('unique:users,email'), # [!code ++]
];
```

### Update Rules

Likewise, if you would like to define rules that only apply when a resource is being updated, you may use the `updateRules` method. If necessary, you may use `resourceId` place-holder within your rule definition. This place-holder will automatically be replaced with the primary key of the resource being updated:

```php
use Laravel\Nova\Fields\Text;

// ...

return [
    Text::make('Email') # [!code focus:4]
        ->rules('required', 'email', 'max:255')
        ->creationRules('unique:users,email')
        ->updateRules('unique:users,email,{{resourceId}}'), # [!code ++]
];
```

## After Validation Hooks

Nova also provides several methods that allow you to perform tasks after a resource has been validated, providing the opportunity to perform more custom validation before the resource is persisted to the database:

* [`afterValidation`](#after-validation-method)
* [`afterCreationValidation`](#after-creation-validation-method)
* [`afterUpdateValidation`](#after-update-validation-method)

#### The `afterValidation` Method

The `afterValidation` method will always be called after a resource has been validated during its creation or during an update. This method will be called before calling `afterCreationValidation` or `afterUpdateValidation`:

```php
namespace App\Nova;

use Illuminate\Contracts\Validation\Validator as ValidatorContract; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * Handle any post-validation processing.
     *
     * @return void
     */
    protected static function afterValidation( # [!code ++:8] # [!code focus:8]
        NovaRequest $request, 
        ValidatorContract $validator
    ) {
        if (self::somethingElseIsInvalid()) {
            $validator->errors()->add('field', 'Something is wrong with this field!');
        }
    }
}s
```

#### The `afterCreationValidation` Method

The `afterCreationValidation` method will be called after a resource that is being created has been validated:

```php
namespace App\Nova;

use Illuminate\Contracts\Validation\Validator as ValidatorContract; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * Handle any post-creation validation processing.
     * 
     * @return void
     */
    protected static function afterCreationValidation( # [!code ++:8] # [!code focus:8]
        NovaRequest $request, 
        ValidatorContract $validator
    ) {
        if (self::somethingElseIsInvalid()) {
            $validator->errors()->add('field', 'Something is wrong with this field!');
        }
    }
}
```

#### The `afterUpdateValidation` Method

The `afterUpdateValidation` method will be called after a resource that is being updated has been validated:

```php
namespace App\Nova;

use Illuminate\Contracts\Validation\Validator as ValidatorContract; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * Handle any post-update validation processing.
     *
     * @return void
     */
    protected static function afterUpdateValidation( # [!code ++:9] # [!code focus:9]
        NovaRequest $request, 
        ValidatorContract $validator
    ) {
        if (self::somethingElseIsInvalid()) {
            $validator->errors()->add('field', 'Something is wrong with this field!');
        }
    }
}
```

