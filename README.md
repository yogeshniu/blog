# yogesh

Personal site: <https://yogeshsn.com.np>. Built with [Hugo](https://gohugo.io) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (a few small compatibility patches are applied inside `themes/PaperMod`).

## Where things live
| What | Where |
|---|---|
| Site settings, menu, home-page intro | `hugo.toml` |
| Posts | `content/posts/` |
| Reference notes | `content/references/` |
| About / CV page | `content/about.md` |
| Profile photo | `assets/ys.webp` |
| Images used inside posts | next to the post (`content/posts/<name>/index.md` + image) or `static/img/` |
| Colours, fonts, spacing | `assets/css/extended/custom.css` |
| Favicons and share image | `static/` |

## Run locally
    hugo server -D

## Deploy
Push to `main`. GitHub Actions (`.github/workflows/hugo.yaml`) builds and publishes the site.
In the repo: Settings → Pages → Source must be **GitHub Actions**.
