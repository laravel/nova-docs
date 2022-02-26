# Fields

[[toc]]

## Defining Fields

Each Nova resource contains a `fields` method. This method returns an array of fields, which generally extend the `Laravel\Nova\Fields\Field` class. Nova ships with a variety of fields out of the box, including fields for text inputs, booleans, dates, file uploads, Markdown, and more.

To add a field to a resource, you may simply add it to the resource's `fields` method. Typically, fields may be created using their static `make` method. This method accepts several arguments; however, you usually only need to pass the "human readable" name of the field. Nova will automatically "snake case" this string to determine the underlying database column:

```php
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

/**
 * Get the fields displayed by the resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function fields(NovaRequest $request)
{
    return [
        ID::make()->sortable(),
        Text::make('Name')->sortable(),
    ];
}
```

### Field Column Conventions

As noted above, Nova will "snake case" the displayable name of the field to determine the underlying database column. However, if necessary, you may pass the column name as the second argument to the field's `make` method:

```php
Text::make('Name', 'name_column'),
```

## Showing / Hiding Fields

Often, you will only want to display a field in certain situations. For example, there is typically no need to show a `Password` field on a resource index listing. Likewise, you may wish to only display a `Created At` field on the creation / update forms. Nova makes it a breeze to hide / show fields on certain pages.

The following methods may be used to show / hide fields based on the display context:

- `showOnIndex`
- `showOnDetail`
- `showOnCreating`
- `showOnUpdating`
- `showOnPreview`
- `hideFromIndex`
- `hideFromDetail`
- `hideWhenCreating`
- `hideWhenUpdating`
- `onlyOnIndex`
- `onlyOnDetail`
- `onlyOnForms`
- `exceptOnForms`

You may chain any of these methods onto your field's definition in order to instruct Nova where the field should be displayed:

```php
Text::make('Name')->hideFromIndex(),
```

Alternatively, you may pass a callback to the following methods.

- `showOnIndex`
- `showOnDetail`
- `showOnCreating`
- `showOnUpdating`
- `hideFromIndex`
- `hideFromDetail`
- `hideWhenCreating`
- `hideWhenUpdating`

For `show*` methods, the field will be displayed if the given callback returns `true`:

```php
Text::make('Name')->showOnIndex(function () {
    return $this->name === 'Taylor Otwell';
}),
```

For `hide*` methods, the field will be hidden if the given callback returns `true`:

```php
Text::make('Name')->hideFromIndex(function () {
    return $this->name === 'Taylor Otwell';
}),
```

### Resource Preview Modal

You may also define which fields should be included in the resource's "preview" modal. This modal can be displayed for a given resource by the user when viewing the resource's index:

```php
Text::make('Name')->showOnPreview(),
```

// @SCREENSHOT

## Dynamic Field Methods

If your application requires it, you may specify a separate list of fields for specific display contexts. For example, imagine you have a resource with the following list of fields:

```php
/**
 * Get the fields displayed by the resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function fields(NovaRequest $request)
{
    return [
        Text::make('First Name'),
        Text::make('Last Name'),
        Text::make('Job Title'),
    ];
}
```

On your detail page, you may wish to show a combined name via a computed field, followed by the job title. In order to do this, you could add a `fieldsForDetail` method to the resource class which returns a separate list of fields that should only be displayed on the resource's detail page:

```php
/**
 * Get the fields displayed by the resource on detail page.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function fieldsForDetail(NovaRequest $request)
{
    return [
        Text::make('Name', function () {
            return sprintf('%s %s', $this->first_name, $this->last_name);
        }),

        Text::make('Job Title'),
    ];
}
```

The available methods that may be defined for individual display contexts are:

- `fieldsForIndex`
- `fieldsForDetail`
- `fieldsForCreate`
- `fieldsForUpdate`

:::tip Dynamic Field Methods Precedence ::
The `fieldsForIndex`, `fieldsForDetail`, `fieldsForCreate`, and `fieldsForUpdate` methods always take precedence over the `fields` method.
:::

## Default Values

There are times you may wish to provide a default value to your fields. Nova offers this functionality via the `default` method, which accepts a value or callback. This value will be used as the field's default input value on the resource's creation view:

```php
BelongsTo::make('Name')->default($request->user()->getKey()),

Text::make('Uuid')->default(function ($request) {
    return Str::orderedUuid();
}),
```

## Field Placeholder Text

By default, the placeholder text of a field will be it's name. You can override the placeholder text of a field that supports placeholders by using the `placeholder` method:

```php
Text::make('Name')->placeholder('My New Post'),
```

## Field Hydration

On every create or update request that Nova receives for a given resource, each field's corresponding model attribute will automatically be filled before the model is persisted to the database. If necessary, you may customize the hydration behavior of a given field using the `fillUsing` method:

```php
Text::make('Name', 'name')
    ->fillUsing(function ($request, $model, $attribute, $requestAttribute) {
        $model->{$attribute} = Str::title($request->input($attribute));
    }),
```

## Field Panels

If your resource contains many fields, your resource "detail" page can become crowded. For that reason, you may choose to break up groups of fields into their own "panels":

![Field Panel Example](./img/panels.png)

You may accomplish this by creating a new `Panel` instance within the `fields` method of a resource. Each panel requires a name and an array of fields that belong to that panel:

