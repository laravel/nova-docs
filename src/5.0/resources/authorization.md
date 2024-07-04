# Authorization

[[toc]]

When Nova is accessed only by you or your development team, you may not need additional authorization before Nova handles incoming requests. However, if you provide access to Nova to your clients or a large team of developers, you may wish to authorize certain requests. For example, perhaps only administrators may delete records. Thankfully, Nova takes a simple approach to authorization that leverages many of the Laravel features you are already familiar with.

## Policies

To limit which users may view, create, update, or delete resources, Nova leverages Laravel's [authorization policies](https://laravel.com/docs/authorization#creating-policies). Policies are simple PHP classes that organize authorization logic for a particular model or resource. For example, if your application is a blog, you may have a `Post` model and a corresponding `PostPolicy` within your application.

When manipulating a resource within Nova, Nova will automatically attempt to find a corresponding policy for the model. If Nova detects a policy has been registered for the model, it will automatically check that policy's relevant authorization methods before performing their respective actions, such as:

- `viewAny`
- `view`
- `create`
- `update`
- `replicate`
- `delete`
- `restore`
- `forceDelete`

No additional configuration is required! So, for example, to determine which users are allowed to update a `Post` model, you simply need to define an `update` method on the model's corresponding policy class:

```php
namespace App\Policies;

use App\Models\User;
use App\Models\Post;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy # [!code focus:14]
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can update the post.
     *
     * @return mixed
     */
    public function update(User $user, Post $post) # [!code ++:4] 
    {
        return $user->type == 'editor';
    }
}
```

### Undefined Policy Methods

If a policy exists but is missing a method for a particular action, Nova will use the following default permission for each actions: 

| Policy Action          | Default Permission                |
|:-----------------------|:----------------------------------|
| `viewAny`              | Allowed                           |
| `view`                 | Forbidden                         |
| `create`               | Forbidden                         |
| `update`               | Forbidden                         |
| `replicate`            | Fallback to `create` and `update` |
| `delete`               | Forbidden                         |
| `forceDelete`          | Forbidden                         |
| `restore`              | Forbidden                         |
| `add{Model}`           | Allowed                           |
| `attach{Model}`        | Allowed                           |
| `attachAny{Model}`     | Allowed                           |
| `detach{Model}`        | Allowed                           |
| `runAction`            | Fallback to `update`              |
| `runDestructiveAction` | Fallback to `delete`              |

So, if you have defined a policy, don't forget to define all of its relevant authorization methods so that the authorization rules for a given resource are explicit.

### Hiding Entire Resources

If you would like to hide an entire Nova resource from a subset of your dashboard's users, you may define a `viewAny` method on the model's policy class. If no `viewAny` method is defined for a given policy, Nova will assume that the user can view the resource:

```php
namespace App\Policies;

use App\Models\User;
use App\Models\Post;
use Illuminate\Auth\Access\HandlesAuthorization;

class PostPolicy # [!code focus:13]
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any posts.
     *
     * @return mixed
     */
    public function viewAny(User $user) # [!code ++:4]
    {
        return in_array('view-posts', $user->permissions);
    }
}
```

### When Nova & Application Authorization Logic Differs

If you need to authorize actions differently when a request is initiated from within Nova versus your primary application, you may utilize Nova's `whenServing` method within your policy. This method allows you to only execute the given callback if the request is a Nova request. An additional callback may be provided that will be executed for non-Nova requests:

```php
namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Http\Request; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest; # [!code ++]
use Laravel\Nova\Nova; # [!code ++]

class PostPolicy # [!code focus:18]
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any posts.
     *
     * @return mixed
     */
    public function viewAny(User $user) # [!code ++:8]
    {
        return Nova::whenServing(function (NovaRequest $request) use ($user) {
            return in_array('nova:view-posts', $user->permissions);
        }, function (Request $request) use ($user) {
            return in_array('view-posts', $user->permissions);
        });
    }
}
```

### Relationships

We have already learned how to authorize the typical view, create, update, and delete actions, but what about relationship interactions? For example, if you are building a podcasting application, perhaps you would like to specify that only certain Nova users may add comments to podcasts. Again, Nova makes this simple by leveraging Laravel's policies.

When working with relationships, Nova uses a simple policy method naming convention. To illustrate this convention, lets assume your application has `Podcast` resources and `Comment` resources. If you would like to authorize which users can add comments to a podcast, you should define an `addComment` method on your podcast model's policy class:

```php
namespace App\Policies;

use App\Models\User;
use App\Models\Podcast;
use Illuminate\Auth\Access\HandlesAuthorization;

class PodcastPolicy # [!code focus:14]
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can add a comment to the podcast.
     *
     * @return mixed
     */
    public function addComment(User $user, Podcast $podcast) # [!code ++:4]
    {
        return true;
    }
}
```

