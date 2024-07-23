# Dependent Fields

The `dependsOn` method allows you to specify that a field's configuration depends on one or more other field's values. The `dependsOn` method accepts an `array` of dependent field attributes and a closure that modifies the configuration of the current field instance.

Dependent fields allow advanced customization, such as toggling read-only mode, validation rules, and more based on the state of another field:

```php
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

// ...

return [
    Select::make('Purchase Type', 'type') # [!code focus:17]
        ->options([
            'personal' => 'Personal',
            'gift' => 'Gift',
        ]),

    // Recipient field configuration is customized based on purchase type...
    Text::make('Recipient')
        ->readonly()
        ->dependsOn( # [!code ++:8]
            ['type'],
            function (Text $field, NovaRequest $request, FormData $formData) {
                if ($formData->type === 'gift') {
                    $field->readonly(false)->rules(['required', 'email']);
                }
            }
        ),
];
```

To define dependent fields separately for creating and updating resources, you may use the `dependsOnCreating` and `dependsOnUpdating` methods.

## Supported Dependent Fields

The following field types may depend on other fields:

- Audio
- BelongsTo
- Boolean
- BooleanGroup
- Color
- Code
- Country
- Currency
- Date
- DateTime
- File
- Heading
- Hidden
- Image
- KeyValue
- Markdown
- MorphTo
- Number
- Password
- PasswordConfirmation
- Select
- Status
- Textarea
- Text
- Timezone
- Trix
- URL
- VaporAudio
- VaporFile
- VaporImage

The following field types may not be depended upon by other fields since they do not live-report their changes to Nova:

- Audio
- Code
- File
- Image
- KeyValue
- Status
- Tag
- Trix
- VaporAudio
- VaporFile
- VaporImage

## Toggling Field Visibility using `dependsOn`

One common use-case for dependent fields is toggling field visibility based on the value of another field. You can accomplish this using the `hide` and `show` methods:

```php
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Http\Requests\NovaRequest;

// ...

return [
    Boolean::make('Anonymous Comment', 'anonymous') # [!code focus:13]
        ->onlyOnForms()
        ->fillUsing(fn () => null)
        ->default(true),

    BelongsTo::make('User')
        ->hide() # [!code ++]
        ->rules('sometimes')
        ->dependsOn('anonymous', function (BelongsTo $field, NovaRequest $request, FormData $formData) {
            if ($formData->boolean('anonymous') === false) { # [!code ++:3]
                $field->show()->rules('required');
            }
        }),
];
```

## Dependable Computed Fields

As shown on the above example, you can only simplify `anonymous` field using the `computed` method:

```php
use Laravel\Nova\Fields\Boolean;

return [
    Boolean::make('Anonymous Comment', 'anonymous') # [!code focus:5]
        ->onlyOnForms() # [!code --:2]
        ->fillUsing(fn () => null)
        ->computed() # [!code ++]
        ->default(true),
];
```

## Setting a Field's Value Using `dependsOn`

Another common use-case for dependent fields is to set the value of a field based on the value of another field. You can accomplish this using the `setValue` method:

```php
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Http\Requests\NovaRequest;

// ...

return [
    DateTime::make('Created At'), # [!code focus:6]

    DateTime::make('Updated At')
        ->dependsOn(['created_at'], function (DateTime $field, NovaRequest $request, FormData $form) {
            $field->setValue(Carbon::parse($form->created_at)->addDays(7)); # [!code ++]
        }),
];
```

## Accessing Request Resource IDs

When interacting with dependent fields, you may retrieve the current resource and related resource IDs via the `resource` method:

```php
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\FormData;
use Laravel\Nova\Http\Requests\NovaRequest;

// ...

return [
    BelongsTo::make(__('Books'), 'books', Book::class), # [!code focus:18]

    Currency::make('Price')
        ->dependsOn('books', function (Currency $field, NovaRequest $request, FormData $formData) {
            $bookId = (int) $formData->resource(Book::uriKey(), $formData->books); # [!code ++]

            if ($bookId == 1) {
                $field->rules([
                    'required', 'numeric', 'min:10', 'max:199'
                ])->help('Price starts from $10-$199');

                return;
            }

            $field->rules([
                'required', 'numeric', 'min:0', 'max:99'
            ])->help('Price starts from $0-$99');
        }),
];
```