```php
use Laravel\Nova\Panel;

/**
 * Get the fields displayed by the resource.
 *
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
 * @return array
 */
public function fields(NovaRequest $request)
{
    return [
        ID::make()->sortable(),

        new Panel('Address Information', $this->addressFields()),
    ];
}

/**
 * Get the address fields for the resource.
 *
 * @return array
 */
protected function addressFields()
{
    return [
        Place::make('Address', 'address_line_1')->hideFromIndex(),
        Text::make('Address Line 2')->hideFromIndex(),
        Text::make('City')->hideFromIndex(),
        Text::make('State')->hideFromIndex(),
        Text::make('Postal Code')->hideFromIndex(),
        Country::make('Country')->hideFromIndex(),
    ];
}
```

You may limit the amount of fields shown in a panel by using the `limit` method:

```php
(new Panel('Profile', [
    Text::make('Full Name'),
    Date::make('Date of Birth'),
    Text::make('Place of Birth'),
]))->limit(1),
```

Panels with a defined field limit will display a **Show All Fields** button in order to allow the user to view all of the defined fields when needed.

## Sortable Fields

When attaching a field to a resource, you may use the `sortable` method to indicate that the resource index may be sorted by the given field:

```php
Text::make('Name', 'name_column')->sortable(),
```

## Field Types

:::tip Relationship Fields

This portion of the documentation only discusses non-relationship fields. To learn more about relationship fields, [check out their documentation](./relationships.html).
:::

Nova ships with a variety of field types. So, let's explore all of the available types and their options:

