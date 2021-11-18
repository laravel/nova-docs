# Fields

[[toc]]

## Defining Fields

Each Nova resource contains a `fields` method. This method returns an array of fields, which generally extend the `Laravel\Nova\Fields\Field` class. Nova ships with a variety of fields out of the box, including fields for text inputs, booleans, dates, file uploads, Markdown, and more.

To add a field to a resource, we can simply add it to the resource's `fields` method. Typically, fields may be created using their static `make` method. This method accepts several arguments; however, you usually only need to pass the "human readable" name of the field. Nova will automatically "snake case" this string to determine the underlying database column:

```php
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;

/**
 * Get the fields displayed by the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function fields(Request $request)
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

Often, you will only want to display a field in certain situations. For example, there is typically no need to show a `Password` field on a resource index listing. Likewise, you may wish to only display a `Created At` field on the creation / update forms. Nova makes it a breeze to hide / show fields on certain screens.

The following methods may be used to show / hide fields based on the display context:

- `showOnIndex`
- `showOnDetail`
- `showOnCreating`
- `showOnUpdating`
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

## Dynamic Field Methods

If your application requires it, you may specify a separate list of fields for specific display contexts. For example, imagine you have a resource with the following list of fields:

```php
public function fields(NovaRequest $request)
{
    return [
        Text::make('First Name'),
        Text::make('Last Name'),
        Text::make('Job Title'),
    ];
}
```

On your detail page, you may wish to show a combined name, followed by the job title. In order to do this, you could add a `fieldsForDetail` method which returns a separate list of fields:

```php
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

The available methods for individual display contexts are:

- `fieldsForIndex`
- `fieldsForDetail`
- `fieldsForCreate`
- `fieldsForUpdate`

:::tip Dynamic Field Methods Precedence ::
The `fieldsForIndex`, `fieldsForDetail`, `fieldsForCreate`, and `fieldsForUpdate` methods always take precedence over the `fields` method.
:::

## Default Values

There are time you may wish to provide a default value to your fields. Nova enables this using the `default` method, which accepts a value or callback, which will be run when serializing fields for the resource creation view:

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

On every create or update request the field's corresponding model attribute will automatically be filled; however, you can customise the hydration behavior of a given field using the `fillUsing` method. This method allows you to totally customize how the field's corresponding model attribute is hydrated:

```php
Text::make('Name', 'name')
    ->fillUsing(function ($request, $model, $attribute, $requestAttribute) {
        $model->{$attribute} = Str::title($request->input($attribute));
    }),
```

## Field Panels

If your resource contains many fields, your resource "detail" screen can become crowded. For that reason, you may choose to break up groups of fields into their own "panels":

![Field Panel Example](./img/panels.png)

You may do this by creating a new `Panel` instance within the `fields` method of a resource. Each panel requires a name and an array of fields that belong to that panel:

```php
use Laravel\Nova\Panel;

/**
 * Get the fields displayed by the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function fields(Request $request)
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

Panels with a defined field limit will display a **Show All Fields** button in order to allow the user to view all of the defined fields.

## Sortable Fields

When attaching a field to a resource, you may use the `sortable` method to indicate that the resource index may be sorted by the given field:

```php
Text::make('Name', 'name_column')->sortable(),
```

## Field Types

:::tip Relationship Fields

This portion of the documentation only discusses non-relationship fields. To learn more about relationship fields, [check out their documentation](/3.0/resources/relationships.html).
:::

Nova ships with a variety of field types. So, let's explore all of the available types and their options:

- [Avatar](#avatar-field)
- [Badge](#badge-field)
- [Boolean](#boolean-field)
- [Boolean Group](#boolean-group-field)
- [Code](#code-field)
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

By default, the `Badge` field supports four variations: `info`, `success`, `danger`, and `warning`. You may define your possible field values to their associated badge types using the `map` method:

```php
Badge::make('Status')->map([
    'draft' => 'danger',
    'published' => 'success',
]),
```

Alternatively, you may use the `types` method to completely replace the built-in badge types and their associate CSS classes. The CSS classes may be provided as a string or an array:

```php
Badge::make('Status')->types([
    'draft' => 'custom classes',
    'published' => ['custom', 'class'],
]),
```

If you only wish to supplement the built-in badge types instead of overwriting all of them, you may use the `addTypes` method:

```php
Badge::make('Status')->addTypes([
    'draft' => 'custom classes',
]),
```

:::tip Editing Badge Types

By default the `Badge` field is not shown on the edit or update views. If you wish to modify the value represented by the `Badge` field on your edit forms, use another field in combination with the `onlyOnForms` field option.
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

Before using this field type, you should ensure that your Eloquent attribute is configured to cast to an `array` (or equivalent) within your Eloquent model class:

```php
protected $casts = [
    'permissions' => 'array'
];
```

Sometimes, you may wish to filter out values that are either `true` or `false` from display to avoid cluttering up the view. You may do this by using the `hideFalseValues` and `hideTrueValues` methods on the field:

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

In the event that the field contains no values, Nova will display "No Data". You may customize this text using the `noValueText` method:

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

You may also attach `Code` fields to `JSON` database columns. By default, the field will display the value as a JSON string but you may cast the column to `array`, `collection`, `object`, or `json` to display the value as required by your application:

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

Nova does not automatically apply the `json` validation rule for `Code` fields. This rule must be manually specified during validation if you wish for it to be applied.
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
- `vue`
- `xml`
- `yaml`
- `yaml-frontmatter`
- `vim`

### Country Field

The `Country` field generates a `Select` field containing a list of the world's countries. The field will store the country's two-letter code:

```php
use Laravel\Nova\Fields\Country;

