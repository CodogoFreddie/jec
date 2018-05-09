# Redux Distribute

Needs to be able to reason about both our own local state, and a possibly-out-of-sync global state.
Reading/writing actions is primary, caching resolved state is secondary.

There are two places to save actions:
+ __Locally:__ assumed to _always_ exist, and _always_ be accessable, first thing we'll try to write to
+ __Globally:__ possibly exists, possibly accesable. Might contain actions not found in local store, and might be missing actions found in the local store.

There is also a cache of state, but this is very much viewed as a suggestion rather than a rule

## Lifecycle

### On Startup
1. Read current state cache
2. Read current action hash
3. If some actions haven't been incorporated into state, wind back to state before missing actions
4. If some actions haven't been sent to remote, send them; them recheck `3`

### On Create Action
1. Generate an action
2. Save it localy,
3. Try to save it globally

