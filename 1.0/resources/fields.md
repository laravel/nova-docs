# Fields

[[toc]]

## Defining Fields

Each Nova resource contains a `fields` method. This method returns an array of fields, which generally extend the `Laravel\Nova\Fields\Field` class. Nova ships with a variety of fields out of the box, including fields for text inputs, booleans, dates, file uploads, Markdown, and more.

To add a field to a resource, we can simply list it in the `fields` method. Typically, fields may be created using their static `make` method. This method accepts several arguments; however, you usually only need to pass the "human readable" name of the field. Nova will automatically "snake case" this string to determine the underlying database column name:

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

As noted above, Nova will "snake case" the displayable name of the field to determine the underlying database column name. However, you may pass the column name as the second argument to the field's `make` method:

```php
Text::make('Name', 'name_column')
```

## Showing / Hiding Fields

Often, you will not want to display a given field in certain situations. For example, there is typically no need to show a `Password` field on a resource index. Likewise, you may wish to only display a `Created At` field on the creation / update forms. Nova makes it a breeze to hide / show fields on certain screens.

The following methods may be used to show / hide fields based on the current screen:

- `hideFromIndex`
- `hideFromDetail`
- `hideWhenCreating`
- `hideWhenUpdating`
- `onlyOnIndex`
- `onlyOnDetail`
- `onlyOnForms`
- `exceptOnForms`

You may chain any of these methods onto your field's definition in order to instruct Nova when the field should be displayed:

```php
Text::make('Name')->hideFromIndex()
```

## Sortable Fields

When attaching a field to a resource, you may chain the `sortable` method onto the field's definition. This will instruct Nova to allow the resource index to be sorted by the given field:

```php
Text::make('Name', 'name_column')->sortable()
```

## Available Field Types

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

The `Avatar` field extends the [Image field](#image-field) and accepts the same options and configurations:

```php
use Laravel\Nova\Fields\Avatar;

Avatar::make('Avatar')
```

However, if a resource contains an `Avatar` field, that field will be displayed next to the resource's title when the resource is displayed in search results:

![Avatar Search Results](./img/avatar-search-results.png)

### Boolean Field

The `Boolean` field may be used to represent a boolean / "tiny integer" column in your database. For example, assuming your database a boolean column named `active`, you may attach a `Boolean` field to your resource like so:

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

The `Code` fields provides a beautiful code editor within your Nova administration panel. Generally, code fields should be attached to `TEXT` database columns. However, you may also attach them to `JSON` columns:

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

The `Date` field may be used to store a date value (without time). For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](#date-fields):

```php
use Laravel\Nova\Fields\Date;

Date::make('Birthday')
```

### DateTime Field

The `DateTime` field may be used to store a date-time value. For more information about dates and timezones within Nova, check out the additional [date / timezone documentation](#date-fields):

```php
use Laravel\Nova\Fields\DateTime;

DateTime::make('Updated At')->hideFromIndex()
```

### File Field

To learn more about defining file fields and handling uploads, check out the additional [file field documentation](#file-fields).

### Gravatar Field

The `Gravatar` field does not correspond to any column in your application's database. Instead, it will display the "Gravatar" image of a user.

By default, the Gravatar URL will be generated based on the value of the model's `email` attribute. However, if your user's email addresses are not stored in the `email` attribute, you may pass a custom column name to the field's `make` method:

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

## Date Fields

## File Fields

