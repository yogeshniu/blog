# yogesh

Personal site: <https://yogeshsn.com.np>. Built with [Hugo](https://gohugo.io) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (a few small compatibility patches are applied inside `themes/PaperMod`).

## Where things live
| What | Where |
|---|---|
| Site settings, menu, home-page intro | `hugo.toml` |
| Blog posts | `content/blog/` |
| Notes (study notes, tutorials, resources) | `content/notes/` |
| About page text (CV) | `data/cv.yaml` (edit this one) |
| Profile photo | `assets/ys.webp` |
| Images used inside posts | next to the post (`content/posts/<name>/index.md` + image) or `static/img/` |
| Colours, fonts, spacing | `assets/css/extended/custom.css` (colours are at the top) |
| Tools (games, timers, calculators, Nepali tools) | `content/tools/` (pages) and `assets/js/tools/` (code). **Add one:** `python3 scripts/new-tool.py "Name"`, see `docs/ADDING-A-TOOL.md` |
| Tool categories | `data/tool_groups.yaml` |
| Favicons and share image | `static/` |

## Run locally
    hugo server -D

## Deploy
Push to `main`. GitHub Actions (`.github/workflows/hugo.yaml`) builds and publishes the site.
In the repo: Settings → Pages → Source must be **GitHub Actions**.
