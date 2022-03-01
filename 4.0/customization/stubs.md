# Stubs

[[toc]]


When creating new resources, actions, filters, lens and metrics, Nova will publish files using the default stub files that exist within Nova. However, you may wish to customize these stubs for your own projects in order to apply common modifications automatically.

To publish the stubs used by Nova to generate various classes, execute the `php artisan nova:stubs` Artisan command in your terminal. Nova will copy all of its stub files into `./stubs/nova`, where you may then customize the files.

If you do not wish to customize a particular stub, you may delete the stub and Nova will continue to use the default version of the stub that exists within Nova itself.

:::tip Laravel Stub Customization

To learn more about stub customization, please consult the [Laravel documentation](https://laravel.com/docs/artisan#stub-customization).
:::
