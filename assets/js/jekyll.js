---
---
const jekyll = {
  tags: Object.keys({{ site.tags | jsonify }})
}