# Notes
__A place to put notes, untill I've written `jote`__

Sod this stupid Ramda shit, it adds no security and only confuses things, just have an eval :/

Have a `workspace` field that allows users to share actions to eachother, actions with a workspace field are checked against workspaces added to the store, if the don't match the action is not saved.
The idea of workspaces has implications on how actions should be distributed and shared, and also suggests that clients will need to be able to deal with multipul action sources (web servers etc). But this is an issue to deal with once I've got a working client.

## Handling other apps:
Objects should have an `apps` field, populated with UUIDs
These UUIDs should refference to an object that contains information about the apps that can be used to view the object.