As you can see, Nova uses a simple `add{Model}` policy method naming convention for authorizing relationship actions.

#### Authorizing Attaching / Detaching

For many-to-many relationships, Nova uses a similar naming convention. However, instead of `add{Model}`, you should use an `attach{Model}` / `detach{Model}` naming convention. For example, imagine a `Podcast` model has a many-to-many relationship with the `Tag` model. If you would like to authorize which users can attach "tags" to a podcast, you may add an `attachTag` method to your podcast policy. In addition, you will likely want to define the inverse `attachPodcast` on the tag policy:

```php
namespace App\Policies;

use App\Models\Podcast; # [!code ++]
use App\Models\User;
use App\Models\Tag;  # [!code ++]
use Illuminate\Auth\Access\HandlesAuthorization;

class PodcastPolicy # [!code focus:24]
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can attach a tag to a podcast.
     *
     * @return mixed
     */
    public function attachTag(User $user, Podcast $podcast, Tag $tag) # [!code ++:4]
    {
        return true;
    }

    /**
     * Determine whether the user can detach a tag from a podcast.
     *
     * @return mixed
     */
    public function detachTag(User $user, Podcast $podcast, Tag $tag)) # [!code ++:4]
    {
        return true;
    }
}
```

In the previous examples, we are determining if a user is authorized to attach one model to another. If certain types of users are **never** allowed to attach a given type of model, you may define a `attachAny{Model}` method on your policy class. This will prevent the "Attach" button from displaying in the Nova UI entirely:

```php
namespace App\Policies;

use App\Models\User;
use App\Models\Podcast; # [!code ++]
use Illuminate\Auth\Access\HandlesAuthorization;

class PodcastPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can attach any tags to the podcast.
     *
     * @return mixed
     */
    public function attachAnyTag(User $user, Podcast $podcast) # [!code ++:4] # [!code focus:4]
    {
        return false;
    }
}
```

:::warning Many To Many Authorization

When working with many-to-many relationships, make sure you define the proper authorization policy methods on each of the related resource's policy classes.
:::

### Disabling Authorization

If one of your Nova resources' models has a corresponding policy, but you want to disable Nova authorization for that resource (thus allowing all actions), you may override the `authorizable` method on the Nova resource:

```php
namespace App\Nova;

class Post extends Resource
{
    /**
     * Determine if the given resource is authorizable.
     *
     * @return bool
     */
    public static function authorizable() # [!code ++:4] # [!code focus:4]
    {
        return false;
    }
}
```

## Fields

Sometimes you may want to hide certain fields from a group of users. You may easily accomplish this by chaining the `canSee` method onto your field definition. The `canSee` method accepts a closure which should return `true` or `false`. The closure will receive the incoming HTTP request:

```php
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array # [!code focus:12]
{
    return [
        ID::make()->sortable(),

        Text::make('Name')
            ->sortable()
            ->canSee(function ($request) { # [!code ++:3]
                return $request->user()->can('viewProfile', $this);
            }),
    ];
}
```

In the example above, we are using Laravel's `Authorizable` trait's `can` method on our `User` model to determine if the authorized user is authorized for the `viewProfile` action. However, since proxying to authorization policy methods is a common use-case for `canSee`, you may use the `canSeeWhen` method to achieve the same behavior. The `canSeeWhen` method has the same method signature as the `Illuminate\Foundation\Auth\Access\Authorizable` trait's `can` method:

```php
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

/**
 * Get the fields displayed by the resource.
 *
 * @return array<int, \Laravel\Nova\Fields\Field>
 */
public function fields(NovaRequest $request): array # [!code focus:10]
{
    return [
        ID::make()->sortable(),

        Text::make('Name')
            ->sortable()
            ->canSeeWhen('viewProfile', $this), # [!code ++]
    ];
}
```

:::tip Authorization & The "Can" Method

To learn more about Laravel's authorization helpers and the `can` method, check out the full Laravel [authorization documentation](https://laravel.com/docs/authorization#via-the-user-model).
:::

## Index Filtering

You may notice that returning `false` from a policy's `view` method does not stop a given resource from appearing in the resource index. To filter models from the resource index query, you may override the `indexQuery` method on the resource's class.

This method is already defined in your application's `App\Nova\Resource` base class; therefore, you may simply copy and paste the method into a specific resource and then modify the query based on how you would like to filter the resource's index results:

```php
namespace App\Nova;

use Illuminate\Contracts\Database\Eloquent\Builder; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class Post extends Resource
{
    /**
     * Build an "index" query for the given resource.
     */
    public static function indexQuery(NovaRequest $request, Builder $query): Builder # [!code ++:4] # [!code focus:4]
    {
        return $query->where('user_id', $request->user()->id);
    }
}
```