- [Avatar](#avatar-field)
- [Badge](#badge-field)
- [Boolean](#boolean-field)
- [Boolean Group](#boolean-group-field)
- [Code](#code-field)
- [Color](#color-field)
- [Country](#country-field)
- [Currency](#currency-field)
- [Date](#date-field)
- [DateTime](#datetime-field)
- [File](#file-field)
- [Gravatar](#gravatar-field)
- [Heading](#heading-field)
- [ID](#id-field)
- [Image](#image-field)
- [KeyValue](#keyvalue-field)
- [Markdown](#markdown-field)
- [MultiSelect](#multiselect-field)
- [Number](#number-field)
- [Password](#password-field)
- [Place](#place-field)
- [Select](#select-field)
- [Sparkline](#sparkline-field)
- [Status](#status-field)
- [Stack](#stack-field)
- [Text](#text-field)
- [Textarea](#textarea-field)
- [Timezone](#timezone-field)
- [Trix](#trix-field)
- [URL](#url-field)
- [Vapor File](#vapor-file-field)
- [Vapor Image](#vapor-image-field)

### Avatar Field

The `Avatar` field extends the [Image field](#image-field) and accepts the same options and configuration:

```php
use Laravel\Nova\Fields\Avatar;

Avatar::make('Avatar'),
```

If a resource contains an `Avatar` field, that field will be displayed next to the resource's title when the resource is displayed in search results:

![Avatar Search Results](./img/avatar-search-results.png)

You may use the `squared` method to display the image's thumbnail with squared edges. Additionally, you may use the `rounded` method to display its thumbnails with fully-rounded edges:

```php
Avatar::make('Avatar')->squared(),
```

### Badge Field

The `Badge` field can be used to display the status of a `Resource` in the index and detail views:

```php
use Laravel\Nova\Fields\Badge;

Badge::make('Status', function () {
    return User::statuses[$this->status];
}),
```

By default, the `Badge` field supports four variations: `info`, `success`, `danger`, and `warning`. You may define your possible field values and their associated badge types using the `map` method:

```php
Badge::make('Status')->map([
    'draft' => 'danger',
    'published' => 'success',
]),
```

Alternatively, you may use the `types` method to completely replace the built-in badge types and their associated CSS classes. The CSS classes may be provided as a string or an array:

```php
Badge::make('Status')->types([
    'draft' => 'font-medium text-gray-600',
    'published' => ['font-bold', 'text-green-600'],
]),
```

If you only wish to supplement the built-in badge types instead of overwriting all of them, you may use the `addTypes` method:

```php
Badge::make('Status')->addTypes([
    'draft' => 'custom classes',
]),
```

:::tip Editing Badge Types

By default the `Badge` field is not shown on a resource's edit or update pages. If you wish to modify the underlying value represented by the `Badge` field on your edit forms, define another field in combination with the `onlyOnForms` field option.
:::

### Boolean Field

The `Boolean` field may be used to represent a boolean / "tiny integer" column in your database. For example, assuming your database has a boolean column named `active`, you may attach a `Boolean` field to your resource like so:

```php
use Laravel\Nova\Fields\Boolean;

Boolean::make('Active'),
```

#### Customizing True / False Values

If you are using values other than `true`, `false`, `1`, or `0` to represent "true" and "false", you may instruct Nova to use the custom values recognized by your application. To accomplish this, chain the `trueValue` and `falseValue` methods onto your field's definition:

```php
Boolean::make('Active')
    ->trueValue('On')
    ->falseValue('Off'),
```

### Boolean Group Field

The `BooleanGroup` field may be used to group a set of Boolean checkboxes, which are then stored as JSON key-values in the database column they represent. You may create a `BooleanGroup` field by providing a set of keys and labels for each option:

```php
use Laravel\Nova\Fields\BooleanGroup;

BooleanGroup::make('Permissions')->options([
    'create' => 'Create',
    'read' => 'Read',
    'update' => 'Update',
    'delete' => 'Delete',
]),
```

The user will be presented with a grouped set of checkboxes which, when saved, will be converted to JSON format:

```json
{
  "create": true,
  "read": false,
  "update": false,
  "delete": false
}
```

Before using this field type, you should ensure that the underlying Eloquent attribute is configured to cast to an `array` (or equivalent) within your Eloquent model class:

```php
protected $casts = [
    'permissions' => 'array'
];
```

Sometimes, you may wish to exclude values that are `true` or `false` from display to avoid cluttering the representation of the field. You may accomplish this by invoking the `hideFalseValues` or `hideTrueValues` methods on the field definition:

```php
BooleanGroup::make('Permissions')->options([
    'create' => 'Create',
    'read' => 'Read',
    'update' => 'Update',
    'delete' => 'Delete',
])->hideFalseValues(),

BooleanGroup::make('Permissions')->options([
    'create' => 'Create',
    'read' => 'Read',
    'update' => 'Update',
    'delete' => 'Delete',
])->hideTrueValues(),
```

If the underlying field is empty, Nova will display "No Data". You may customize this text using the `noValueText` method:

```php
BooleanGroup::make('Permissions')->options([
    'create' => 'Create',
    'read' => 'Read',
    'update' => 'Update',
    'delete' => 'Delete',
])->noValueText('No permissions selected.'),
```

### Code Field

The `Code` fields provides a beautiful code editor within your Nova administration panel. Generally, code fields should be attached to `TEXT` database columns:

```php
use Laravel\Nova\Fields\Code;

Code::make('Snippet'),
```

You may also attach `Code` fields to `JSON` database columns. By default, the field will display the value as a JSON string. You may cast the underlying Eloquent attribute to `array`, `collection`, `object`, or `json` based on your application's needs:

```php
use Laravel\Nova\Fields\Code;

Code::make('Options')->json(),
```

:::tip Code Fields On The Index

By default, Nova will never display a `Code` field on a resource index listing.
:::

#### Editing JSON

If you intend to use a given `Code` field instance to only edit JSON, you may chain the `json` method onto your field definition:

```php
Code::make('Options')->json(),
```

:::warning Code Field JSON Validation

Nova does not automatically apply the `json` validation rule to `Code` fields. This rule must be manually specified during validation if you wish for it to be applied.
:::

#### Syntax Highlighting

You may customize the language syntax highlighting of the `Code` field using the `language` method:

```php
Code::make('Snippet')->language('php'),
```

The `Code` field's currently supported languages are:

- `dockerfile`
- `htmlmixed`
- `javascript`
- `markdown`
- `nginx`
- `php`
- `ruby`
- `sass`
- `shell`
- `sql`
- `twig`
- `vim`
- `vue`
- `xml`
- `yaml-frontmatter`
- `yaml`

### Color Field

The `Color` field generate a color picker using the HTML5 `color` input element:

```php
use Laravel\Nova\Fields\Color;

Color::make('Color', 'label_color'),
```

### Country Field

The `Country` field generates a `Select` field containing a list of the world's countries. The field will store the country's corresponding two-letter code:

```php
use Laravel\Nova\Fields\Country;

Country::make('Country', 'country_code'),
```

### Currency Field

The `Currency` field generates a `Number` field that is automatically formatted using the `brick/money` PHP package. Nova will use `USD` as the default currency; however, this can be changed by modifying the `nova.currency` configuration value:

```php
use Laravel\Nova\Fields\Currency;

Currency::make('Price'),
```

You may override the currency on a per-field basis using the `currency` method:

```php
Currency::make('Price')->currency('EUR'),
```

You may use the `min`, `max`, and `step` methods to set their corresponding attributes on the generated `input` control:

```php
Currency::make('price')->min(1)->max(1000)->step(0.01),
```

:::warning Currency Step Limitation

If you plan to customize the currency "step" amount using the `step` method, you should ensure you always call the `step` method after the `currency`, `asMinorUnits`, and `asMajorUnits` methods. Calling these methods after the `step` method will override the `step` method's behavior.
:::

The field's locale will respect the value in your application's `app.locale` configuration value. You can override this behavior by providing a locale code to the `locale` method:

```php
Currency::make('Price')->locale('fr'),
```

### Date Field

The `Date` field may be used to store a date value (without time). For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](./date-fields.md):

```php
use Laravel\Nova\Fields\Date;

Date::make('Birthday'),
```

### DateTime Field

The `DateTime` field may be used to store a date-time value. For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](./date-fields.md):

```php
use Laravel\Nova\Fields\DateTime;

DateTime::make('Updated At')->hideFromIndex(),
```

### File Field

To learn more about defining file fields and handling uploads, please refer to the comprehensive [file field documentation](./file-fields.md).

```php
use Laravel\Nova\Fields\File;

File::make('Attachment'),
```

### Gravatar Field

The `Gravatar` field does not correspond to any column in your application's database. Instead, it will display the "Gravatar" image of the model it is associated with.

By default, the Gravatar URL will be generated based on the value of the model's `email` column. However, if your user's email addresses are not stored in the `email` column, you may pass a custom column name to the field's `make` method:

```php
use Laravel\Nova\Fields\Gravatar;

// Using the "email" column...
Gravatar::make(),

// Using the "email_address" column...
Gravatar::make('Avatar', 'email_address'),
```

You may use the `squared` method to display the image's thumbnail with squared edges. Additionally, you may use the `rounded` method to display the images with fully-rounded edges:

```php
Gravatar::make('Avatar', 'email_address')->squared(),
```

### Heading Field

The `Heading` field does not correspond to any column in your application's database. It is used to display a banner across your forms and can function as a separator for long lists of fields:

![Heading Field](./img/heading-field.png)

```php
use Laravel\Nova\Fields\Heading;

Heading::make('Meta'),
```

If you need to render HTML content within the `Heading` field, you may invoke the `asHtml` method when defining the field:

```php
Heading::make('<p class="text-danger">* All fields are required.</p>')->asHtml(),
```

::: tip Headings & The Index Page

`Heading` fields are automatically hidden from the resource index page.
:::

### Hidden Field

The `Hidden` field may be used to pass any value that doesn't need to be changed by the user but is required for saving the resource:

```php
Hidden::make('Slug'),

Hidden::make('Slug')->default(Str::random(64)),
```

Combined with [default values](#default-values), `Hidden` fields are useful for passing things like related IDs to your forms:

```php
Hidden::make('User', 'user_id')->default(function ($request) {
    return $request->user()->id;
}),
```

### ID Field

The `ID` field represents the primary key of your resource's database table. Typically, each Nova resource you define should contain an `ID` field. By default, the `ID` field assumes the underlying database column is named `id`; however, you may pass the column name as the second argument to the `make` method if necessary:

```php
use Laravel\Nova\Fields\ID;

ID::make(),

ID::make('ID', 'id_column'),
```

If your application contains very large integer IDs, you may need to use the `asBigInt` method in order for the Nova client to correctly render the integer:

```php
ID::make()->asBigInt(),
```

### Image Field

The `Image` field extends the [File field](#file-field) and accepts the same options and configurations. The `Image` field, unlike the `File` field, will display a thumbnail preview of the underlying image when viewing the resource:

```php
use Laravel\Nova\Fields\Image;

Image::make('Photo'),
```

By default, the `Image` field allows the user to download the linked file. To disable downloads, you may use the `disableDownload` method on the field definition:

```php
Image::make('Photo')->disableDownload(),
```

You may use the `squared` method to display the image's thumbnail with squared edges. Additionally, you may use the `rounded` method to display its thumbnails with fully-rounded edges.

:::tip File Fields

To learn more about defining file fields and handling uploads, check out the comprehensive [file field documentation](./file-fields.md).
:::

### KeyValue Field

The `KeyValue` field provides a convenient interface to edit flat, key-value data stored inside `JSON` column types. For example, you might store profile information inside a [JSON column type](https://laravel.com/docs/eloquent-mutators#array-and-json-casting) named `meta`:

```php
use Laravel\Nova\Fields\KeyValue;

KeyValue::make('Meta')->rules('json'),
```

Given the field definition above, the following interface would be rendered by Nova:

![Key/Value Field](./img/key-value-field.png)

#### Customizing KeyValue Labels

You can customize the text values used in the component by calling the `keyLabel`, `valueLabel`, and `actionText` methods when defining the field. The `actionText` method customizes the "add row" button text:

```php
KeyValue::make('Meta')
    ->keyLabel('Item')
    ->valueLabel('Label')
    ->actionText('Add Item'),
```

:::tip KeyValue Fields & The Index Page

By default, Nova will never display a `KeyValue` field on a resource index listing.
:::

If you would like to disable the user's ability to edit the keys of the field, you may use the `disableEditingKeys` method to accomplish this. Disabling editing keys with the `disableEditingKeys` method will automatically disable adding rows as well:

```php
KeyValue::make('Meta')->disableEditingKeys(),
```

You may also remove the user's ability to add new rows to the field by chaining the `disableAddingRows` method onto the field's definition:

```php
KeyValue::make('Meta')->disableAddingRows(),
```

In addition, you may also wish to remove the user's ability to delete exisiting rows in the field. You may accomplish this by invoking the `disableDeletingRows` method when defining the field:

```php
KeyValue::make('Meta')->disableDeletingRows(),
```

### Markdown Field

The `Markdown` field provides a WYSIWYG Markdown editor for its underlying Eloquent attribute. Typically, this field will correspond to a `TEXT` column in your database. The `Markdown` field will store the raw Markdown text within the associated database column:

```php
use Laravel\Nova\Fields\Markdown;

Markdown::make('Biography'),
```

By default, Markdown fields will not display their content when viewing a resource's detail page. Instead, the content will be hidden behind a "Show Content" link that will reveal the field's content when clicked. You may specify that the Markdown field should always display its content by calling the `alwaysShow` method on the field itself:

```php
Markdown::make('Biography')->alwaysShow(),
```

### Multi-select Field

The `MultiSelect` field provides a `Select` field that allows multiple selection options. This field pairs nicely with model attributes that are cast to `array` or equivalent:

```php
use Laravel\Nova\Fields\MultiSelect;

MultiSelect::make('Sizes')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
]),
``` 

On the resource index and detail pages, the `MultiSelect` field's "key" value will be displayed. If you would like to display the label values instead, you may invoke the `displayUsingLabels` method when defining the field:

```php
MultiSelect::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels(),
```

You may also display multi-select options in groups by providing an array structure that contains keys and `label` / `group` pairs:

```php
MultiSelect::make('Sizes')->options([
    'MS' => ['label' => 'Small', 'group' => "Men's Sizes"],
    'MM' => ['label' => 'Medium', 'group' => "Men's Sizes"],
    'WS' => ['label' => 'Small', 'group' => "Women's Sizes"],
    'WM' => ['label' => 'Medium', 'group' => "Women's Sizes"],
])->displayUsingLabels(),
```

### Number Field

The `Number` field provides an `input` control with a `type` attribute of `number`:

```php
use Laravel\Nova\Fields\Number;

Number::make('price'),
```

You may use the `min`, `max`, and `step` methods to set the corresponding HTML attributes on the generated `input` control:

```php
Number::make('price')->min(1)->max(1000)->step(0.01),
```

### Password Field

The `Password` field provides an `input` control with a `type` attribute of `password`:

```php
use Laravel\Nova\Fields\Password;

Password::make('Password'),
```

The `Password` field will automatically preserve the password that is currently stored in the database if the incoming password field is empty. Therefore, a typical password field definition might look like the following:

```php
Password::make('Password')
    ->onlyOnForms()
    ->creationRules('required', Rules\Password::defaults())
    ->updateRules('nullable', Rules\Password::defaults()),
```

### Password Confirmation Field

The `PasswordConfirmation` field provides an input that can be used for confirming another `Password` field. This field will only be shown on forms and will not attempt to hydrate an underlying attribute on the Eloquent model:

```php
PasswordConfirmation::make('Password Confirmation'),
```

When using this field, you should define the appropriate validation rules on the corresponding `Password` field:

```php
Password::make('Password')
    ->onlyOnForms()
    ->creationRules('required', Rules\Password::defaults(), 'confirmed')
    ->updateRules('nullable', Rules\Password::defaults(), 'confirmed'),

PasswordConfirmation::make('Password Confirmation'),
```

### Select Field

The `Select` field may be used to generate a drop-down select menu. The `Select` menu's options may be defined using the `options` method:

```php
use Laravel\Nova\Fields\Select;

Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
]),
```

On the resource index and detail pages, the `Select` field's "key" value will be displayed. If you would like to display the labels instead, you may use the `displayUsingLabels` method:

```php
Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels(),
```

You may also display `Select` options in groups by providing an array structure that contains keys and `label` / `group` pairs:

```php
Select::make('Size')->options([
    'MS' => ['label' => 'Small', 'group' => 'Men Sizes'],
    'MM' => ['label' => 'Medium', 'group' => 'Men Sizes'],
    'WS' => ['label' => 'Small', 'group' => 'Women Sizes'],
    'WM' => ['label' => 'Medium', 'group' => 'Women Sizes'],
])->displayUsingLabels(),
```

If you need more control over the generation of the `Select` field's options, you may provide a closure to the `options` method:

```php
Select::make('Size')->options(function () {
    return array_filter([
        Size::SMALL => Size::MAX_SIZE === SIZE_SMALL ? 'Small' : null,
        Size::MEDIUM => Size::MAX_SIZE === SIZE_MEDIUM ? 'Medium' : null,
        Size::LARGE => Size::MAX_SIZE === SIZE_LARGE ? 'Large' : null,
    ]);
}),
```

#### Searchable Select Fields

At times it's convenient to be able to search or filter the list of options available in a `Select` field. You can enable this by invoking the `searchable` method on the field:

```php
Select::make('Size')->searchable()->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels(),
```

After marking a select field as `searchable`, Nova will display an `input` field which allows you to filter the list of options based on its label:

![Searchable Select Fields](./img/searchable-select.png)

### Slug Field

Sometimes you may need to generate a unique, human-readable identifier based on the contents of another field, such as when generating a "slug" for a blog post title. You can automatically generate these "slugs" using the `Slug` field:

```php
Slug::make('Slug')->from('Title'),
```

By default, the field will convert a string like 'My Blog Post' to a slug like 'my-blog-post'. If you would like the field to use underscores instead of dashes, you may use the `separator` method to define your own custom "separator":

```php
Slug::make('Slug')->from('Title')->separator('_'),
```

### Sparkline Field

The `Sparkline` field may be used to display a small line chart on a resource's index or detail page. The data provided to a `Sparkline` may be provided via an `array`, a `callable` (which returns an array), or an instance of a `Trend` metric class:

```php
// Using an array...
Sparkline::make('Post Views')->data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),

// Using a callable...
Sparkline::make('Post Views')->data(function () {
    return json_decode($this->views_data);
}),
```

@SCREENSHOT

#### Using Trend Metrics

If the data needed by your `Sparkline` field requires complicated database queries to compute, you may wish to encapsulate the data retrieval within a `Trend` metric which can then be provided to the `Sparkline` field:

```php
Sparkline::make('Post Views')->data(new PostViewsOverTime($this->id)),
```

In the example above, we're providing the post's `id` to the metric's constructor. This value will become the `resourceId` property of the request that is available within the trend metric. For example, within the metric, we could access this post ID via `$request->resourceId`:

```php
return $this->countByDays(
    $request,
    PostView::where('post_id', '=', $request->resourceId)
);
```

:::tip Default Ranges

When providing data to a `Sparkline` field via a trend metric, the `Sparkline` field will always use the first range defined in the `ranges` method of the metric.
:::

#### Customizing The Chart

If a bar chart better suits your data, you may invoke the `asBarChart` method when defining the field:

```php
Sparkline::make('Post Views')
           ->data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
           ->asBarChart(),
```

By default, a `Sparkline` will appear on a resource's detail page. You can customize the dimensions of the chart using the `height` and `width` methods:

```php
Sparkline::make('Post Views')
           ->data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
           ->height(200)
           ->width(600),
```

### Status Field

The `Status` field may be used to display a "progress state" column. Internally, Nova uses the `Status` field to indicate the current state (waiting, running, or finished) of queued actions. However, you are free to use this field for your own purposes as needed:

![Status Field Example](./img/status-field-waiting.png)

The `loadingWhen` and `failedWhen` methods may be used to instruct the field which words indicate a "loading" state and which words indicate a "failed" state. In this example, we will indicate that database column values of `waiting` or `running` should display a "loading" indicator:

```php
use Laravel\Nova\Fields\Status;

Status::make('Status')
    ->loadingWhen(['waiting', 'running'])
    ->failedWhen(['failed']),
```

### Stack Field

As you resource classes grow, you may find it useful to be able to group fields together to simplify your index and detail views. A `Stack` field allows you to display fields like `BelongsTo`, `Text`, and others in a vertical orientation:

```php
Stack::make('Details', [
    Text::make('Name'),
    Text::make('Slug')->resolveUsing(function () {
        return Str::slug(optional($this->resource)->name);
    }),
]),
```

![Stack Field](./img/stack-field.png)

`Stack` fields are not shown on forms, and are only intended for stacking lines of text on the index and detail resource views.

#### Line Fields

To gain more control over how the individual fields in a `Stack` are displayed, you may use the `Line` field, which provides methods for controlling the display of the line's text. `Line` fields offer the following presentational methods:

- `asHeading`
- `asSubTitle`
- `asSmall`
- `asBase`

![Line presentational methods](./img/stack-field-lines.png)

In addition to the `Line` field's presentational methods, you may also pass any additional Tailwind classes to the field to customize the appearance of the `Line`:

```php
Stack::make('Details', [
    Line::make('Title')->extraClasses('italic font-medium text-80'),
]),
```

#### Passing Closures to Line Fields

In addition to passing `BelongsTo`, `Text`, and `Line` fields to the `Stack` field, you may also pass a closure. The result of the closure will automatically be converted to a `Line` instance:

```php
Stack::make('Details', [
    Line::make('Name')->asHeading(),
    fn () => optional($this->resource)->position
]),
```

### Text Field

The `Text` field provides an `input` control with a `type` attribute of `text`:

```php
use Laravel\Nova\Fields\Text;

Text::make('Name'),
```

Text fields may be further customized by setting any attribute on the field. This can be done by calling the `withMeta` method and providing an `extraAttributes` array containing key / value pairs of HTML attributes:

```php
Text::make('Name')->withMeta([
    'extraAttributes' => [
        'placeholder' => 'David Hemphill',
    ],
]),
```

#### Text Field Suggestions

To offer auto-complete suggestions when typing into the `Text` field, you may invoke the `suggestions` method when defining the field. The `suggestions` method should return an `array` of suggestions:

```php
Text::make('Name')->required()
    ->suggestions([
        'David Hemphill',
        'Taylor Otwell',
        'James Brooks',
    ]),
```

![Field Suggestions](./img/field-suggestions.png)

#### Formatting Text As Links

To format a `Text` field as a link, you may invoke the `asHtml` method when defining the field:

```php
Text::make('Twitter Profile', function () {
    $username = $this->twitterUsername;

    return "<a href='https://twitter.com/{$username}'>@{$username}</a>";
})->asHtml(),
```

### Textarea Field

The `Textarea` field provides a `textarea` control:

```php
use Laravel\Nova\Fields\Textarea;

Textarea::make('Biography'),
```

By default, Textarea fields will not display their content when viewing a resource's detail page. Instead, the contents of the field will be hidden behind a "Show Content" link, which will reveal the content when clicked. However, if you would like, you may specify that the `Textarea` field should always display its content by invoking the `alwaysShow` method on the field:

```php
Textarea::make('Biography')->alwaysShow(),
```

You may specify the `Textarea` height by invoking the `rows` method on the field:

```php
Textarea::make('Excerpt')->rows(3),
```

`Textarea` fields may be further customized by setting any attribute on the field. This can be done by calling the `withMeta` method and providing an `extraAttributes` array containing key / value pairs of HTML attributes:

```php
Textarea::make('Excerpt')->withMeta(['extraAttributes' => [
    'placeholder' => 'Make it less than 50 characters']
]),
```

### Timezone Field

The `Timezone` field generates a `Select` field containing a list of the world's timezones:

```php
use Laravel\Nova\Fields\Timezone;

Timezone::make('Timezone'),
```

### Trix Field

The `Trix` field provides a [Trix editor](https://github.com/basecamp/trix) for its associated field. Typically, this field will correspond to a `TEXT` column in your database. The `Trix` field will store its corresponding HTML within the associated database column:

```php
use Laravel\Nova\Fields\Trix;

Trix::make('Biography'),
```

By default, Trix fields will not display their content when viewing a resource on its detail page. Instead, the content will be hidden behind a "Show Content" link, which will reveal the field's content when clicked. If you would like, you may specify that the Trix field should always display its content by invoking the `alwaysShow` method when defining the field:

```php
Trix::make('Biography')->alwaysShow(),
```

#### Trix File Uploads

If you would like to allow users to drag-and-drop photos into the `Trix` field, you may chain the `withFiles` method onto the field's definition. When calling the `withFiles` method, you should pass the name of the [filesystem disk](https://laravel.com/docs/filesystem) that photos should be stored on:

```php
use Laravel\Nova\Fields\Trix;

Trix::make('Biography')->withFiles('public'),
```

In addition, you should define two database tables to store pending and persisted Trix uploads. To do so, create a migration with the following table definitions:

```php
Schema::create('nova_pending_trix_attachments', function (Blueprint $table) {
    $table->increments('id');
    $table->string('draft_id')->index();
    $table->string('attachment');
    $table->string('disk');
    $table->timestamps();
});

Schema::create('nova_trix_attachments', function (Blueprint $table) {
    $table->increments('id');
    $table->string('attachable_type');
    $table->unsignedInteger('attachable_id');
    $table->string('attachment');
    $table->string('disk');
    $table->string('url')->index();
    $table->timestamps();

    $table->index(['attachable_type', 'attachable_id']);
});
```

Finally, in your `app/Console/Kernel.php` file, you should register a [daily job](https://laravel.com/docs/scheduling) to prune any stale attachments from the pending attachments table and storage. For convenience, Laravel Nova provides the job implementation needed to accomplish this:

```php
use Laravel\Nova\Trix\PruneStaleAttachments;

$schedule->call(new PruneStaleAttachments)->daily();
```

### URL Field

The `URL` field renders URLs as clickable links instead of plain text:

```php
URL::make('GitHub URL'),
```

The `URL` field also supports customizing the generated link's text by invoking the `displayUsing` method when defining the field. The `displayUsing` method accepts a closure that should return the link's text:

```php
URL::make('Receipt')
    ->displayUsing(fn () => "{optional($this->user)->name}'s receipt")
```

By providing a closure as the second argument to the `URL` field, you may use the field to render a link for a computed value that does not necessarily correspond to a column within the associated model's database table:

```php
URL::make('Receipt', fn () => $this->receipt_url)
```

### Vapor File Field

The Vapor file field provides convenience and compatibility for uploading files when deploying applications to a serverless environment using [Laravel Vapor](https://vapor.laravel.com):

```php
use Laravel\Nova\Fields\VaporFile;

VaporFile::make('Document'),
```

When uploading a file using a `VaporFile` field, Nova will first generate a signed storage URL on Amazon S3. Next, Nova will upload the file directly to temporary storage in the Amazon S3 bucket. When the resource is saved, Nova will move the file to permanent storage.

:::tip Vapor Storage

For more information on how file storage is handled for Vapor applications, please refer to the [Laravel Vapor storage documentation](https://docs.vapor.build/1.0/resources/storage.html).
:::

### Vapor Image Field

Vapor file fields provide convenience and compatibility for uploading image files when deploying applications in a serverless environment using [Laravel Vapor](https://vapor.laravel.com):

```php
use Laravel\Nova\Fields\VaporImage;

VaporImage::make('Avatar'),
```

Vapor image files support many of the same methods available to [`Image`](#image-field) fields.

:::tip File Fields

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](./file-fields.md).
:::

#### Validating Vapor Image / File Fields

In order to validate the size or other attributes of a Vapor file, you will need to inspect the file directly via the `Storage` facade:

```php
use Illuminate\Support\Facades\Storage;

VaporFile::make('Document')
    ->rules('bail', 'required', function ($attribute, $value, $fail) use ($request) {
        if (Storage::size($request->input('vaporFile')[$attribute]['key']) > 1000000) {
            return $fail('The document size may not be greater than 1 MB');
        }
    }),
```

## Computed Fields

In addition to displaying fields that are directly associated with columns in your database, Nova allows you to create "computed fields". Computed fields may be used to display computed values that are not associated with a database column. Since they are not associated with a database column, computed fields may not be `sortable`. These fields may be created by passing a callable (instead of a column name) as the second argument to the field's `make` method:

```php
Text::make('Name', function () {
    return $this->first_name.' '.$this->last_name;
}),
```

The model instance will be passed to the computed field callable, allowing you to access the model's properties while computing the field's value:

```php
Text::make('Name', function ($model) {
    return $model->first_name.' '.$model->last_name;
}),
```

:::tip Model Attribute Access

As you may have noticed in the example above, you may also use `$this` to access the resource's underlying model attributes and relationships.
:::

By default, Vue will escape the content of a computed field. If you need to render HTML content within the field, invoke the `asHtml` method when defining your field:

```php
Text::make('Status', function () {
    return view('partials.status', [
        'isPassing' => $this->isPassing(),
    ])->render();
})->asHtml(),
```

## Customization

### Readonly Fields

There are times where you may want to allow the user to only create and update certain fields on a resource. You can mark fields as "read only" by invoking the `readonly` method on the field, which will disable the field's corresponding input. You may pass a boolean argument to the `readonly` method to dynamically control whether a field should be "read only":

```php
Text::make('Email')->readonly(optional($this->resource)->trashed()),
```

You may also pass a closure to the `readonly` method, and the result of the closure will be used to determine if the field should be "read only". The closure will receive the current `NovaRequest` as its first argument:

```php
Text::make('Email')->readonly(function ($request) {
    return ! $request->user()->isAdmin();
}),
```

If you only want to mark a field as "read only" when creating or attaching resources, you may use the `isCreateOrAttachRequest` and `isUpdateOrUpdateAttachedRequest` methods available via the `NovaRequest` instance, respectively:

```php
Text::make('Email')->readonly(function ($request) {
    return $request->isUpdateOrUpdateAttachedRequest();
}),
```

### Required Fields

By default, Nova will use a red asterisk to indicate a field is required:

![Required Fields](./img/required-field.png)

Nova does this by looking for the `required` rule inside the field's validation rules to determine if it should show the required state. For example, a field with the following definition would receive a "required" indicator:

```php
Text::make('Email')->rules('required'),
```

When you have complex `required` validation requirements, you can manually mark the field as required by passing a boolean to the `required` method when defining the field. This will inform Nova that a "required" indicator should be shown in the UI:

```php
Text::make('Email')->required(true),
```

In addition, you may also pass a closure to the `required` method to determine if the field should be marked as required. The closure will receive an instance of `NovaRequest`. The value returned by the closure will be used to determine if field is required:

```php
use Illuminate\Validation\Rule;

Text::make('Email')->required(function ($request) {
    return $this->notify_via_email;
}),
```

:::warning <code>required()</code> Limitations

The `required()` method will only add a "required" indicator to the Nova UI. You must still define the related requirement `rules()` that should apply during validation.
:::

### Nullable Fields

By default, Nova attempts to store all fields with a value, however, there are times where you may prefer that Nova store a `null` value in the corresponding database column when the field is empty. To accomplish this, you may invoke the `nullable` method on your field definition:

```php
Text::make('Position')->nullable(),
```

You may also set which values should be interpreted as a `null` value using the `nullValues` method, which accepts an array or a closure as its only argument:

```php
Text::make('Position')->nullable()->nullValues(['', '0', 'null']),

Text::make('Position')->nullable()->nullValues(function ($value) {
    return $value == '' || $value == 'null' || (int)$value === 0;
}),
```

### Field Help Text

If you would like to place "help" text beneath a field, you may invoke the `help` method when defining your field:

```php
Text::make('Tax Rate')->help(
    'The tax rate to be applied to the sale'
),
```

If necessary, you may include HTML within your field's help text to further customize the help text:

```php
Text::make('First Name')->help(
    '<a href="#">External Link</a>'
),

Text::make('Last Name')->help(
    view('partials.help-text', ['name' => $this->name])->render()
),
```

### Field Stacking

By default, Nova displays fields next to their labels, however some fields like "Code", "Markdown", and "Trix" may benefit from the extra width that can be gained by placing the field under their corresponding labels. Fields can be stacked underneath their label using the `stacked` method:

```php
Trix::make('Content')->stacked(),
```

### Field Text Alignment

You may change the text alignment of fields using the `textAlign` method:

```php
Text::make('Phone Number')->textAlign('left'),
```

The following alignments are valid:

- `left`
- `center`
- `right`

### Field Resolution / Formatting

The `resolveUsing` method allows you to customize how a field is formatted after it is retrieved from your database but before it is sent to the Nova front-end. This method accepts a callback which receives the raw value of the underlying database column:

```php
Text::make('Name')->resolveUsing(function ($name) {
    return strtoupper($name);
}),
```

If you would like to customize how a field is formatted only when it is displayed on a resource's "index" or "detail" pages, you may use the `displayUsing` method. Like the `resolveUsing` method, this method accepts a single callback:

```php
Text::make('Name')->displayUsing(function ($name) {
    return strtoupper($name);
}),
```

### Filterable Fields

The `filterable` method allows you to enable convenient, automatic [filtering](./../filters/defining-filters.md) functionality for a given field on resources, relationships, and lenses. The Nova generated filter will automatically be made available via the resource filter menu on the resource's index:

```php
BelongsTo::make('User')->filterable(),
```

@SCREENSHOT

The `filterable` method also accepts a closure as an argument. This closure will receive the filter query, which you may then customize in order to filter the resource results to your liking:

```php
Text::make('Email')->filterable(function ($request, $query, $value, $attribute) {
    $query->where($attribute, 'LIKE', "{$value}%");
}),
```

The generated filter will be a text filter, select filter, number range filter, or date range filter depending on the underlying field type that was marked as filterable.

### Dependent Fields

The `dependsOn` method allows you to specify that a field's configuration depends on one or more other field's values. The `dependsOn` method accepts an `array` of dependent field attributes and a closure that modifies the configuration of the current field instance. Dependent fields allow advanced customization, such as toggling read-only mode, field value, validation rules, and more based on the state of another field:

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

The following field types may depend on other fields:

- BelongsTo
- Boolean
- BooleanGroup
- Color
- Code
- Country
- Currency
- File
- Hidden
- Image
- KeyValue
- Markdown
- Number
- Password
- PasswordConfirmation
- Status
- Textarea
- Text
- URL
- VaporFile
- VaporImage

The following field types may not be depended upon by other fields since they do not live-report their changes to Nova:

- Code
- File
- Image
- KeyValue
- Status
- Trix
- VaporFile
- VaporImage
