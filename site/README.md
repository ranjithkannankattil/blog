# Personal site — deployment & content guide

## Structure
```
index.html            Home
cv.html                CV
photography.html       Photography (grayscale contact-sheet grid)
writings.html           Writings archive — chronological + search
writing-post.html      Single-post template (reads ?slug=... )
css/style.css           All styling, incl. per-section colour themes
js/posts.js             ★ Your writings data lives here
js/writings.js          Archive rendering + search logic
js/post.js              Single-post rendering, prev/next, related
assets/                  Put images here (photos, CV PDF, etc.)
```

No build step. It's plain HTML/CSS/JS — GitHub Pages serves it as-is.

## Deploy to GitHub Pages
1. Create a new repo on GitHub, e.g. `ranjith.github.io` (this exact name gives
   you a URL at `https://<username>.github.io` with no extra path) — or any
   repo name if you're fine with a `/reponame/` suffix in the URL.
2. Push these files to the repo's default branch (`main`):
   ```
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<username>/<reponame>.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source → Deploy from a branch → main / (root)**.
4. Wait ~1 minute — GitHub gives you the live URL on that same settings page.

## Adding your real writings (100+ posts)
The whole archive, search, and post pages read from **one file**: `js/posts.js`.
Each post is one JS object — see the format documented at the top of that file.

**Migration path:**
1. **Blogspot** (kattuvithakal.blogspot.com): Blogger dashboard → Settings →
   Manage blog → Back up content. This downloads an XML file with every post
   and its original publish date.
2. **Facebook**: Settings → Your Facebook Information → Download Your
   Information → request your posts. You'll get HTML/JSON with post text and
   timestamps.
3. Once you have both exports, come back and I can write a converter script
   that reads them and generates the `POSTS` array in `js/posts.js`
   automatically — no manual retyping of 100+ posts.

## Adding real photos
Drop images in `assets/photos/`, then in `photography.html` swap a
`<div class="frame placeholder">` block for:
```html
<div class="frame">
  <img src="assets/photos/yourfile.jpg">
  <div class="cap">Caption text</div>
</div>
```

## Adding a CV PDF
Drop the file in `assets/`, then update the link near the bottom of `cv.html`.

## Design notes
- Each section (Home / CV / Photography / Writings) carries its own accent
  colour via `[data-section]` in `css/style.css` — change the hex values there
  to retheme a whole section in one place.
- The `◆` diamond divider is reused from your Hridyaksharangal poster system,
  as a visual thread between the professional site and your other design work.
- Malayalam text throughout Writings uses the **Manjari** typeface — the same
  family used in your Hridyaksharangal posters.
