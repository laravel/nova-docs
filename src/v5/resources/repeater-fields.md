# Repeater Fields

[[toc]]

::: warning Beta

This field is currently in beta. The API, while stable, is subject to change while in the beta period.
:::

## Overview

The `Repeater` field allows you to create and edit repeatable, structured data and store that data in a JSON column or `HasMany` relationship:

```php
<?php

namespace App\Nova;

use App\Nova\Repeater\LineItem;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Repeater;
use Laravel\Nova\Http\Requests\NovaRequest;
 
class Invoice extends Resource
{
	/**  
	 * Get the fields displayed by the resource. 
	 * 
	 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request  
	 * @return array  
	 */
	public function fields(NovaRequest $request)
	{
		return [
			ID::make(),
			Repeater::make('Line Items')
				->repeatables([
					LineItem::make(),
				]),
		];
	}
}
```

After defining a `Repeater` field, your resource will have an elegant interface for adding and editing repeatable items in the field:

![Repeater Field](./img/repeater-field.png)

## Repeatables

A `Repeatable` object represents the repeatable data for a `Repeater` field. It defines the set of fields used for the repeatable item. It also optionally defines an Eloquent `Model` class when the `Repeater` is using the `HasMany` preset.

The `Repeater` field is not limited to a single type of repeatable. It also supports multiple "repeatable" types, which may contain their own unique field sets and models. These repeatables could be used to create interfaces for editing flexible content areas, similar to those offered by content management systems.

### Generating Repeatables

To generate a new `Repeatable`, invoke the `nova:repeatable` Artisan command:

```sh
php artisan nova:repeatable LineItem
```

After invoking the command above, Nova generates a new file at `app/Nova/Repeater/LineItem.php`. This file contains a `fields` method in which you may list any supported Nova field. For example, below we will define a `Repeatable` representing a line item for an invoice:

```php
<?php

namespace App\Nova\Repeater;

use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Repeater\Repeatable;
use Laravel\Nova\Fields\Textarea;

class LineItem extends Repeatable
{
	/**
	 * Get the fields displayed by the repeatable.
	 *
	 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
	 * @return array
	 */
	public function fields(NovaRequest $request)
	{
		return [
			Number::make('Quantity')->rules('required', 'numeric'),
			Textarea::make('Description')->rules('required', 'max:255'),
			Currency::make('Price')->rules('required', 'numeric'),
		];
	}
}
```

### Confirming Repeatable Removal

You may instruct Nova to present a confirmation modal before removing a repeatable by invoking the `confirmRemoval` method when defining the repeatable:

```php
Repeater::make('Attachments')->repeatables([
	\App\Nova\Repeater\File::make()->confirmRemoval(),
	\App\Nova\Repeater\Note::make(),
	\App\Nova\Repeater\Video::make()->confirmRemoval(),
]),
```

## Repeater Presets

The `Repeater` field includes two storage "presets" out-of-the-box: `Json` and `HasMany`. Each preset defines how the repeatable data is stored and retrieved from your database.

For example, an `Invoice` resource could use a `Repeater` field to edit the line items for an invoice. Using the `Laravel\Nova\Fields\Repeater\JSON` preset, those line items would be stored in a `line_items` JSON column. However, when using the `HasMany` preset, the line items would be stored in a separate 'line_items' database table, with fields corresponding to each database column.

### JSON Preset

The `JSON` preset stores repeatables in a `JSON` column in your database. For example, the line items for an invoice could be store in a `line_items` column. When a resource with a `Repeater` field using the `JSON` preset is saved, the repeatables are serialized and saved to the column.

To use the `JSON` preset, simply invoke the `asJson` method on your `Repeater` field definition:

```php
Repeater::make('Line Items', 'line_items')
	->repeatables([
		\App\Nova\Repeater\LineItem::make(),
	])
	->asJson()
```

Before using this preset, you should ensure that the underlying Eloquent attribute for the resource's repeater column is configured to cast to an `array` (or equivalent) within your Eloquent model class:

```php
protected $casts = [
    'line_items' => 'array'
];
```

### HasMany Preset

The `HasMany` preset stores repeatables via Eloquent using a `HasMany` relationship. For example, instead of storing the line items for an invoice in JSON format, the data would be saved in a separate `line_items` database table, complete with dedicated columns mapping to each field in the repeatable. The `Repeater` field will automatically manage these relations when editing your resources.

To use the `HasMany` preset, simply invoke the `asHasMany` method on your `Repeater` field definition:

```php
Repeater::make('Line Items', 'lineItems')
	->repeatables([
		\App\Nova\Repeater\LineItem::make(),
	])
	->asHasMany()
```

The `HasMany` preset requires each repeatable to specify the underlying model it represents by setting the `model` property on the `Repeatable`. For example, a `LineItem` repeatable would need to specify the underlying `\App\Models\LineItem` model it represents:

```php
class LineItem extends Repeatable
{
	/**  
	 * The underlying model the repeatable represents. 
	 * 
	 * @var class-string
	 */
	public static $model = \App\Models\LineItem::class;
}
```

## Upserting Repeatables Using Unique Fields

By default, when editing your repeatables configured with the `HasMany` preset, Nova will delete all of the related items and recreate them every time you save your resource. To instruct Nova to "upsert" the repeatable data instead, you should ensure you have a unique identifier column on your related models. Typically, this will be an auto-incrementing column or a UUID. You may then use the `uniqueField` method to specify which column contains the unique key for the database table:

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
		ID::make(),
		
		Repeater::make('Line Items')
			->asHasMany()
			->uniqueField('uuid')
			->repeatables([
				\App\Nova\Repeater\LineItem::make()
			])
	];
}
```

In addition, the `fields` method for the `Repeatable` must contain a field matching the `uniqueField`:

```php
use Laravel\Nova\Fields\ID;

/**  
 * Get the fields displayed by the repeatable. 
 * 
 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request  
 * @return array  
 */
public function fields()
{
	return [
		ID::hidden('uuid'), // The unique ID field

		// Other fields...
	];
}
```

In this example, we utilized the `ID::hidden` method, which prevents Nova from showing the `ID` field to the user, but still passes its value to Nova when saving or updating the resource.

## Repeater Field Capabilities

While a `Repeatable` can use many of the same fields as typical Nova resources and actions, they do not behave in the same way. For instance, methods like `creationRules`, and `updateRules` are not supported because the validation rules are the same for both creation and edit modes. Also, fields inside a `Repeatable` do not support dependent field (`dependsOn`) functionality.

### Supported Fields

The `Repeater` field allows for every field supported by Nova, except for the following:

- HasOne
- MorphOne
- HasMany
- MorphMany
- BelongsTo
- MorphTo
- BelongsToMany
- MorphToMany

### Partially-Supported Fields

The following fields are partially supported:

- File Field
- Vapor File Field
- Markdown Field
- Trix Field

The `Markdown` and `Trix` fields support being used for text, but do not currently support attachments.