Country::make('Country', 'country_code'),
```

### Currency Field

:::tip Currency Field Versioning

This documentation refers to the `Currency` field from v2.11.0 onwards. Prior to this, the field was incompatible with PHP 7.4.
:::

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

If you plan to customize the currency "step" amount using the `step` method, you should ensure you always call the `step` method after the `currency`, `asMinorUnits`, and `asMajorUnits`. Calling these methods after the `step` method will override the `step` method's behavior.
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

#### Date Formats

You may customize the display format of your `Date` fields using the `format` method. The format must be a format supported by [Moment.js](https://momentjs.com/docs/#/parsing/string-format/):

```php
Date::make('Birthday')->format('DD MMM'),
```

To customize the display format used for the JavaScript date picker widget, you can use the `pickerDisplayFormat` method:

```php
Date::make('Birthday')->pickerDisplayFormat('d.m.Y'),
```

To learn about the available date format options, please consult the [flatpickr documentation](https://flatpickr.js.org/formatting/).

#### Customizing The First Day Of Week

You can customize the first day of the week using the `firstDayOfWeek` method:

```php
Date::make('Birthday')->firstDayOfWeek(1), // First day of the week is Monday
```

### DateTime Field

The `DateTime` field may be used to store a date-time value. For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](./date-fields.md):

```php
use Laravel\Nova\Fields\DateTime;

DateTime::make('Updated At')->hideFromIndex(),
```

You may customize the display format of your `DateTime` fields using the `format` method. The format must be a format supported by [Moment.js](https://momentjs.com/docs/#/parsing/string-format/):

```php
DateTime::make('Created At')->format('DD MMM YYYY'),
```

To customize the display format used for the JavaScript date picker widget, you can use the `pickerDisplayFormat` method:

```php
DateTime::make('Updated At')->pickerDisplayFormat('d.m.Y'),
```

By default, the date picker will increment hours by 1 hour per increment and minutes by 5 minutes per increment. You can use the `incrementPickerHourBy` and `incrementPickerMinuteBy` methods to customize this behavior:

```php
DateTime::make('Updated At')->incrementPickerHourBy(2),

DateTime::make('Updated At')->incrementPickerMinuteBy(2),
```

To learn about the available date format options, please consult the [flatpickr documentation](https://flatpickr.js.org/formatting/).

### File Field

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](./file-fields.md).

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
Heading::make('Meta'),
```

If you need to render HTML content within the `Heading` field, use the `asHtml` method:

```php
Heading::make('<p class="text-danger">* All fields are required.</p>')->asHtml(),
```

::: tip Headings And Indexes

`Heading` fields are automatically hidden from the resource index screen.
:::

### Hidden Field

The `Hidden` field allows users to pass a value in a hidden text input. You may use this to pass any value that doesn't need to be changed by the user but is required for saving the resource:

```php
Hidden::make('Slug'),

Hidden::make('Slug')->default(Str::random(64)),
```

Combined with [default values](#default-values), `Hidden` fields are useful for passing things like related ID's to your forms:

```php
Hidden::make('User', 'user_id')->default(function ($request) {
    return $request->user()->id;
}),
```

### ID Field

The `ID` field represents the primary key of your resource's database table. Typically, each Nova resource you define should contain an `ID` field. By default, the `ID` field assumes the underlying database column is named `id`:

```php
use Laravel\Nova\Fields\ID;

// Using the "id" column...
ID::make(),

// Using the "id_column" column...
ID::make('ID', 'id_column'),
```

If your application contains very large integer IDs, you may need to use the `asBigInt` method in order for the Nova client to render the integer:

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

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](./file-fields.md).
:::

