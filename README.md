# JavascriptExoCortex

An ecosystem of tools for storing generic stuctured data with various differnt viewing apps.

---

<!-- vim-markdown-toc GFM -->
* [Idea](#idea)
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
## API
### Data Provided

+ `type`: 
+ `config`:
+ `data`:
	+ Builtin: 
	+ User: 
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

