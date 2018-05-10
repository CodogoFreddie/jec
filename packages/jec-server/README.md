jec-server

## API v2 sketch:

### GET

#### /action/:id

#### /meta/:id?

`:id` defaults to the most recent id, returns an object with the following shape:

```
[
	{
		id: "",
		chainHash: "",
	},
	{
		id: "",
		chainHash: "",
	},
	...
	{
		id: "",
		chainHash: "",
	},
]
```

The first object is the action with id `:id`, the objects then go back through history exponentially: `[n - 1]`, `[n - 2]`, `[n - 4]`, ...etc as far back as the action chain goes.
This allows the client to binary search until they find the most recent action that they agree with the server on.

### POST

*   `/`

```

```
