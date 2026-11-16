# Helper Duties

Daily checklist for our helper, built from the duty list in Excel.

- **Today**: what to do today, room by room. Tick each duty when it is done.
- **Week**: report of the week, done, missed and still open, plus messages from the helper.
- **All duties**: the full list with products, tools and notes.

The days come from the boxes in the duty list: a duty is done once in each box (every day, Mon or Tue, Mon to Wed, any day this week, once a month).

Ticks are saved in `log/YYYY-MM.json` on the `log` branch, so saving never rebuilds the site. Only the helper's phone needs a GitHub key (fine-grained, this repo only, Contents: Read and write).

Run `sh tools/bump-version.sh` before each change so installed apps reload.
