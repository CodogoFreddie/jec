# Redux Distribute

saves and consumes redux actions to and from peers to create distributed apps


<!-- vim-markdown-toc GFM -->

* [Flows](#flows)
	* [On app startup](#on-app-startup)
	* [On new action created](#on-new-action-created)
	* [On new action arrives from someone else](#on-new-action-arrives-from-someone-else)
	* [Whenever a new action is inserted](#whenever-a-new-action-is-inserted)

<!-- vim-markdown-toc -->

## Flows

### On app startup

1. `redux-persist` hydrates with the most recent head state of the store
2. `redux-jec` pulls in a full list of all action tokens, and checks that they've all been applied
   1. If they have, our work is done
   2. else, continue
3. `redux-jec` inserts any new actions into the action history, by popping newer ones out, then replaying them from scratch

### On new action created

1. `redux-persist` sees an action, adds a timestamp and a salt to it, and allows it to be applied.
2. The `actions` reducer saves the id of the action (`timestamp + salt`)
3. `redux-persist` also saves the action, using the interface that's been passed to it

### On new action arrives from someone else

1. `redux-persist dispatches the action into the store

### Whenever a new action is inserted

1. If the action does not end up at the end of the `actions` reducer, it means there were some actions created more recently.
2. Therefore, we should pop all actions that came after it off the state, and reaply them after the new action has been applied.
3. We'll do this generally, regardless of where the action came from
4. To begin with, we won't do any smart caching, if we need to reply state we'll do it from the begining, by replaing all actions
5. As full action content isn't saved in the `action` reducer, we'll have to re-fetch the actions using the persist handlers: passing them the ID, and getting back a promise for the data.
