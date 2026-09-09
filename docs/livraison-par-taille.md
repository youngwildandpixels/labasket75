# Livraison par taille

Le champ Shopify de variante `custom.delivery_24_48h` (booléen, « Livraison 24–48 h ») pilote les pills et le texte de livraison de la fiche produit.

Dans Shopify : Produits → produit → variante / taille → Champs méta → Livraison 24–48 h → Oui → Enregistrer.

- Oui : 24–48 h ouvrées.
- Non ou champ vide : 5 à 12 jours ouvrés.
- Le stock, le prix, le verrouillage dans Scrap My Sneakers et les tags du produit ne déterminent pas ce délai.
- Le champ est manuel et indépendant de Scrap My Sneakers. Une mise à jour du prix ne change pas la logique du thème ; la conservation du champ en cas de recréation de variantes par l’application n’a pas été vérifiée.
- Les règles de disponibilité et d’achat restent celles du thème existant.
- Les tarifs et délais du checkout ne sont pas modifiés.

Définition créée et épinglée : gid://shopify/MetafieldDefinition/1486194409849.
Aucune valeur activée en production. Champ vide traité comme Non, sans écriture en masse.

## Validation et déploiement

Theme Check : aucune erreur ni avertissement. Validation Liquid : réussie.
Tests Liquid + DOM : états Oui / Non / vide, stock zéro, 15 changements de taille, pills, points, accessibilité de l’infobulle, texte de livraison, variante du formulaire et URL.

Thème d’aperçu : 198736937337, « Apercu livraison par taille ».
Fichiers envoyés : sections/main-product.liquid et locales/fr.default.json.
Un éclair remplace le point des tailles dont le champ est Oui, avec couleur héritée de la case et libellé accessible.
Le fichier local avant modification était identique à la version live téléchargée.

Mise en ligne en attente de contrôle visuel de l’aperçu conformément à CLAUDE.md. Aucun navigateur CUA disponible pendant cette session. Le contrôle HTTP de l’aperçu reste bloqué par la page de mot de passe.

Une fois l’aperçu validé, vérifier à nouveau que la version live n’a pas changé, exécuter Theme Check, puis envoyer uniquement sections/main-product.liquid au thème 197301862777. Supprimer l’aperçu après validation en ligne.

## Badge des cartes produit

Sur l’image de la carte, un seul badge sur deux lignes : « ⚡ 24–48 h » / « sur certaines tailles ». Affiché dès qu’une variante a custom.delivery_24_48h = Oui, sans condition de stock. Aucun badge si toutes les valeurs sont Non ou vides. Les anciens tags de livraison ne déclenchent plus le badge. Fichiers supplémentaires sur l’aperçu : snippets/delivery-badge.liquid, snippets/product-card.liquid, assets/base.css et locales/fr.default.json.
