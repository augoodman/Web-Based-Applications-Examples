#Lab 2

##Activity 1
FAQ00.js contains the logic for implementing Activity 1.  FAQ00_test.js is a test stub for testing the various functions of FAQ00.js.  QA.json contains a sample data store for testing.  FAQ00_test.js runs the following tests:
Test 1 writes a new question to the data store.
Test 2 updates the answer of an existing question.
Test 3 updates the tags of an existing question.
Test 4 deletes the question that was updated in Test 3.
Test 5 searches the data store by author only.
Test 6 searches the data store by tags only.
Test 7 searches the data store by dates only.
Test 8 searches the data store by author, tags, and dates together.

The test stub can be ran from the activity1 folder with the following commands:
```
node
.load FAQ00_test.js
```

##Activity 2
FAQService00.js contains the logic for implementing Activity 2.  It can be ran from the activity2 folder with the following commands:
```
node
.load FAQService00.js
```
Navigate to localhost:3000 to view the app.
NOTES: 
-Early on the incorrect password text displayed properly upon incorrect password but broke at some point.  The for displaying message has been left for your review.
-I played with the "Welcome Back" message and there is some code for that but did get around to finishing it in time.
-For whatever reason, the Login button requires a second click.  I suspect this is connected to the note on incorrect passwords.

##Activity 3
FAQService.js contains the logic and test data for implementing Activity 3.  FAQ.js and QA.json  are extensions of their counterparts from the other activities and are mostly unchanged.  FAQService.js can be ran from the activity3 folder with the following commands:
```
node
.load FAQService.js
```
NOTES:
-The above notes from activity 2 apply here as well.
-I did my best to implement all requirements for this activity but most are only partially functional.  The app can pull, edit, and search from the persistent data store and most of the bugs have to do with properly using http and its methods.