### KeyValue Field

The `KeyValue` field provides a convenient interface to edit _flat_, key-value data stored inside `JSON` column types. For example, you might store profile information inside a [JSON column type](https://laravel.com/docs/eloquent-mutators#array-and-json-casting) named `meta`:

```php
use Laravel\Nova\Fields\KeyValue;

KeyValue::make('Meta')->rules('json'),
```

Given the field definition above, the following interface would be rendered:

![Key/Value Field](./img/key-value-field.png)

#### Customizing KeyValue Labels

You can customize the text values used in the component by calling the `keyLabel`, `valueLabel`, and `actionText` methods when defining the field:

```php
KeyValue::make('Meta')
    ->keyLabel('Item') // Customize the key heading
    ->valueLabel('Label') // Customize the value heading
    ->actionText('Add Item'), // Customize the "add row" button text
```

:::tip KeyValue Fields On The Index

By default, Nova will never display a `KeyValue` field on a resource index listing.
:::

If you would like to disable the user's ability to edit the keys of the field, you may use the `disableEditingKeys` method to accomplish this. Disabling editing keys with the `disableEditingKeys` method will automatically disable adding rows as well:

```php
KeyValue::make('Meta')
    ->disableEditingKeys(),
```

You may also remove the user's ability to add new rows to the field by chaining the `disableAddingRows` method:

```php
KeyValue::make('Meta')
    ->disableAddingRows(),
```

In addition you may also wish to remove the user's ability to delete exisiting rows in the field by using the `disableDeletingRows` method:

```php
KeyValue::make('Meta')
    ->disableDeletingRows(),
```

### Markdown Field

The `Markdown` field provides a WYSIWYG Markdown editor for its associated field. Typically, this field will correspond to a `TEXT` column in your database. The `Markdown` field will store the raw Markdown text within the associated database column:

```php
use Laravel\Nova\Fields\Markdown;

Markdown::make('Biography'),
```

By default, Markdown fields will not display their content when viewing a resource on its detail page. It will be hidden behind a "Show Content" link, that when clicked will reveal the content. You may specify the Markdown field should always display its content by calling the `alwaysShow` method on the field itself:

```php
Markdown::make('Biography')->alwaysShow(),
```

### Number Field

The `Number` field provides an `input` control with a `type` attribute of `number`:

```php
use Laravel\Nova\Fields\Number;

Number::make('price'),
```

You may use the `min`, `max`, and `step` methods to set their corresponding attributes on the generated `input` control:

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
    ->creationRules('required', 'string', 'min:6')
    ->updateRules('nullable', 'string', 'min:6'),
```

### Password Confirmation Field

The `PasswordConfirmation` field provides an input that can be used for confirming another `Password` field. This field will only be shown on forms:

```php
PasswordConfirmation::make('Password Confirmation'),
```

### Place Field

:::danger Places API Deprecated

Algolia has announced that their [Places API will stop functioning on May 31st, 2022](https://www.algolia.com/blog/product/sunsetting-our-places-feature/).
:::

The `Place` field leverages the power of the [Algolia Places API](https://community.algolia.com/places/) to provide ultra-fast address searching and auto-completion. An Algolia account is **not required** in order to leverage this field.

Typically, a `Place` field will be defined alongside other related address fields. In this example, in order to keep our resource tidy, we will use the `merge` method to extract the address field definitions into their own method:

```php
use Laravel\Nova\Fields\Place;

/**
 * Get the fields displayed by the resource.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return array
 */
public function fields(Request $request)
{
    return [
        ID::make()->sortable(),
        $this->addressFields(),
    ];
}

/**
 * Get the address fields for the resource.
 *
 * @return \Illuminate\Http\Resources\MergeValue
 */
protected function addressFields()
{
    return $this->merge([
        Place::make('Address', 'address_line_1')->hideFromIndex(),
        Text::make('Address Line 2')->hideFromIndex(),
        Text::make('City')->hideFromIndex(),
        Text::make('State')->hideFromIndex(),
        Text::make('Postal Code')->hideFromIndex(),
        Text::make('Suburb')->hideFromIndex(),
        Country::make('Country')->hideFromIndex(),
        Text::make('Latitude')->hideFromIndex(),
        Text::make('Longitude')->hideFromIndex(),
    ]);
}
```

#### Searchable Countries

By default, the `Place` field will search all addresses around the world. If you would like to limit the countries included in the search, you may use the `countries` method:

```php
Place::make('Address', 'address_line_1')->countries(['US', 'CA']),
```

#### City Search

If you intend to use the `Place` field to search for cities instead of addresses, you may use the `onlyCities` method to instruct the field to only list cities in its results:

```php
Place::make('City')->onlyCities(),
```

:::tip City Auto-Completion

When using the `Place` field as a city search, the `state` and `country` fields will still receive auto-completion. However, the `postal_code` field will not.
:::

#### Configuring Field Auto-Completion

By default, the place field will auto-complete the associated address fields based on their field names. The `Place` field will automatically fill fields named `address_line_2`, `city`, `state`, `postal_code`, `suburb`, `country`, `latitude` and `longitude`. However, you may customize the field names that should be auto-completed using the following methods:

- `secondAddressLine($column)`
- `city($column)`
- `state($column)`
- `postalCode($column)`
- `suburb($column)`
- `country($column)`

For example:

```php
Place::make('Address', 'address_line_1')
    ->secondAddressLine('address_2')
    ->city('city_name')
    ->state('state_code')
    ->postalCode('zip_code')
    ->suburb('suburb')
    ->country('country_code')
    ->latitude('latitude')
    ->longitude('longitude'),
```

### Select Field

The `Select` field may be used to generate a drop-down select menu. The select menu's options may be defined using the `options` method:

```php
use Laravel\Nova\Fields\Select;

Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
]),
```

On the resource index and detail screens, the `Select` field's "key" value will be displayed. If you would like to display the labels instead, you may use the `displayUsingLabels` method:

```php
Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels(),
```

You may also display select options in groups:

```php
Select::make('Size')->options([
    'MS' => ['label' => 'Small', 'group' => 'Men Sizes'],
    'MM' => ['label' => 'Medium', 'group' => 'Men Sizes'],
    'WS' => ['label' => 'Small', 'group' => 'Women Sizes'],
    'WM' => ['label' => 'Medium', 'group' => 'Women Sizes'],
])->displayUsingLabels(),
```

If you would like more dynamic control over generating the options available within the field, you may pass a `Closure` to the `options` method:

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

At times it's convenient to be able to search or filter the list of options in a `Select` field. You can enable this by calling the `searchable` method on the field:

```php
Select::make('Size')->searchable()->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels(),
```

When using this field, Nova will display an `input` field which allows you to filter the list based on its label:

![Searchable Select Fields](./img/searchable-select.png)

### Slug Field

Some times you may need a unique, human-readable identifier generated from another field in your Nova resource for use in URLs. You can automatically generate these URL "slugs" with the `Slug` field:

```php
Slug::make('Slug')->from('Title'),
```

By default, the field will take a string like 'My Cool Post' and create a slug like 'my-cool-post'. If you'd like the field to use underscores instead of dashes, use the `separator` method:

```php
Slug::make('Slug')->from('Title')->separator('_'),
```

### Sparkline Field

The `Sparkline` field may be used to display a small chart within a resource. The data displayed within a `Sparkline` can be an `array`, a `callable` (returning an array), or an instance of a `Trend` metric class:

```php
// Using an array...
Sparkline::make('Post Views')->data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),

