# Repeater Field 

[[toc]]

::: warning Beta
This field is currently in beta. The API, while stable, is subject to change while in the beta period.
:::

## Overview

The `Repeater` field allows you to create and edit repeatable structured data and store it in a JSON column or HasMany relationships. When using a `Repeater` inside Nova, you will be presented with an elegant interface for adding and editing repeatable items in the field:

![Repeater Field](./img/repeater-field-2.png)

## Defining the Repeater Field

To illustrate the behavior of the `Repeater` field, let's assume our Nova application has an `Invoice` resource. Each Invoice has many Line Items, with `quantity`, `description`, and `price` fields. 

Next, let's attach the `Repeater` field to our `Invoice` resource. By default, Nova will use the `Laravel\Nova\Fields\Repeater\JSON` to store data in a JSON database column. However, you may also explicitly use the `JSON` preset by calling the `asJson` method on the `Repeater` instance:

```php
<?php

namespace App\Nova;

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
			Repeater::make('Line Items')->asJson(),
		];
	}
}
```

Next, we need to create a "repeatable" to represent the line items for our invoice. To generate a new `Repeatable`, call the `nova:repeatable` Artisan command from the CLI:

```sh
php artisan nova:repeatable LineItem
```

Nova will generate a new file (`app/Nova/Repeater/LineItem.php`). In this file we can define the `quantity`, `description`, and `price` fields:

```php
<?php

namespace App\Nova\Repeater;

use Laravel\Nova\Fields\Currency;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Repeater\Repeatable;
use Laravel\Nova\Http\Requests\NovaRequest;

class LineItem extends Repeatable
{
	/**  
	 * Get the fields displayed by the block. 
	 * 
	 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request  
	 * @return array  
	 */
	public function fields(NovaRequest $request)
	{
		return [
			Number::make('Quantity')->rules('required', 'numeric'),
			Textarea::make('Description')->rules('required', 'string'),
			Currency::make('Price')->rules('required', 'numeric'),
		];
	}
}
```

## Repeatables

A `Repeatable` defines the set of fields and/or an Eloquent `Model` class used for a repeatable item. For example, here is a `Repeatable` representing a line item for an invoice:

```php
<?

namespace App\Nova\Blocks;

use Laravel\Nova\Fields\Repeater\Block;

class LineItem extends Block
{
	public static $model;

	public function fields()
	{
		return [
			Number::make('Quantity'),
			Textarea::make('Description'),
			Currency::make('Price'),
		];
	}
}
```

## Confirming Removal of Repeatables

You may also instruct Nova to present a confirmation modal before removing a repeatable by using the `confirmRemoval` method:

```php
Repeater::make('Attachments')->repeatables([
	\App\Nova\Repeater\File::make()->confirmRemoval(),
	\App\Nova\Repeater\Note::make(),
	\App\Nova\Repeater\Video::make()->confirmRemoval(),
]),
```

## Repeater Presets

The Repeater field supports 3 presets out-of-the-box: `Json`, `HasMany`, and `HasManyMorphable`. Each preset defines specific functionality for saving and retrieving repeatables from storage.

For example, your `Invoice` Nova resource could use a `Repeater` field to edit the line items for an invoice. Using the `Laravel\Nova\Fields\Repeater\JSON` preset, those line items could be stored in a `line_items` JSON column. Alternatively, using the `HasMany` preset, the line items could be stored in a separate 'line_items' database table, with fields corresponding to each database column. 

In addition to the `JSON` and `HasMany` presets, the `Repeater` field also supports an additional preset, named `HasManyMorphable`, which allows you to store repeatables in a `HasMany` relationship, but then allows for the related models to be polymorphic.

The `Repeater` field is not limited to a single type of structured data. It also supports multiple "repeatable" types, which contain their own unique field sets. These "repeatables" could be used to create interfaces for editing flexible content areas similar to those offered by content management systems or attachments for a project that can be of multiple types.

### JSON Preset

The `JSON` preset saves data in a `json` column. To use the `JSON` preset, call the `asJSON` on the `Repeater` instance:

```php
Repeater::make('Line Items')
	->repeatables([
		\App\Nova\Repeater\LineItem::make(),
	]),
	->asJSON()
```

Nova will save the repeatable data with the following format:

