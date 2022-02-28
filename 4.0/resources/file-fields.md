# File Fields

[[toc]]

Nova offers several types of file fields: `File`, `Image`, `Avatar`, `VaporFile`, and `VaporImage`. The `File` field is the most basic form of file upload field, and is the base class for both the `Image` and `Avatar` fields. In the following documentation, we will explore each of these fields and discuss their similarities and differences.

## Overview

To illustrate the behavior of Nova file upload fields, let's assume our application's users can upload "profile photos" to their account. So, our `users` database table will have a `profile_photo` column. This column will contain the path to the profile photo on disk, or, when using a cloud storage provider such as Amazon S3, the profile photo's path within its "bucket".

### Defining The Field

Next, let's attach the file field to our `User` resource. In this example, we will create the field and instruct it to store the underlying file on the `public` disk. This disk name should correspond to a disk name in your application's `filesystems` configuration file:

```php
use Laravel\Nova\Fields\File;

File::make('Profile Photo')->disk('public'),
```

### Disabling File Downloads

By default, the `File` field allows the user to download the corresponding file. To disable this, you may call the `disableDownload` method on the field definition:

```php
File::make('Profile Photo')->disableDownload(),
```

### How Files Are Stored

When a file is uploaded using this field, Nova will use Laravel's [Flysystem integration](https://laravel.com/docs/filesystem) to store the file on the disk of your choosing and the file will be assigned a randomly generated filename. Once the file is stored, Nova will store the relative path to the file in the file field's underlying database column.

To illustrate the default behavior of the `File` field, let's take a look at an equivalent Laravel route that would store the file in the same way:

```php
use Illuminate\Http\Request;

Route::post('/photo', function (Request $request) {
    $path = $request->profile_photo->store('/', 'public');

    $request->user()->update([
        'profile_photo' => $path,
    ]);
});
```

Of course, once the file has been stored, you may retrieve it within your application using the Laravel `Storage` facade:

```php
use Illuminate\Support\Facades\Storage;

Storage::get($user->profile_photo);
Storage::url($user->profile_photo);
```

:::tip Customization

