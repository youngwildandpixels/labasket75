# Theme design system

Base globale pour harmoniser les pages du theme Labasket.

## Tokens

- `--surface-bg`: fond gris clair du site.
- `--surface-bg-pattern`: motif a points.
- `--surface-bg-size`: taille du motif.
- `--surface-card`: fond des blocs flottants.
- `--surface-gap`: ecart standard entre blocs.
- `--surface-radius`: radius des blocs flottants.
- `--surface-border`: contour standard des blocs.
- `--surface-shadow`: ombre douce des blocs.
- `--control-radius`: radius des inputs, selects, pagination, quick add.
- `--filter-radius`: radius des groupes de filtres.

## Classes

- `.surface-page`: applique le fond gris a points.
- `.surface-block`: bloc blanc flottant avec bordure, radius et shadow.
- `.surface-block--no-shadow`: retire le shadow sur un bloc.
- `.surface-grid`: grille avec gap standard.
- `.control-field`: style de base des champs.
- `.control-check`: controle rond.
- `.link-underline-hover`: underline anime au hover/actif.
- `.accordion-soft`: reveal doux des accordions `details`.

## Regle de migration

Quand une page est migree, garder le rendu existant puis remplacer les valeurs hardcodees par les tokens. Les changements visuels viennent ensuite, page par page.