## Relatable Filtering

If you would like to filter the queries that are used to populate relationship model selection menus, you may override the `relatableQuery` method on your resource.

For example, if your application has a `Comment` resource that belongs to a `Podcast` resource, Nova will allow you to select the parent `Podcast` when creating a `Comment`. To limit the podcasts that are available in that selection menu, you should override the `relatableQuery` method on your `Podcast` resource:

```php
namespace App\Nova;

use Illuminate\Contracts\Database\Eloquent\Builder; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class Podcast extends Resource
{
    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     */
    public static function relatableQuery(NovaRequest $request, Builder $query): Builder # [!code ++:7] # [!code focus:7]
    {
        return $query->where(
            'comment_id', 
            Comment::query()->where('active', true)->pluck('id')
        );
    }
}
```

#### Dynamic Relatable Methods

You can customize the "relatable" query for individual relationships by using a dynamic, convention based method name that is suffixed with the pluralized name of the model. For example, if your application has a `Post` resource, in which posts can be tagged, but the `Tag` resource is associated with different types of models, you may define a `relatableTags` method to customize the relatable query for this relationship:

```php
namespace App\Nova;

use Illuminate\Contracts\Database\Eloquent\Builder; # [!code ++]
use Laravel\Nova\Http\Requests\NovaRequest;

class Post extends Resource
{
    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     */
    public static function relatableTags(NovaRequest $request, Builder $query): Builder # [!code ++:4] # [!code focus:4]
    {
        return $query->where('type', 'posts');
    }
}
```

If necessary, you may access the `resource` and `resourceId` for the request via the `NovaRequest` instance that is passed to your method:

```php
namespace App\Nova;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Http\Requests\NovaRequest;

class Post extends Resource
{
    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     */
    public static function relatableTags(NovaRequest $request, Builder $query): Builder # [!code focus:8]
    {
        return $query->where('type', 'posts'); # [!code --]
        $resource = $request->route('resource'); // The resource type... # [!code ++:4]
        $resourceId = $request->resourceId; // The resource ID...

        return $query->where('type', $resource);
    }

}
```

#### Relationship Types

When a Nova resource depends on another resource via multiple fields, you will often assign the fields different names such as:

```php
namespace App\Nova;

use Laravel\Nova\Fields\BelongsTo; 
use Laravel\Nova\Fields\BelongsToMany; 
use Laravel\Nova\Fields\HasMany; 
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [
            // ...
            BelongsTo::make('Current Team', 'currentTeam', Team::class), # [!code focus:3]
            HasMany::make('Owned Teams', 'ownedTeams', Team::class),
            BelongsToMany::make('Teams', 'teams', Team::class),
        ];
    }
}
```

In these situations, you should supply a third argument when defining the relationship to specify which Nova resource the relationship should utilize, since Nova may not be able to determine this via convention:

```php
namespace App\Nova;

use Illuminate\Contracts\Database\Eloquent\Builder; # [!code ++]
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\BelongsToMany;
use Laravel\Nova\Fields\Field; # [!code ++]
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Http\Requests\NovaRequest;

class User extends Resource
{
    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [
            // ...
            BelongsTo::make('Current Team', 'currentTeam', Team::class), # [!code focus:3]
            HasMany::make('Owned Teams', 'ownedTeams', Team::class),
            BelongsToMany::make('Teams', 'teams', Team::class),
        ];
    }

    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     */
    public static function relatableTeams( # [!code ++:13] # [!code focus:13]
        NovaRequest $request, 
        Builder $query, 
        Field $field
    ): Builder {
        if ($field instanceof BelongsToMany && $field->attribute === 'teams') {
            // ... 
        } elseif ($field instanceof BelongsTo && $field->attribute === 'currentTeam') {
            // ...
        }

        return $query;
    }
}
```

## Scout Filtering

If your application is leveraging the power of Laravel Scout for [search](./../search/scout-integration.md), you may also customize the `Laravel\Scout\Builder` query instance before it is sent to your search provider. To accomplish this, override the `scoutQuery` method on your resource class:

```php
namespace App\Nova;

use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Scout\Builder as ScoutBuilder;

class Post extends Resource
{
    /**
     * Build a Scout search query for the given resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @param  \Laravel\Scout\Builder  $query
     * @return \Laravel\Scout\Builder
     */
    public static function scoutQuery( # [!code ++:6] # [!code focus:6]
        NovaRequest $request, 
        ScoutBuilder $query
    ): ScoutBuilder {
        return $query->where('user_id', $request->user()->id);
    }
}
```