The documentation above only demonstrates the default behavior of the `File` field. To learn more about how to customize its behavior, check out the [customization documentation](#customization).
:::

#### The Local Disk

If you are using the `public` disk in conjunction with the `local` driver, you should run the `php artisan storage:link` Artisan command to create a symbolic link from `public/storage` to `storage/app/public`. To learn more about file storage in Laravel, check out the [Laravel file storage documentation](https://laravel.com/docs/filesystem).

## Images

The `Image` field behaves exactly like the `File` field; however, instead of only displaying the path to the file within the Nova dashboard, an `Image` field will show a thumbnail preview of the underlying file. All of the configuration and customization options of the `Image` field mirror that of the `File` field:

```php
use Laravel\Nova\Fields\Image;

Image::make('Profile Photo')->disk('public'),
```

To set the width of the `Image` field when being displayed, you can use the `maxWidth` method:

```php
Image::make('Profile Photo')->maxWidth(100),
```

:::tip Max Width

You may also use the `maxWidth` method on the [Avatar](#avatars) and [Gravatar](/1.0/resources/fields.html#gravatar-field) fields.
:::

## Avatars

The `Avatar` field behaves exactly like the `File` field; however, instead of only displaying the path to the file within the Nova dashboard, an `Avatar` field will show a thumbnail preview of the underlying file. All of the configuration and customization options of the `Avatar` field mirror that of the `File` field:

```php
use Laravel\Nova\Fields\Avatar;

Avatar::make('Poster')->disk('public'),
```

In addition to displaying a thumbnail preview of the underlying file, an `Avatar` field will also be automatically displayed in Nova search results. An `Avatar` field is not limited to "user" resources - you may attach `Avatar` fields to any resource within your Nova application:

![Avatar Example](./img/avatar-poster.png)

## Storing Metadata

In addition to storing the path to the file within the storage system, you may also instruct Nova to store the original client filename and its size (in bytes). You may accomplish this using the `storeOriginalName` and `storeSize` methods. Each of these methods accept the name of the column you would like to store the file information:

```php
use Illuminate\Http\Request;
use Laravel\Nova\Fields\File;
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
        // ...

        File::make('Attachment')
                ->disk('s3')
                ->storeOriginalName('attachment_name')
                ->storeSize('attachment_size'),

        Text::make('Attachment Name')->exceptOnForms(),

        Text::make('Attachment Size')
                ->exceptOnForms()
                ->displayUsing(function ($value) {
                    return number_format($value / 1024, 2).'kb';
                }),
    ];
}
```

One benefit of storing the original client filename is the ability to create file download responses using the original filename that was used to upload the file. For example, you may do something like the following in one of your application's routes:

```php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

Route::get('/download', function (Request $request) {
    $user = $request->user();

    return Storage::download(
        $user->attachment, $user->attachment_name
    );
});
```

:::tip File Downloads

When using the `storeOriginalName` method, the file field's "Download" link within the Nova dashboard will automatically download the file using its original name.
:::

## Pruning & Deletion

File fields are deletable by default, but you can override this behavior by using the `deletable` method:

```php
File::make('Photo')->disk('public')->deletable(false),
```

The `File` field, as well as the `Image` and `Avatar` fields, may be marked as `prunable`. The `prunable` method will instruct Nova to delete the underlying file from storage when the associated model is deleted from the database:

```php
File::make('Profile Photo')->disk('public')->prunable(),
```

:::warning Non-Nova Deletes

Nova will only automatically prune files for model deletes that are initiated within Nova. Other portions of your application may need to implement their own file deletion logic.
:::

## Customization

### Customizing File Storage

Previously we learned that, by default, Nova stores files using the `store` method of the `Illuminate\Http\UploadedFile` class. However, you may fully customize this behavior based on your application's needs.

#### Customizing The Name / Path

If you only need to customize the name or path of the stored file on disk, you may use the `path` and `storeAs` methods of the `File` field:

```php
use Illuminate\Http\Request;

File::make('Attachment')
    ->disk('s3')
    ->path($request->user()->id.'-attachments')
    ->storeAs(function (Request $request) {
        return sha1($request->attachment->getClientOriginalName());
    }),
```

#### Customizing The Entire Storage Process

However, if you would like to take **total** control over the file storage logic of a field, you may use the `store` method. The `store` method accepts a callable which receives the incoming HTTP request and the model instance associated with the request:

```php
use Illuminate\Http\Request;

File::make('Attachment')
    ->store(function (Request $request, $model) {
        return [
            'attachment' => $request->attachment->store('/', 's3'),
            'attachment_name' => $request->attachment->getClientOriginalName(),
            'attachment_size' => $request->attachment->getSize(),
        ];
    }),
```

As you can see in the example above, the `store` callback is returning an array of keys and values. These key / value pairs are mapped onto your model instance before it is saved to the database, allowing you to update one or many of the model's database columns after your file is stored.

Here's another example of customizing the storage process. In this example, we're using the `store` method to store the original file in public storage, create thumbnails using Laravel's queue system, and finally populating values in the resource's `media` relationship:

```php
use Laravel\Nova\Http\Requests\NovaRequest;

File::make('Attachment')
    ->store(function (NovaRequest $request, $model) {
        return function () use ($resource, $request) {
            $media = $resource->media()->updateOrCreate([], [
                'path'=> $request->file('attachment')->store('/path', 'public')
            ]);

            OptimizeMedia::dispatch($media);
        };
    }),
```

#### Invokables

Of course, performing all of your file storage logic within a Closure can cause your resource to become bloated. For that reason, Nova allows you to pass an "invokable" object to the `store` method:

```php
File::make('Attachment')->store(new StoreAttachment),
```

The invokable object should be a simple PHP class with a single `__invoke` method:

```php
<?php

namespace App\Nova;

use Laravel\Nova\Http\Requests\NovaRequest;

class StoreAttachment
{
    /**
     * Store the incoming file upload.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $attribute
     * @param  string  $requestAttribute
     * @param  string  $disk
     * @param  string  $storagePath
     * @return array
     */
    public function __invoke(NovaRequest $request, $model, $attribute, $requestAttribute, $disk, $storagePath)
    {
        return [
            'attachment' => $request->attachment->store('/', 's3'),
            'attachment_name' => $request->attachment->getClientOriginalName(),
            'attachment_size' => $request->attachment->getSize(),
        ];
    }
}
```

### Customizing File Deletion

When a file is deleted from the Nova administration panel, Nova will automatically remove the underlying file from storage and insert `NULL` into the field's associated column.

If you would like to override this behavior and provide your own file deletion implementation, you may use the `delete` method. Like the `store` method discussed above, the `delete` method accepts a callable which receives the incoming HTTP request and the model instance associated with the request:

```php
use Illuminate\Support\Facades\Storage;
use Laravel\Nova\Http\Requests\NovaRequest;

File::make('Attachment')
    ->disk('s3')
    ->delete(function (NovaRequest $request, $model, $disk, $path) {
        if (! $path) {
            return;
        }

        Storage::disk($disk)->delete($path);

        return [
            'attachment' => null,
            'attachment_name' => null,
            'attachment_size' => null,
        ];
    }),
```

As you can see in the example above, the `delete` callback is returning an array of keys and values. These key / value pairs are mapped onto your model instance before it is saved to the database, allowing you to update one or many of the model's database columns after your file is stored. Typically, when deleting a field, you will insert `NULL` into the relevant database columns.

#### Invokables

Of course, performing all of your file deletion logic within a Closure can cause your resource to become bloated. For that reason, Nova allows you to pass an "invokable" object to the `delete` method:

```php
File::make('Attachment')->delete(new DeleteAttachment);
```

The invokable object should be a simple PHP class with a single `__invoke` method:

```php
<?php

namespace App\Nova;

use Illuminate\Support\Facades\Storage;
use Laravel\Nova\Http\Requests\NovaRequest;

class DeleteAttachment
{
    /**
     * Delete the field's underlying file.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string|null  $disk
     * @param  string|null  $path
     * @return array
     */
    public function __invoke(NovaRequest $request, $model, $disk, $path)
    {
        if (! $path) {
            return;
        }

        Storage::disk($disk)->delete($path);

        return [
            'attachment' => null,
            'attachment_name' => null,
            'attachment_size' => null,
        ];
    }
}
```

### Customizing Previews

By default, Nova will use the `Storage::url` method to determine the URL that should be used to display image previews on the resource detail page and edit form. However, you may customize the generation of this URL using the `preview` method.

The `preview` method accepts a callable which should return the preview URL. The field's underlying column value is passed to the callable as the first parameter, while the name of the field's storage disk is passed as the second parameter:

```php
use Laravel\Nova\Fields\Image;
use Illuminate\Support\Facades\Storage;

Image::make('Profile Photo')
    ->disk('public')
    ->preview(function ($value, $disk) {
        return $value
                    ? Storage::disk($disk)->url($value)
                    : null;
    }),
```

:::tip Preview Size

By default, the Nova resource detail page will display previews at a width of 318 pixels (636 pixels for "retina displays").
:::

### Customizing Thumbnails

By default, Nova will use the `Storage::url` method to determine the URL that should be used to display thumbnail previews on the resource index page and within search results (when using the `Avatar` field). However, you may customize the generation of this URL using the `thumbnail` method.

The `thumbnail` method accepts a callable which should return the thumbnail URL. The field's underlying column value is passed to the callable as the first parameter, while the name of the field's storage disk is passed as the second parameter:

```php
use Laravel\Nova\Fields\Image;
use Illuminate\Support\Facades\Storage;

Image::make('Profile Photo')
    ->disk('public')
    ->thumbnail(function ($value, $disk) {
        return $value
                    ? Storage::disk($disk)->url($value)
                    : null;
    }),
```

:::tip Thumbnail Size

By default, Nova will display thumbnails at a width of 32 pixels (64 pixels for "retina displays").
:::

### Customizing Downloads

By default, Nova will use the `Storage::download` method to determine the file and filename that should be used for downloading the file. However, you may customize the generation of this URL using the `download` method. The `download` method accepts a callable which should return the result of your own invocation of the  `Storage::download` method:

```php
use Laravel\Nova\Fields\Image;
use Illuminate\Support\Facades\Storage;

Image::make('Profile Photo')
    ->disk('public')
    ->download(function ($request, $model, $disk, $value) {
        return Storage::disk($disk)->download($value, 'avatar');
    }),
```

### Customizing Accepted File Types

By default, the `File` field will allow any type of file to be uploaded; however, you may customize the accepted file types using the `acceptedTypes` method:

```php
File::make('Disk Image')->acceptedTypes('.dmg,.exe')
```

When using the `acceptedTypes` method, Nova adds the `accepts` attribute to the file input element; therefore, all of the following media types may be provided to the `acceptedTypes` method:

- `.dmg`
- `.dmg,.exe,.deb`
- `image/*`
- `audio/*`
- `video/*`
- All media types listed at [http://www.iana.org/assignments/media-types/](http://www.iana.org/assignments/media-types/)

:::warning File Type Validation

Since the `acceptedTypes` method only performs client-side validation, you should also validate the file type using server-side validation rules.
:::
