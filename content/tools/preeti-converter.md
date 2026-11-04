+++
title = "Unicode ⇄ Preeti Converter"
description = "Convert Nepali Unicode text to Preeti font text, and Preeti back to Unicode. Works as you type."
layout = "tool"
tool = "preeti"
scripts = ["vendor/preeti"]
weight = 13
group = "Nepali"
icon = "✍️"
hideMeta = true
ShowToc = false
comments = false
+++

### Notes

- Conversion is done by the open-source [@lacspace/preeti](https://github.com/lacspace/npm-packages/tree/main/preeti) library (v1.1.0, Lacspace Free Licence 1.0; its licence text is kept with the code). It handles the tricky parts of Preeti: the short *i* sign that is typed before its letter, the *reph*, half letters and conjuncts.
- **How it was tested:** 122 sentences of Nepali from this site were converted to Preeti and back and came out identical every time, and a second, independent converter agreed (apart from writing one vowel sign as two characters that look the same on screen). Even so, please read over important documents after converting.
- The Preeti font itself is not included. Without it installed, Preeti text looks like Latin letters (for example `g]kfn`); paste it into a document set in the Preeti font to see Nepali.
- If Preeti text has English words mixed in, tick **Text mixes English and Preeti** before converting.
