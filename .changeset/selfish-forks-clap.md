---
"@sproutsocial/seeds-icons": minor
---

Replaced SVGs with versions that fill the viewBox
- Previously, all SVGs in the package had a 24x24 viewBox despite the graphic usually being about 18x18, leading to unintended margins
- New versions have been added that include accurate viewBoxes that hug the content on each side