// Using a callable...
Sparkline::make('Post Views')->data(function () {
    return json_decode($this->views_data);
}),

// Using a Trend instance...
Sparkline::make('Post Views')->data(new PostViewsOverTime($this->id)),
```

#### Using Trend Metrics

If your `Sparkline` contains complicated data, you may leverage your existing `Trend` metrics:

```php
Sparkline::make('Post Views')->data(new PostViewsOverTime($this->id)),
```

Note that in the example above, we're passing through a value to the metric class. This value will become the `resourceId` parameter within the `Metric` class. In the example `PostViewsOverTime` class, we can access this value via `$request->resourceId`:

```php
return $this->countByDays(
    $request,
    PostView::where('post_id', '=', $request->resourceId)
);
```

:::tip Default Ranges

A `Sparkline` will always use the first range defined in the `ranges` method of a `Trend`.
:::

#### Customizing The Chart

If a bar chart is better suited to your data, you may use the `asBarChart()` method:

```php
Sparkline::make('Post Views')
           ->data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
           ->asBarChart(),
```

By default, a `Sparkline` will appear on the detail view. You can customize the dimensions of the chart using the `height` and `width` methods:

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

As you resource classes grow, you may find it useful to be able to group fields together to simplify your index and detail views. A `Stack` field allows one to display fields like `BelongsTo`, `Text`, and others in vertical orientation:

```php
Stack::make('Details', [
    Text::make('Name'),
    Text::make('Slug')->resolveUsing(function () {
        return Str::slug(optional($this->resource)->name);
    }),
]),
```

![Stack Field](./img/stack-field.png)

`Stack` fields are not shown on forms, and are only for stacking lines of text for display on the index and detail resource views.

#### Line Fields

To gain more control over how the individual fields in a `Stack` are displayed, you may use the `Line` field, which provides methods for controlling the display of the line. `Line` fields supports the following presentational methods:

- `asHeading`
- `asSubTitle`
- `asSmall`
- `asBase`

![Line presentational methods](./img/stack-field-lines.png)

In addition to `Lines` presentational methods, you may also pass any additional classes to the field to increase the visual customization of the `Line`:

```php
Stack::make('Details', [
    Line::make('Title')->extraClasses('italic font-medium text-80'),
]),
```

#### Passing Closures to Line Fields

In addition to passing `BelongsTo`, `Text` and `Line` fields to the `Stack` field, you may also pass a `Closure`. The result of the Closure will automatically be converted to a `Line` instance:

```php
Stack::make('Details', [
    Line::make('Name')->asHeading(),
    function () {
        return optional($this->resource)->position;
    }
]),
```

### Text Field

The `Text` field provides an `input` control with a `type` attribute of `text`:

```php
use Laravel\Nova\Fields\Text;

