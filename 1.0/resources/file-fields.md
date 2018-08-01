# File Fields

[[toc]]

Nova offers several types of file fields: `File`, `Image`, and `Avatar`. The `File` field is the most basic form of file upload field, and is the base class for both the `Image` and `Avatar` field classes. In the following documentation, we will explore each of these fields and discuss their similarities and differences.

## Overview

To illustrate the behavior of Nova file upload fields, let's assume our application's users can upload "profile photos" to their account. So, our `users` database table will have a `profile_photo` column. This column will contain the path to the profile on disk, or, when using a cloud storage provider such as Amazon S3, the profile photo's path within its "bucket".

### Defining The Field

Next, let's attach the file field to our `User` resource. In this example, we will create the field and instruct it to store the underlying file on the `public` disk. This disk name should correspond to a disk name in your `config/filesystems.php` configuration file:

```php
use Laravel\Nova\Fields\File;

File::make('Profile Photo')->disk('public')
```

### How Files Are Stored

When a file is uploaded using this field, Nova will use Laravel's [Flysystem integration](https://laravel.com/docs/filesystem) to store the file on the disk of your choosing with a randomly generated filename. Once the file is stored, Nova will store the relative path to the file in the file field's underlying database column.

To illustrate the default behavior of the `File` field, let's take a look at an equivalent route that would store the file in the same way:

```php
Route::post('/photo', function (Request $request) {
    $path = $request->profile_photo->store('/', 'public');

    $request->user()->update([
        'profile_photo' => $path,
    ]);
});
```

Of course, once the file has been stored, you may retrieve it within your application using the Laravel `Storage` facade:

```php
use Laravel\Support\Facades\Storage;

Storage::get($user->profile_photo);

Storage::url($user->profile_photo);
```

:::tip Customization

The documentation above only demonstrates the default behavior of the `File` field. To learn more about how to customize its behavior, check out the [customization documentation](#customization).
:::

## Images

The `Image` field behaves exactly like the `File` field; however, instead of only displaying the path to the file within the Nova dashboard, an `Image` field will show a thumbnail preview of the underlying file. All of the configuration and customization options of the `Image` field mirror that of the `File` field:

```php
use Laravel\Nova\Fields\Image;

Image::make('Profile Photo')->disk('public')
```

## Avatars

The `Avatar` field behaves exactly like the `File` field; however, instead of only displaying the path to the file within the Nova dashboard, an `Avatar` field will show a thumbnail preview of the underlying file. All of the configuration and customization options of the `Image` field mirror that of the `File` field:

```php
use Laravel\Nova\Fields\Image;

Image::make('Poster')->disk('public')
```

In addition to displaying a thumbnail preview of the underlying file, an `Avatar` field will also be automatically displayed in Nova search results. An `Avatar` field is not limited to "user" resources - you may attach `Avatar` fields to any resource within your Nova application:

![Avatar Example](./img/avatar-poster.png)

## Storing Metadata

In addition to storing the path to the file within the storage system, you may also instruct Nova to store the original client filename and its size (in bytes). You may accomplish this using the `storeOriginalName` and `storeSize` methods. Each of these methods accept the name of the column you would like to store the file information:

```php
use Laravel\Nova\Fields\File;
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
Route::get('/download', function () {
    $user = $request->user();

    return Storage::download(
        $user->attachment, $user->attachment_name
    );
})
```

:::tip File Downloads

When using the `storeOriginalName` method, the file field's "Download" link within the Nova dashboard will automatically download the file using its original name.
:::

## Pruning

The `File` field, as well as the `Image` and `Avatar` fields, may be marked as `prunable`. The `prunable` method will instruct Nova to delete the underlying file from storage when the associated model is deleted from the database:

```php
File::make('Profile Photo')->disk('public')->prunable()
```

:::warning Non-Nova Deletes

Nova will only automatically prune files for model deletes that are initiated within Nova. Other portions of your application may need to implement their own file deletion logic.
:::

## Customization

### Customizing File Storage

Previously we learned that, by default, Nova stores the file using the `store` method of the `Illuminate\Http\UploadedFile` class. However, you may fully customize this behavior based on your application's needs.

#### Customizing The Name / Path

If you only need to customize the name or path of the stored file on disk, you may use the `path` and `storeAs` methods of the `File` field:

```php
use Illuminate\Http\Request;

File::make('Attachment')
    ->disk('s3')
    ->path($request->user()->id.'-attachments')
    ->storeAs(function (Request $request) {
        return sha1($request->attachment->getClientOriginalName());
    })
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
    })
```

As you can see in the example above, the `store` callback is returning an array of keys and values. These key / value pairs are mapped onto your model instance before it is saved to the database, allowing you to update one or many of the model's database columns after your file is stored.

Of course, performing all of your file storage logic within a Closure can cause your resource to become bloated. For that reason, Nova allows you to pass an "invokable" object to the `store` method:

```php
File::make('Attachment')->store(new StoreAttachment)
```

The invokable object should be a simple PHP class with a single `__invoke` magic method:

```php
<?php

namespace App\Nova;

use Illuminate\Http\Request;

class StoreAttachment
{
    /**
     * Store the incoming file upload.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return array
     */
    public function __invoke(Request $request, $model)
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

### Customizing Preview Generation

### Customizing Thumbnail Generation
