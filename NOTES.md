# Notes
__A place to put notes, untill I've written `jote`__

## ToDo:
work on jask first, get a CLI and web app version
get the CLI version working first, then build the server, then build a web client
but then just get a fucking CLI interface working, I'm getting tired of having no ToDo manager.
Make a react jec provider that takes the jec server paramaters as props and renders a child function with the returned objects. atach a Components prop to the object populated with components that can be used to render the default props of object.

Have a `workspace` field that allows users to share actions to eachother, actions with a workspace field are checked against workspaces added to the store, if the don't match the action is not saved.
The idea of workspaces has implications on how actions should be distributed and shared, and also suggests that clients will need to be able to deal with multipul action sources (web servers etc). But this is an issue to deal with once I've got a working client.

## Handling other apps:
Objects should have an `apps` field, populated with UUIDs
These UUIDs should refference to an object that contains information about the apps that can be used to view the object.
Have a `types` field that details a schema, give those types an `enforce` field, that makes them more than just a suggestion
