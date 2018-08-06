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
Text::make('Name', 'name_column')
```

## Showing / Hiding Fields

Often, you will only want to display a field in certain situations. For example, there is typically no need to show a `Password` field on a resource index listing. Likewise, you may wish to only display a `Created At` field on the creation / update forms. Nova makes it a breeze to hide / show fields on certain screens.

The following methods may be used to show / hide fields based on the display context:

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
Text::make('Name')->hideFromIndex()
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

## Sortable Fields

When attaching a field to a resource, you may use the `sortable` method to indicate that the resource index may be sorted by the given field:

```php
Text::make('Name', 'name_column')->sortable()
```

## Field Types

:::tip Relationship Fields

This portion of the documentation only discusses non-relationship fields. To learn more about relationship fields, [check out their documentation](/1.0/resources/relationships.html).
:::

Nova ships with a variety of field types. So, let's explore all of the available types and their options:

- [Avatar](#avatar-field)
- [Boolean](#boolean-field)
- [Code](#code-field)
- [Country](#country-field)
- [Date](#date-field)
- [DateTime](#date-time-field)
- [File](#file-field)
- [Gravatar](#gravatar-field)
- [ID](#id-field)
- [Image](#image-field)
- [Markdown](#markdown-field)
- [Number](#number-field)
- [Password](#password-field)
- [Place](#place-field)
- [Select](#select-field)
- [Status](#status-field)
- [Text](#text-field)
- [Textarea](#textarea-field)
- [Timezone](#timezone-field)
- [Trix](#trix-field)

### Avatar Field

The `Avatar` field extends the [Image field](#image-field) and accepts the same options and configuration:

```php
use Laravel\Nova\Fields\Avatar;

Avatar::make('Avatar')
```

If a resource contains an `Avatar` field, that field will be displayed next to the resource's title when the resource is displayed in search results:

![Avatar Search Results](./img/avatar-search-results.png)

### Boolean Field

The `Boolean` field may be used to represent a boolean / "tiny integer" column in your database. For example, assuming your database has a boolean column named `active`, you may attach a `Boolean` field to your resource like so:

```php
use Laravel\Nova\Fields\Boolean;

Boolean::make('Active')
```

#### Customizing True / False Values

If you are using values other than `true`, `false`, `1`, or `0` to represent "true" and "false", you may instruct Nova to use the custom values recognized by your application. To accomplish this, chain the `trueValue` and `falseValue` methods onto your field's definition:

```php
Boolean::make('Active')
        ->trueValue('On')
        ->falseValue('Off');
```

### Code Field

The `Code` fields provides a beautiful code editor within your Nova administration panel. Generally, code fields should be attached to `TEXT` database columns. However, you may also attach them to `JSON` database columns:

```php
use Laravel\Nova\Fields\Code;

Code::make('Snippet')
```

:::tip Code Fields On The Index

By default, Nova will never display a `Code` field on a resource index listing.
:::

#### Editing JSON

If you intend to use a given `Code` field instance to only edit JSON, you may chain the `json` method onto your field definition:

```php
Code::make('Options')->json()
```

#### Syntax Highlighting

You may customize the language syntax highlighting of the `Code` field using the `language` method:

```php
Code::make('Snippet')->language('php')
```

The `Code` field's currently supported languages are:

- `dockerfile`
- `javascript`
- `markdown`
- `nginx`
- `php`
- `ruby`
- `sass`
- `shell`
- `vue`
- `xml`
- `yaml`

### Country Field

The `Country` field generates a `Select` field containing a list of the world's countries. The field will store the country's two-digit code:

```php
use Laravel\Nova\Fields\Country;

Country::make('Country', 'country_code')
```

### Date Field

The `Date` field may be used to store a date value (without time). For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](./date-fields.md):

```php
use Laravel\Nova\Fields\Date;

Date::make('Birthday')
```

### DateTime Field

The `DateTime` field may be used to store a date-time value. For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](./date-fields.md):

```php
use Laravel\Nova\Fields\DateTime;

DateTime::make('Updated At')->hideFromIndex()
```

### File Field

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](./file-fields.md).

```php
use Laravel\Nova\Fields\File;

File::make('Attachment')
```

### Gravatar Field

The `Gravatar` field does not correspond to any column in your application's database. Instead, it will display the "Gravatar" image of the model it is associated with.

By default, the Gravatar URL will be generated based on the value of the model's `email` column. However, if your user's email addresses are not stored in the `email` column, you may pass a custom column name to the field's `make` method:

```php
use Laravel\Nova\Fields\Gravtar;

// Using the "email" column...
Gravatar::make()

// Using the "email_address" column...
Gravatar::make('Avatar', 'email_address')
```

### ID Field

The `ID` field represents the primary key of your resource's database table. Typically, each Nova resource you define should contain an `ID` field. By default, the `ID` field assumes the underlying database column is named `id`:

```php
use Laravel\Nova\Fields\ID;

// Using the "id" column...
ID::make()

// Using the "id_column" column...
ID::make('ID', 'id_column')
```

### Image Field

The `Image` field extends the [File field](#file-field) and accepts the same options and configurations. The `Image` field, unlike the `File` field, will display a thumbnail preview of the underlying image when viewing the resource:

```php
use Laravel\Nova\Fields\Image;

Image::make('Photo')
```

:::tip File Fields

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](./file-fields.md).
:::

### Markdown Field

The `Markdown` field provides a WYSIWYG Markdown editor for its associated field. Typically, this field will correspond to a `TEXT` column in your database. The `Markdown` field will store the raw Markdown text within the associated database column:

```php
use Laravel\Nova\Fields\Markdown;

