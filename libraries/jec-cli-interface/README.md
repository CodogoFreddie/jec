# Jec-Cli-Interface

This package provides a specification for the interface that any node based jec provider should use. it allows all providers to be used in a unified dropin way.

## Spec

```js
export const getState = () => fullJecState //avoid using unless you have to, returns full compiled Jec state.
export const getState = (query) => queriesJecState //returns a limited representation of the Jec state, so you only get what you need.
export const writePath = (path, value) => //constructs, applys and stores an action to write a value at path.
export const clearPath = (path) => //removes a value, and any subvalues at path
```