Text::make('Name'),
```

Text fields may be customized further by setting any attribute on the field. This can be done by calling the `withMeta` methods and passing in a valid `extraAttributes` value:

```php
Text::make('Name')->withMeta([
    'extraAttributes' => [
        'placeholder' => 'David Hemphill',
    ],
]),
```

#### Text Field Suggestions

If you'd like to offer users of your `Text` field a list of suggestions when typing into the field, you may use the `suggestions` method to return an `array` of suggestions. These suggestions will be used to populate the field's `datalist`:

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

To format text as a link, you may use the `asHtml` method:

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

By default, Textarea fields will not display their content when viewing a resource on its detail page. It will be hidden behind a "Show Content" link, that when clicked will reveal the content. You may specify the Textarea field should always display its content by calling the `alwaysShow` method on the field itself:

```php
Textarea::make('Biography')->alwaysShow(),
```

You may also specify the textarea's height by calling the `rows` method on the field:

```php
Textarea::make('Excerpt')->rows(3),
```

Textarea fields may be customized further by setting any attribute on the field. This can be done by calling the `withMeta` methods and passing in a valid `extraAttributes` value:

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

By default, Trix fields will not display their content when viewing a resource on its detail page. It will be hidden behind a "Show Content" link, that when clicked will reveal the content. You may specify the Trix field should always display its content by calling the `alwaysShow` method on the field itself:

```php
Trix::make('Biography')->alwaysShow(),
```

#### Trix File Uploads

If you would like to allow users to drag-and-drop photos into the Trix field, chain the `withFiles` method onto the field's definition. When calling the `withFiles` method, you should pass the name of the [filesystem disk](https://laravel.com/docs/filesystem) that photos should be stored on:

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

Finally, in your `app/Console/Kernel.php` file, you should register a [daily job](https://laravel.com/docs/scheduling) to prune any stale attachments from the pending attachments table and storage. Laravel Nova provides the job implementation needed to accomplish this:

```php
use Laravel\Nova\Trix\PruneStaleAttachments;

$schedule->call(function () {
    (new PruneStaleAttachments)();
})->daily(),
```

### Vapor File Field

Vapor file fields provide convenience and compatibility for uploading files when deploying applications in a serverless environment using [Laravel Vapor](https://vapor.laravel.com):

```php
use Laravel\Nova\Fields\VaporFile;

VaporFile::make('Document'),
```

When uploading a file using a `VaporFile` field, Nova will first generate a signed storage URL on Amazon S3. Nova will then upload the file directly to temporary storage in the Amazon S3 bucket. When the resource is saved, Nova will move the folder to permanent storage.

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

In order to validate the size or other attributes of a Vapor file, you will need to inspect the file directly using the `Storage` facade:

```php
use Illuminate\Support\Facades\Storage;

