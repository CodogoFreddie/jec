# Jec-Engine
The core engine that handles creating, compiling, and (later) querying Jec actions.

## API
Provides the following functions:

+ `setPersistHandlers`: Jec Engine needs the following functions to hook into the outside:
	+ `listActions`: output: a list of IDs uniqly idenifying every action
	+ `readAction`: input: an action UUID, output: that action
	+ `writeAction`: input: an action, sideEffect: save that action somehow
	Each of these functions should return a promise.
+ `initalise`: call once at program startup
+ `getState`: get the full engine state
+ `insertState`: input: an obj ID, and some state to add to it
+ `removeState`: input: and obj ID, and some state to remove from it.

