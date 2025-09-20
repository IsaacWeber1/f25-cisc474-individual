Develop a Prisma Schema for your individual web application (the LMS).

You need to provide definitions for all the tables required for the Minimal Viable Product version of your planned application, as described in the previous vision:

> To create a flexible, user-friendly, and scalable Learning Management System that empowers learners, instructors, and administrators by providing a structured yet adaptable environment for managing programming problems structured around courses, assignments, submissions, and feedback. The LMS will support diverse learning needs, streamline administrative processes, and foster meaningful engagement between all roles in the system. You'll also need to add some kind of cool feature for a unique submission type.

I am not strictly requiring specific tables or relationships, but it needs to make sense. Feel free to collaborate in your data model, but no two people's data models should be exactly the same.

In addition to your schema, you also need to generate test data that matches your schema and is seeded into the database via the \`packages/database/src/seed.ts\` script. You are free to create this data automatically or manually using any tools and technologies that you want. The more authentic and realistic the data is, the better. There are many tools and libraries for creating fake data (e.g., faker.js, Faker), and some even directly connect with Prisma via third party generators. This is a place where an LLM might also be very helpful. The simplest thing to do is to just create JSON files that you load into the \`seed.ts\` file, and curate the data manually, but there are many ways to do this.

There is no specific "minimum" or "maximum" amount of data required. Generate a _reasonable_ amount of test data, such that you will be able to load interesting data into your frontend. Think of a few different kinds of interesting cases (e.g., a course with no assignments, a course with several different kinds of users, a course with multiple assignments) for each table/relationship.

Once you have the data created, seed it into your database on supabase. Almost certainly, you will need to do some migrations and reset any existing data present in the database. You will likely have to do this periodically as you develop your application and make changes to your schema.

Once you've seeded all the data in the database, navigate to each table in the Supabase UI and [export the data Links to an external site.](https://www.whalesync.com/blog/how-to-export-supabase-database-to-csv). Save the CSV files into a new directory in your individual project repository, either in the \`apps/docs/\` or in the \`packages/database/\` somewhere. This is not a standard thing to do - but it will make it much easier for us to see what data you created and grade things.

Create a new markdown file in the \`apps/docs/\` directory with links to the following:

*   A link to the \`prisma.schema\` file in your github repository
*   A list of links to each of the exported csv files that you've created, clearly indicating what table you are linking to.

Submit a direct link to the markdown file in the github repository.

You may find it helpful to refer to the Prisma documentation: [https://www.prisma.io/docs/orm/prisma-schema/data-model/models Links to an external site.](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)

**Changelog:**

*   9/15/2025 at 3:41pm by acbart: Provided a link to the Prisma docs