```php
[
	[
		'type' => 'line-item',
		'fields' => [
			 'quantity' => 69,
			 'description' => 'Goods and services',
			 'price' => 420,
		]
	],
]
```

Before using this preset, you should ensure that the underlying Eloquent attribute for the resource's repeater column is configured to cast to an `array` (or equivalent) within your Eloquent model class:

```php
protected $casts = [
    'line_items' => 'array'
];
```

### HasMany Preset

The `HasMany` preset saves data using Eloquent `HasMany` relationships. To use the `HasMany` preset, call the `asHasMany` method on the `Repeater` instance:

```php
Repeater::make('Line Items')
	->repeatables([
		\App\Nova\Repeater\LineItem::make(),
	])
	->asHasMany()
```

Note that the `HasMany` preset requires each repeatable to specify the underlying model it represents by setting the `model` property on the `Repeatable`. For example, a `LineItem` repeatable would need to specify the underlying `\App\Models\LineItem` model it represents:

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

### HasManyMorphable Preset

The `HasManyMorphable` preset saves data using Eloquent `HasMany` relationships, but each repeatable item can be of multiple object types. To use the `HasManyMorphable` preset, call the `asHasManyMorphable` method on the `Repeater` instance:

```php
Repeater::make('Attachments')
	->repeatables([
		\App\Nova\Repeater\Link::make(),
		\App\Nova\Repeater\File::make(),
		\App\Nova\Repeater\Note::make(),
	])
	->asHasManyMorphable('attachable', 'attachment')
```

Notice how the `HasManyMorphable` preset takes two parameters in its constructor. The first parameter is the method name used when defining the `MorphTo` relationship of your related parent model, and the second is the method name used when defining the reverse 'MorphOne' relationship:

```php
// \App\Models\Attachment.php
public function attachable()
{
	return $this->morphTo();
}

// \App\Models\Link.php
public function attachment()
{
	return $this->morphOne(Attachment::class, 'attachable');
}
```

## Upserting Repeatables Using Unique Fields

By default, when editing your Repeater items configured with the `HasMany` and `HasManyMorphable` presets, Nova will delete all of the related items and recreate them every time you save your resource. To instruct Nova to upsert the data instead, ensure you have a unique column on your related models. Typically this would be an autoincrementing column or a column containing some other unique identifier. You may then use the `uniqueField` method to specify which column contains the unique key for the database table:

```php
<?

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
				->asHasMany()
				->uniqueField('uuid')
				->repeatables([
					\App\Nova\Repeater\LineItem::make()
				])
		];
	}
}
```

In addition, the `fields` method for the `Repeatable` must contain a field matching the `uniqueField`. In this example, the `LineItem` block might look like this:

```php
<?

namespace App\Nova\Blocks;

use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Repeater\Block;

class LineItem extends Block
{
	public static $model;

	public function fields()
	{
		return [
			ID::hidden('uuid'), // The unique ID field
			// Other fields...
		];
	}
}
```

Note the use of the `ID::hidden` method, which prevents Nova from showing the `ID` field to the user but still passes its value to Nova when saving and updating.


### Limitations of Fields Inside Repeatables

While a `Repeatable` can use many of the same fields as your normal Nova resources and actions, they do not behave the same way. For instance, methods like `creationRules`, and `updateRules` do not work because the validation rules are the same for both creation and edit modes. Also, fields inside a `Repeatable` do not support dependent field (`dependsOn`) functionality.

#### Unsupported Field Types in Repeatables

The following field types are not currently supported for use within Blocks:

- Markdown Field
- File Field
- Vapor File Field

### Using 

To use the `HasMany` and `HasManyMorphable` preset with your blocks, you must set the static `$model` property to match the underlying Eloquent model it represents:

```php
<?

namespace App\Nova\Blocks;

use Laravel\Nova\Fields\Repeater\Block;

class LineItem extends Block
{
	/**  
	 * The model the block corresponds to. 
	 * 
	 * @var class-string
	 */
	public static $model = \App\Models\LineItem::class;

	/**  
	 * Get the fields displayed by the block. 
	 * 
	 * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request  
	 * @return array  
	 */
	public function fields(NovaRequest $request)
	{
		return [
			// Fields
		];
	}
}

```