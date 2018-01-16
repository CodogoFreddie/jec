# JavascriptExoCortex

An ecosystem of tools for storing generic stuctured data with various differnt viewing apps.

---

<!-- vim-markdown-toc GFM -->
* [Idea](#idea)
	* [Apps](#apps)
* [API](#api)
	* [Data Provided](#data-provided)
* [Packages](#packages)
	* [jec-engine](#jec-engine)
	* [jec-config-fetcher](#jec-config-fetcher)
	* [jec-server](#jec-server)
	* [jec-cli-interface](#jec-cli-interface)
	* [jec-pure-cli](#jec-pure-cli)
	* [jec-client-cli](#jec-client-cli)
	* [jec-jask](#jec-jask)

<!-- vim-markdown-toc -->

---

## Idea
I have many apps that I want in my life that I would like to satisfy the core value proposition of Jec: 

+ Eventual consistency
+ Offline first
+ Cross platform

So I'm trying to build a unified data store that all my apps can connect to, as different view layers on the same data.

### Apps
I'm currently only roadmapping for 3 apps:
+ jask: todo list
+ jist: a shopping list
+ jote: a notes app

If I tried to make a tool that works for everything on the first go I think I'd litterally go mad.

## API
### Data Provided

+ `apps`: The apps registered with this JEC store, their `UUID`s, runtime hooks, and meta data about them.
+ `config`: A map of config values that should be tracked by JEC; things like `note sort order`, `tasking scoring function`.
+ `type`: A deep object specifying the types of all props in any data object stored in JEC. JEC suports the following types: `String | Boolean | Number | DateTime | Object | Array`.
+ `data`: The actual data objects stored in JEC, each object has props of 3 types:
	+ Builtin: The default props that are present in any instance of JEC, these include:
		+ created
		+ updated
		+ project
		+ tags
	+ User: user defined props, 
	+ App:

## Packages

### jec-engine
The core logic and processing of the JEC system.
This is a tool that accepts a stream of JEC compliant actions, and calculates the total state of a JEC instance. It also provides a querying language for reading data, and generating new actions.

### jec-config-fetcher
A package for reading the .jecrc.js config file that is used to configure all command line JEC tools

### jec-server
An HTTP server to wrap a running [`jec-engine`](#jec-engine) instance.

### jec-cli-interface
A package for provide an interface that a CLI querying provider must adhere to.
A JEC enabled CLI program shouldn't have to handle the full [`jec-engine`](#jec-engine) itself, so this package provides an interface for accessing the state.
There are two main implmentations, detailed below:

### jec-pure-cli
This CLI provider queries the filesystem for all actions, and reconstructs the full state on each run. This is simple, but ineficient

### jec-client-cli
This CLI provider queries a [`jec-server`](#jec-server) on each run. The server can stay active between queries, meaning that each query can be run much faster. This does however, require running a server.

### jec-jask
The first JEC enabled tool, which is a simple ToDo list manager.