VaporFile::make('Document')
    ->rules('bail', 'required', function($attribute, $value, $fail) use ($request) {
        if (Storage::size($request->input('vaporFile')[$attribute]['key']) > 1000000) {
            return $fail('The document size may not be greater than 1 MB');
        }
    }),
```

## Computed Fields

In addition to displaying fields that are associated with columns in your database, Nova allows you to create "computed fields". Computed fields may be used to display computed values that are not associated with a database column. Since they are not associated with a database column, computed fields may not be `sortable`. These fields may be created by passing a callable (instead of a column name) as the second argument to the field's `make` method:

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

As you may have noticed in the example above, you may use `$this` to access the resource's underlying model attributes and relationships.
:::

By default, Vue will escape the content of a computed field. If you need to render HTML content within the field, use the `asHtml` method:

```php
Text::make('Status', function () {
    return view('partials.status', [
        'is_passing' => $this->isPassing(),
    ])->render();
})->asHtml(),
```

## Customization

### Readonly Fields

There are times where you may want to allow the user to only create and update certain fields on a resource. You can do this by using the `readonly` method on the field, which will disable the field's corresponding input:

```php
Text::make('Email')->readonly(optional($this->resource)->trashed()),
```

You may also pass a `Closure` to the `readonly` method. It will receive the current `NovaRequest` as the first argument:

```php
Text::make('Email')->readonly(function ($request) {
    return !$request->user()->isAdmin();
}),
```

If you only want to set the fields to readonly when creating or attaching resources, you may use the `isCreateOrAttachRequest` and `isUpdateOrUpdateAttachedRequest` methods from `NovaRequest`:

```php
Text::make('Email')->readonly(function ($request) {
    return $request->isUpdateOrUpdateAttachedRequest();
}),
```

### Required Fields

By default, Nova will use a red asterisk to indicate a field is required:

![Required Fields](./img/required-field.png)

Nova does this by looking for the `required` rules inside the field's validation rules to determine if it should show the required state. For example, a field with this definition would receive a "required" indicator in the Nova UI:

```php
Text::make('Email')->rules('required'),
```

When you have complex `required` validation requirements, you can manually mark the field as required by passing a boolean to the `required` method when defining the field. This will inform Nova that a "required" indicator should be shown in the UI:

```php
Text::make('Email')->required(true),
```

In addition, you may also pass a Closure to the `required` method to determine if the field should be marked as required. The Closure will receive an instance of `NovaRequest`. You may define any complex logic which should be used to evaluate the field's required state within the Closure:

```php
use Illuminate\Validation\Rule;

Text::make('Email')->required(function ($request) {
    return $this->account_locked !== true;
})->rules([Rule::requiredIf($this->account_locked)]),
```

:::warning <code>required()</code> Limitations

The `required()` method will only add a "required" indicator to the Nova UI. You must still define the related requirement `rules()` that should apply during validation.
:::

### Nullable Fields

By default, Nova attempts to store all fields with a value, however, there are times where you'd like to explicitly direct Nova to store a `null` value when the field is empty. To do this, you may use the `nullable` method on your field:

```php
Text::make('Position')->nullable(),
```

You may also set which values should be interpreted as a `null` value using the `nullValues` method:

```php
Text::make('Position')->nullable()->nullValues(['', '0', 'null']),

Text::make('Position')->nullable()->nullValues(function ($value) {
    return $value == '' || $value == 'null' || (int)$value === 0;
}),
```

### Field Help Text

If you would like to place "help" text beneath a field, you may use the `help` method:

```php
Text::make('Tax Rate')->help(
    'The tax rate to be applied to the sale'
),
```

You may also use HTML when defining your help text:

```php
Text::make('First Name')->help(
    '<a href="#">External Link</a>'
),

Text::make('Last Name')->help(
    view('partials.help-text', ['name' => $this->name])->render()
),
```

### Field Stacking

By default, Nova displays fields next to their labels, however some fields like "Code", "Markdown", and "Trix" may be better suited to a wider size. Fields can be stacked underneath their label using the `stacked` method:

```php
Trix::make('Content')->stacked(),
```

### Field Text Alignment

You may change the text alignment of fields by using the `textAlign` method:

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

If you would like to customize how a field is formatted only when it is displayed on a resource's "index" or "detail" screen, you may use the `displayUsing` method. Like the `resolveUsing` method, this method accepts a single callback:

```php
Text::make('Name')->displayUsing(function ($name) {
    return strtoupper($name);
}),
```
