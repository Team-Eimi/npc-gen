# NPC Generator

A static site (GitHub Pages friendly) with a "Generate" button that shows a
random image from the `images/` folder.

## How it works
`images/manifest.json` holds the list of image filenames, and
`script.js` fetches that manifest and picks one at random.

## Adding images

1. Drop image files into `images/` (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`).
2. Regenerate the manifest:
   ```
   node generate-manifest.js
   ```
3. Commit and push both the images and the updated `images/manifest.json`.

## Local preview

Open `index.html` via a local server (fetch requires http, not file://), e.g.:

```
npx serve .
```

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, go to **Pages** and set the source to the branch
   (e.g. `main`) and root folder.
3. Visit the published URL — the Generate button will pull a random image
   from `images/`.
