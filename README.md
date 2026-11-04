# M2E École Polytechnique — site institutionnel

Site statique HTML / CSS / JS (aucun framework, aucune étape de build), prêt pour GitHub → Cloudflare Pages.
Réglages Cloudflare Pages : *Framework preset* = None, *Build command* = vide, *Output directory* = `/`.

## Pages
- `index.html` — Accueil
- `filieres.html` — 5 filières (présentation, compétences, débouchés, admission)
- `admissions.html` — conditions, documents, procédure, formulaire de candidature, FAQ
- `formation-professionnelle.html` — formats, catalogue, demande de formation
- `partenariats.html` — types de partenariat, opportunités, formulaire
- `actualites.html` — articles, événements, vie étudiante, communiqués, galerie
- `contact.html` — coordonnées, formulaire, carte Google Maps, WhatsApp
- `espace-etudiant.html` — page « bientôt disponible » (emplacement prévu pour l'espace étudiant)
- `404.html`, `sitemap.xml`, `robots.txt`, `_headers`

## Formulaires
Par défaut, chaque formulaire valide les champs puis ouvre WhatsApp (+235 66 37 35 67) avec le message pré-rempli,
avec un bouton pour envoyer la même demande par e-mail.
Pour recevoir les demandes directement par e-mail : créer un formulaire Formspree (ou équivalent) et coller son URL
dans `FORM_ENDPOINT` en haut de `assets/js/main.js`.

## À compléter par l'école
- Témoignages réels d'étudiants (section Accueil)
- Logos des partenaires officiels (page Partenariats)
- Séries de bac acceptées, durée des cursus, diplômes délivrés, frais
- Liste officielle des documents d'inscription
- Liens exacts des réseaux sociaux (pied de page) — handle utilisé : @m2eecolepolytechnique
