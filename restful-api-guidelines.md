## Use HTTP status codes Appropriately

**200** for **"ok"** following a GET success

**201** for **"created"** following a POST success

**400** for **"bad request"** when the user tries to POST some JSON content that is missing one or more of the keys (e.g. no "image" or no "ingredients")

**404** for **"not found"** when the server cannot find a recipe by the ID that the user has input (whether for PATCH, DELETE, or GET by ID)

**409** for **"conflict"** when trying to POST a recipe with a title that is already in use

**500** for **"internal server error"** if the POST fails without a **400** or a **409** being triggered


## Provide good error messages

In all of our response objects when an error has occurred, there is a key-value pair of `error: error.message` with a sentence such as...

- `We couldn't find a recipe by this ID!"` if a user tries to GET by ID, PATCH or DELETE using an invalid ID
- `"A recipe with this title already exists!"` if a user sends a POST request including a title that is already in use
- `"There is no data in the file."` if the `.json` file is empty

