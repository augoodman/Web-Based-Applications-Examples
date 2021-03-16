// TODO: import fs package

// TODO: write a Q&A to the persistent store

// TODO: update the content (answer text) of an existing Q&A from the existing persistent store

// TODO: update the tags for a Q&A from the existing persistent store

// TODO: delete a Q&A from an existing persistent store

// TODO: delete a Q&A from an existing persistent store

// TODO: return a collection of Q&As based on a filter, where the filter checks for one or more criteria

// Constraints on the Q&A service:
// C1. The class should prevent concurrent read/write problems (e.g. lost updates).
// C2. A Q&A is described by the following attributes: question, answer, tags, author, date and id. You
// can decide how you want to create a unique id (they can look different than the one in the
// example)
// C3. The persistent store for the Q&A service must be a JSON file named QA.json and in the same
// directory as your top-level executable code. We will provide an example for you, and you are free
// to generate and share additional test cases.

// Overall Constraints:
// C4. Put your code in 1 file, FAQ00.js.
// C5. You do not have to write a user interface, but you do have to specify the API for your object
// types in your README.txt, and provide example starting files and a sample test case of each
// service. That is, you must provide examples of how to instantiate your service object, and how to
// invoke it so we can test it manually.
// C6. Your code must be clear and well-written.
// C7. Use the synchronous file I/O features in NodeJS (it makes C1 MUCH easier).