Markdown::make('Biography')
```

### Number Field

The `Number` field provides an `input` control with a `type` attribute of `number`:

```php
use Laravel\Nova\Fields\Number;

Number::make('price')
```

You may use the `min`, `max`, and `step` methods to set their corresponding attributes on the generated `input` control:

```php
Number::make('price')->min(1)->max(1000)->step(0.01)
```

### Password Field

The `Password` field provides an `input` control with a `type` attribute of `password`:

```php
use Laravel\Nova\Fields\Password;

Password::make('Password')
```

The `Password` field will automatically preserve the password that is currently stored in the database if the incoming password field is empty. Therefore, a typical password field definition might look like the following:

```php
Password::make('Password')
    ->onlyOnForms()
    ->creationRules('required', 'string', 'min:6')
    ->updateRules('nullable', 'string', 'min:6'),
```

### Place Field

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
        Country::make('Country')->hideFromIndex(),
    ]);
}
```

#### Searchable Countries

By default, the `Place` field will search all addresses around the world. If you would like to limit the countries included in the search, you may use the `countries` method:

```php
Place::make('Address', 'address_line_1')->countries(['US', 'CA'])
```

#### City Search

If you intend to use the `Place` field to search for cities instead of addresses, you may use the `onlyCities` method to instruct the field to only list cities in its results:

```php
Place::make('City')->onlyCities()
```

:::tip City Auto-Completion

When using the `Place` field as a city search, the `state` and `country` fields will still receive auto-completion. However, the `postal_code` field will not.
:::

#### Configuring Field Auto-Completion

By default, the place field will auto-complete the associated address fields based on their field names. The `Place` field will automatically fill fields named `address_line_2`, `city`, `state`, `postal_code`, and `country`. However, you may customize the field names that should be auto-completed using the following methods:

- `secondAddressLine($column)`
- `city($column)`
- `state($column)`
- `postalCode($column)`
- `country($column)`

For example:

```php
Place::make('Address', 'address_line_1')
    ->secondAddressLine('address_2')
    ->city('city_name')
    ->state('state_code')
    ->postalCode('zip_code')
    ->country('country_code')
```

### Select Field

The `Select` field may be used to generate a drop-down select menu. The select menu's options may be defined using the `options` method:

```php
use Laravel\Nova\Fields\Select;

Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])
```

On the resource index and detail screens, the `Select` field's "key" value will be displayed. If you would like to display the labels instead, you may use the `displayUsingLabels` method:

```php
Select::make('Size')->options([
    'S' => 'Small',
    'M' => 'Medium',
    'L' => 'Large',
])->displayUsingLabels()
```

### Status Field

The `Status` field may be used to display a "progress state" column. Internally, Nova uses the `Status` field to indicate the current state (waiting, running, or finished) of queued actions. However, you are free to use this field for your own purposes as needed:

![Status Field Example](./img/status-field-waiting.png)

The `loadingWhen` and `failedWhen` methods may be used to instruct the field which words indicate a "loading" state and which words indicate a "failed" state. In this example, we will indicate that database column values of `waiting` or `running` should display a "loading" indicator:

```php
use Laravel\Nova\Fields\Status;

Status::make('Status')
        ->loadingWhen(['waiting', 'running'])
        ->failedWhen(['failed'])
```

### Text Field

The `Text` field provides an `input` control with a `type` attribute of `text`:

```php
use Laravel\Nova\Fields\Text;

Text::make('name')
```

### Textarea Field

The `Textarea` field provides a `textarea` control:

```php
use Laravel\Nova\Fields\Textarea;

Textarea::make('Biography')
```

### Timezone Field

The `Timezone` field generates a `Select` field containing a list of the world's timezones:

```php
use Laravel\Nova\Fields\Timezone;

Timezone::make('Timezone')
```

### Trix Field

The `Trix` field provides a [Trix editor](https://github.com/basecamp/trix) for its associated field. Typically, this field will correspond to a `TEXT` column in your database. The `Trix` field will store its corresponding HTML within the associated database column:

```php
use Laravel\Nova\Fields\Trix;

Trix::make('Biography')
```

:::danger File Uploads

Nova does not currently support embedded file uploads within Trix fields.
:::

## Computed Fields

In addition to displaying fields that are associated with columns in your database, Nova allows you to create "computed fields". Computed fields may be used to display computed values that are not associated with a database column. These fields may be created by passing a callable (instead of a column name) as the second argument to the field's `make` method:

```php
Text::make('Name', function () {
    return $this->first_name.' '.$this->last_name;
})
```

:::tip Model Attribute Access

As you may have noticed in the example above, you may use `$this` to access the resource's underlying model attributes and relationships.
:::

## Customization

### Field Resolution / Formatting

The `resolveUsing` method allows you to customize how a field is formatted after it is retrieved from your database but before it is sent to the Nova front-end. This method accepts a callback which receives the raw value of the underlying database column:

```php
Text::make('Name')->resolveUsing(function ($name) {
    return strtoupper($name);
})
```

If you would like to customize how a field is formatted only when it is displayed on a resource's "index" or "detail" screen, you may use the `displayUsing` method. Like the `resolveUsing` method, this method accepts a single callback:

```php
Text::make('Name')->displayUsing(function ($name) {
    return strtoupper($name);
})
```
