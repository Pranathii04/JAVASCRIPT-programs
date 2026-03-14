## 3. Promises in JavaScript

## i. The Original Problem

JavaScript runs on a **single thread** using the **Call Stack**.

This means:
- Only **one operation runs at a time**
- If a task takes long (network request, file upload, image loading), JavaScript would **freeze**

Example:

```javascript
uploadFile()
processFile()
notifyUser()
```

If `uploadFile()` takes 5 seconds, the whole program waits.

To avoid blocking, browsers provide **Web APIs** such as:

- `setTimeout`
- `fetch`
- DOM events
- image loading

These APIs handle long operations **outside the call stack**.

---

# ii. Callback Solution

We pass a **function to run later**.

Example:

```javascript
function upload(callback){
    console.log("Uploading")

    setTimeout(()=>{
        callback()
    },2000)
}
```

Usage:

```javascript
upload(process)
```

After the upload finishes, `process()` runs.

---

# iii. Multiple Async Steps

Real applications often have multiple steps.

Example workflow:

1. Upload file
2. Process file
3. Save result

Using callbacks:

```javascript
upload(()=>{
    process(()=>{
        save()
    })
})
```

The structure becomes deeply nested.

```
upload
   process
      save
```

This pattern creates a pyramid structure.

---

# iv. Callback Hell

When many async operations are nested, code becomes difficult to manage.

Example:

```javascript
step1(()=>{
   step2(()=>{
      step3(()=>{
         step4(()=>{
            step5()
         })
      })
   })
})
```

Problems:

- Hard to read
- Hard to debug
- Error handling becomes messy
- Deep nesting

This is called **Callback Hell**.

---

# v. Why This Is Wrong

Example mistake:

```javascript
upload(process(save))
```

Why it is wrong:

Functions execute immediately.

JavaScript reads it as:

```
process(save) → runs immediately
upload(result)
```

But we want:

```
upload finishes
then process runs
then save runs
```

Correct approach:

```javascript
upload(()=>{
    process(()=>{
        save()
    })
})
```

But this still creates callback hell.

---

# vi. Promises

A **Promise** is an object that represents a value that will be available **in the future**.

Example analogy:

```
Ordering food at a restaurant
```

| Stage | Promise State |
|------|---------------|
| Cooking | Pending |
| Food delivered | Fulfilled |
| Kitchen failure | Rejected |

---

# vii. Promise States

A Promise has three states:

1. **Pending** – operation still running
2. **Fulfilled** – operation succeeded (`resolve`)
3. **Rejected** – operation failed (`reject`)

---

# viii. Creating a Promise

Promises are created using the **Promise constructor**.

```javascript
new Promise((resolve, reject) => {

})
```

The constructor provides two functions:

- `resolve()` → success
- `reject()` → failure

---

# ix. Image Loading Example

```javascript
function getImagePromise(url) {
    return new Promise((resolve, reject) => {

        const img = new Image()
        img.src = url

        img.onload = () => resolve(img)
        img.onerror = () => reject("Image failed")

    })
}
```

Explanation:

1. Create an image element
2. Start loading the image
3. If it loads successfully → resolve
4. If it fails → reject

So each image loading operation returns a **Promise**.

---

# x. Creating Promises for Multiple Images

```javascript
const promises = imageUrlsArr.map((url) => getImagePromise(url))
```

Steps:

```
images array
↓
map each url
↓
convert each url into a Promise
```

Result:

```
[
 Promise,
 Promise,
 Promise
]
```

---

# xi. Promise.all

We use:

```javascript
Promise.all(promises)
```

Two approaches exist.

### Sequential Loading

```
load image1
then image2
then image3
```

Total time might be **6 seconds**.

### Parallel Loading

```
load image1
load image2
load image3
at the same time
```

Total time might be **2 seconds**.

`Promise.all()` waits until **all promises finish**.

---

# xii. Using await

```javascript
const results = await Promise.all(promises)
```

Meaning:

```
wait until all promises resolve
```

Result:

```
[
 img1,
 img2,
 img3
]
```

---

# xiii. Adding Images to the DOM

```javascript
results.forEach((img) => imgContainer.appendChild(img))
```

Each loaded image is added to the page.

---

# xiv. How await Works Internally

When JavaScript sees:

```javascript
await promise
```

The process is:

```
async function enters call stack
↓
await encountered
↓
function pauses
↓
remaining JavaScript continues running
↓
promise resolves
↓
microtask queue
↓
event loop moves it back to call stack
↓
async function resumes
```

So internally:

```
await ≈ promise.then()
```

Example equivalence:

```javascript
await something()
```

is similar to:

```javascript
Promise.resolve(something()).then(...)
```

---

# xv. Final Flow of the Program

When the button is clicked:

```
click event
↓
preloadImages()
↓
map URLs to promises
↓
Promise.all()
↓
images load in parallel
↓
all promises resolve
↓
images added to DOM
```

---

# xvi. Why Promises Are Better

Callback approach:

```javascript
upload(()=>{
   process(()=>{
      save()
   })
})
```

Promises:

```
upload()
.then(()=>process())
.then(()=>save())
```

Async / Await:

```
await upload()
await process()
await save()
```

Callbacks → Promises (.then) → async/await