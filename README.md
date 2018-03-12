# JavascriptExoCortex

An ecosystem of tools for storing generic stuctured data with various differnt viewing apps.

---

<!-- vim-markdown-toc GFM -->

* [Idea](#idea)
   * [Apps](#apps)
      * [Possible Future Apps:](#possible-future-apps)
* [API](#api)
* [Packages](#packages)
   * [redux-distrubute](#redux-distrubute)
   * [jec-jask](#jec-jask)
   * [jec-jask-cli](#jec-jask-cli)
   * [jec-jask-web](#jec-jask-web)

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

#### Possible Future Apps:
+ jello: a trello clone
+ jal: a calender

If I tried to make a tool that works for everything on the first go I think I'd litterally go mad.

## API
You identity is a dat hash, you use it to gain access to your workspaces, workspaces can be shared

All data is pulled in through the dat network, all global config is stored in your user dat

## Packages

### redux-distrubute
> [repo][reduxDistribute]
Not enteirly sure what form this libray will take, but it will be used to extend a redux store with functionality to allow allow actions pushed into it to be distributed to peers

### jec-jask
Wraps [`jec-core`](#jec-core) to pull the data and config in and shape it into a more to-do list shape

### jec-jask-cli

### jec-jask-web

[reduxDistribute]: packages/redux-distribute
