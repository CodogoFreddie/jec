# Redux Distribute

saves and consumes redux actions to and from peers to create distributed apps


<!-- vim-markdown-toc GFM -->

* [Flows](#flows)
   * [On app startup](#on-app-startup)
   * [On new action created](#on-new-action-created)

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
2. `redux-persist` also 

