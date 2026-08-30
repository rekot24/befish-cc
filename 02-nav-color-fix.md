# Checklist: Nav Color Fix

Small targeted fix — nav/footer colors and logo colors.
No structural changes, CSS only.

---

## 1. Update `src/app/globals.css`

### 1a. Fix `--nav-bg` and `--footer-bg` in `[data-theme="light"]`

Find the `[data-theme="light"]` block and update these two lines:

```css
--nav-bg: #0d1f3c;
--footer-bg: #0d1f3c;
```

Dark mode values (already in `:root`):
```css
--nav-bg: #04080f;
--footer-bg: #04080f;
```

The nav and footer are always a dark color in both themes — they never
go light. In dark mode they are near-black navy. In light mode they are
a lighter navy blue (`#0d1f3c`), matching the current live site's look.
Only the page body (`--page-bg`) goes light in light mode.

---

## 2. Update `src/components/Nav/Nav.module.css`

### 2a. Fix logo "Be Fish" color

Find the `.logo` rule and ensure the base color is orange, not white:

```css
.logo {
  color: var(--color-orange);   /* "Be Fish" in orange */
}
```

The `span` inside the logo (which wraps "Wiki") stays cyan:
```css
.logo span {
  color: var(--color-cyan);
}
```

### 2b. Fix active link color — change from cyan to orange

Find `.linkActive` and update:

```css
.linkActive {
  color: var(--color-orange);
}

.linkActive:hover {
  color: var(--color-orange);
}
```

### 2c. Fix theme toggle border on hover — change from cyan to orange

Find `.themeToggle:hover` and update:

```css
.themeToggle:hover {
  color: var(--text-hi);
  border-color: var(--color-orange);
}
```

---

## 3. Verify

- Open `http://localhost:3000`
- Dark mode: "Be Fish" orange, "Wiki" cyan, nav dark navy
- Light mode: nav/footer are lighter navy (`#0d1f3c`), page body is light blue-white
- Click each nav link — active link should highlight orange
- Theme toggle border should glow orange on hover

---

## 4. Commit and push

```
git add .
git commit -m "fix nav colors: orange logo and active state, nav stays dark in both themes"
git push
```

---

## Implementation Notes

- Step 1 (`--nav-bg`/`--footer-bg` in `[data-theme="light"]`) was already
  `#0d1f3c` from the previous checklist — no change needed.
- Applied 2a–2c in `Nav.module.css`: `.logo` base color → orange, `.linkActive`
  (+ hover) → orange, `.themeToggle:hover` border → orange. CSS-only, no
  markup/logic changes.
- `tsc --noEmit` and `eslint src` both clean. No bugs found.
