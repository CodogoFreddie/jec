# Redux Distribute

Needs to be able to reason about both our own local state, and a possibly-out-of-sync global state.
Reading/writing actions is primary, caching resolved state is secondary.

There are two places to save actions:

*   **Locally:** assumed to _always_ exist, and _always_ be accessable, first thing we'll try to write to
*   **Globally:** possibly exists, possibly accesable. Might contain actions not found in local store, and might be missing actions found in the local store.

There is also a cache of state, but this is very much viewed as a suggestion rather than a rule

## Lifecycle

### On Startup

1.  Check to make sure Local and Global actions match, if not, make sure they do
1.  Read current state cache
1.  Read current action hash

### On Create Action

1.  Generate an action
2.  Save it localy,
3.  Try to save it globally

## Required Hooks

*   `readCache(atAction): stateSnapshot`
*   `writeCache(atAction, state)`
*   localActions
    *   `writeAction(id, action)`
    *   `readAction(id): action`
    *   `listActions(): [id]`
*   globalActions
    *   `writeAction(id, action)`
    *   `readAction(id): action`
    *   `listActions(): [id]`
