# Authorization

[[toc]]

When Nova is accessed only by you or your development team, you may not need additional authorization before Nova handles incoming requests. However, if you provide access to Nova to your clients or large team of developers, you may wish to authorize certain requests. For example, perhaps only administrators may delete records. Thankfully, Nova takes a simple approach to authorization that leverages many of the Laravel features you are already familiar with.

## Policies

To limit which users may view, create, update, or delete resources, Nova leverages Laravel's [authorization policies](https://laravel.com/docs/5.6/authorization#creating-policies). Policies are simple PHP classes that organize authorization logic for a particular model or resource. For example, if your application is a blog, you may have a `Post` model and a corresponding `PostPolicy` within your application.

When manipulating a resource within Nova, Nova will automatically attempt to find a corresponding policy for the model. Typically, these policies will be registered in your application's `AuthServiceProvider`. If Nova detects a policy has been registered for the model, it will automatically check that policy's relevant authorization methods beofre performing their respective actions, such as:

- `viewAny`
- `view`
- `create`
- `update`
- `delete`
- `restore`
- `forceDelete`

No additional configuration is required! So, for example, to determine which users are allowed to update a `Post` model, you simply need to define an `update` method on the model's corresponding policy class:

```php
<?php

namespace App\Policies;

use App\User;
use App\Post;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the post.
     *
     * @param  \App\User  $user
     * @param  \App\Post  $post
     * @return mixed
     */
    public function update(User $user, Post $post)
    {
        return $user->type == 'editor';
    }
}
```

:::warning Undefined Policy Methods

If a policy exists but is missing a method for a particular action, the user will not be allowed to perform that action. So, if you have defined a policy, don't forget to define all of its relevant authorization methods.
:::

### Hiding Entire Resources

If you would like to hide an entire Nova resource from a subset of your dashboard's users, you may define a `viewAny` method on the model's policy class. If no `viewAny` method is defined for a given policy, Nova will assume that the user can view the resource:

```php
<?php

namespace App\Policies;

use App\User;
use App\Post;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any posts.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return in_array('view-posts', $user->permissions);
    }
}
```



### Relationships

### Disabling Authorization

If one of your Nova resources' models has a corresponding policy, but you want to disable Nova authorization for that resource, you may override the `authorizable` method on the Nova resource:

```php
/**
 * Determine if the given resource is authorizable.
 *
 * @return bool
 */
public static function authorizable()
{
    return false;
}
```

## Fields

## Index Filtering

## Relatable Filtering

## Scout Filtering
