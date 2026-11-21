# Helper Duties

Daily checklist for our helper, built from the duty list in Excel.

- **Today**: what to do today, room by room. Tick each duty when it is done.
- **Week**: report of the week, done, missed and still open, plus messages from the helper.
- **All duties**: the full list with products, tools and notes.

The days come from the boxes in the duty list: a duty is done once in each box (every day, Mon or Tue, Mon to Wed, any day this week, once a month).

Ticks are saved in `log/YYYY-MM.json` on the `log` branch, so saving never rebuilds the site. Only the helper's phone needs a GitHub key (fine-grained, this repo only, Contents: Read and write).

## Versions

Every change is released with a version number, shown at the bottom of the app with a **Check for update** button and a **What's new** list.

```
node tools/release.mjs minor "What changed, in plain words"
```

Use `patch` for a fix or a duty edit, `minor` for something new on screen, `major` for a rework. The script updates `index.html`, `version.json` and `changelog.json` together. Installed apps pick up the new version the next time they open, or show an **Update now** bar if they are already open.
