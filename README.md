# `@aweary/reactive`

A small utility for implementing naive reactivity for object fields.

```js
import reactive from '@aweary/reactive'

const state = { name: "Jane" }
// After calling reactive with a source object, it will
// now automatically watch for all property changes
reactive(state, (key, value) => {
  console.log(`${key} is now ${value}`)
})
// Changing a value invokes the observer function
state.name = "Jim"
// Logs "name is now Jim"
```