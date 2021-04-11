# Lab 4

## Activity 1
Please see comments in activity1.js for an details.

## Activity 2
To view activity 2, simply open activity2.html in your browser.
All requirements were implemented.

## Activity 3
To view activity 3, simply open activity3.html in your browser.
All requirements except for R3 fully implemented. R3 does not allow back-to-back repeats but elements in the array may be
repeated before all elements used.
### Test Inputs:
#### /clear command:
input: ```/clear``` 

expected output: all storage is wiped and the user is brought back to a logged-out state.

#### /search command:
input: ```/search <value>```

expected output: If the searched value exists as a key within a dictionary entry, all answers for that entry are displayed
in a comma-separated list in the search box.

example input: ```/search ugly```

expected output: ```attractive, beauteous, beautiful, lovely, pretty, ravishing```

#### /history command:
input: ```/history```

expected output: An ordered list, inserted in the DOM, displaying the user's search history since the browser was opened
or the ```/clear``` command was used.

example input: ```/history```

expected output after doing searches for 'ugly', 'idiot' and 'foolish': 
```
1. ugly
2. idiot
3. foolish
```
