#### DTOs from the Backend

Previously, we wired up our backend to send data to our frontend. In my example, I previously just dumped the contents of that data using \`JSON.stringify\`. But if we actually want to do things with that data, we need to have proper type definitions. Technically, we could just use the models we defined through Prisma that are importable from \`@repo/database\`. But those are our actual database models, and might have secret information (e.g., password field). Instead, when we send data from our backend to our frontend, we actually want to send DTOs: Data Transfer Objects.

> A Data Transfer Object is an object that is used to encapsulate data, and send it from one subsystem of an application to another.
> 
> DTOs are most commonly used by the Services layer in an N-Tier application to transfer data between itself and the UI layer. The main benefit here is that it reduces the amount of data that needs to be sent across the wire in distributed applications. They also make great models in the MVC pattern.

Think of them as dumb little versions of your model, potentially with fewer fields or simplified representations. Any complex instances or objects will also get turned into simple JSON, a process we refer to as "hydration" and "dehydration". For example, instead of sending an instance of a DateTime class, you might send a string representation of the date, or an object with separate fields for month/day/year/timezone/etc. 

Whenever you extract data from your database in a service, you eventually create a DTO based on the model data. That transformation might happen in the service, or it might happen in the controller - there are pros and cons to each approach. Some people like to have a clean barrier between the DTOs and the service layer, and some people like to keep all the data logic in their service. Whichever approach you want to go with, try to stay consistent in your application. Remember, minimize the number of surprises.

On the frontend, you can provide a [type argument to your fetcher Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/ef670c3b3397879b0f3b243ff5d466dcfc8eb395/apps/web-start/src/routes/courses/index.tsx#L8) that makes it clear what kind of data it will return. Check out how I did it in my example to see. Once you've done so, you can safely (from a type perspective) [access fields Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/ef670c3b3397879b0f3b243ff5d466dcfc8eb395/apps/web-start/src/routes/courses/index.tsx#L43-L44), assuming your backend does what you told the type system it does. Note that I've written a lot of code to take advantage of how Tanstack Router/Query let's us do [data loading Links to an external site.](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading).

**Goal 1**: We need to create some simple DTOs that represent the returned data from your endpoint, make your backend return those instead of the database models, and then let the frontend use those to properly render data from your backend.

#### Validation with Zod

I set up some example DTOs in my packages/api directory, which use the Zod framework. Zod is a validation library, which let's you "define schemas you can use to validate data, from a simple string to a complex nested object." The [syntax is a little weird Links to an external site.](https://zod.dev/basics), but once you've got it set up, you can quickly confirm that the data coming to you from other parts of the system matches the specification you set. Check out how I [defined schemas for my DTOs Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/main/packages/api/src/courses.ts).

There are tools for generating Zod definitions from Prisma schemas automatically, but I advise against trying to incorporate them for now. For one thing, we want to make our DTOs a little different from our models. For another, we should get used to writing these from scratch.

A major pain point is keeping the Prisma Schemas and DTOs in alignment, including the frontend and backend code that processes them. When you change things in one place, you have to make sure you update the other parts of the system. Automated tooling can help, but it's not a substitute for staying aware of how data is transformed across your application.

#### DTOs from the Frontend

That Stack Overflow response actually makes another great point:

> Another use for DTOs can be to encapsulate parameters for method calls. This can be useful if a method takes more than four or five parameters.

Some of your endpoints are meant to be "getters" (e.g., get all models from a table, get a specific model from a table), but many of them will actually be "setters". For instance, you'll have an endpoint for creating, one for updating, and one for deleting. Depending on the complexity of the data, you might have other kinds too - if you had an endpoint for managing a list of assignments in a course, you might have an endpoint for swapping the order of two of the assignments. We call all of these "mutations", because they are going to "mutate" data in the database.

The parameters coming into the endpoint can also be framed as DTOs. These DTOs will vary heavily depending on what you are trying to do:

*   If you are trying to create a new instance, you might have values for all the fields, but you won't have an ID (depending on whether you are using UUIDs or integer IDs)
*   If you are trying to update an existing instance, you need to have the target ID, and at least one field (but likely not all the fields)
*   If you are trying to delete or retrieve an instance, you only need to have the target ID
*   If you are trying to search/filter for an instance, you might have some partial information about some of the fields.

You can see an example of how I created a creation form for courses here: [https://github.com/acbart/cisc474-f25-individual-project-starter/blob/main/apps/web-start/src/routes/courses/create.tsx Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/main/apps/web-start/src/routes/courses/create.tsx)

The controller: [https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/api/src/courses/courses.controller.ts#L34-L40 Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/api/src/courses/courses.controller.ts#L34-L40)

The service: [https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/api/src/courses/courses.service.ts#L8-L20 Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/api/src/courses/courses.service.ts#L8-L20)

Unfortunately, I had to disable the actual runtime validation checking (via a Pipe) since the latest version of Zod apparently has a bug. But at least we're getting compile-time type-safety, if not runtime schema validation.

**Goal 2**: Create DTOs for the other types of operations, which can be sent by the frontend when we perform backend "mutation" operations. The backend should take these and process them.

#### Mutations and the Cache

A big idea here is that we're going to be storing data in the cache. But what happens when the cache gets out of date, because we did a mutation? The answer is that we can [invalidate the cache or update the cache Links to an external site.](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses) whenever we make a mutation.

That's what this code is doing: [https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/web-start/src/routes/courses/create.tsx#L24-L26 Links to an external site.](https://github.com/acbart/cisc474-f25-individual-project-starter/blob/d74fc1422475a4549bfd3490edcafd193a526d8b/apps/web-start/src/routes/courses/create.tsx#L24-L26)

#### The Actual Work

Pick one of the pages you made last week, where you rendered data from your backend. Make sure you are actually rendering all of the fields from the object, using an appropriately typed fetcher. Create three distinct forms for that page: a form to create new items, one to edit the items, and one to delete an item. Setup the forms so that we can create, update, and delete items from the list you were previously displaying.

You will need to create DTOs in the packages/api package (not the apps/api) package. These can be imported in the frontend and backend (apps/web-start and apps/api).

You'll need to add new routes to your backend and new methods in your service to handle the new functionality for creating, updating, and deleting items.

Submit the link to your page that has all of these form actions. Give us clear instructions to be able to use these, especially if you decide to have them across multiple pages. Don't make us think!