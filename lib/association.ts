export const ASSOCIATION_SHORT_NAME = "AAAH!";
export const ASSOCIATION_NAME = "Association des Auteur·ices Autour et en Hérault";
export const FOUNDING_YEAR = 2024;
export const SAJ_URL = "https://societedesauteursdejeux.fr/";

/**
 * Season of the association: 1 the founding year, 3 in 2026.
 */
export const associationSeason = () => new Date().getFullYear() - FOUNDING_YEAR + 1;

// Membership campaign: the URL contains the year, update it every year.
export const HELLOASSO_URL = "https://www.helloasso.com/associations/association-des-auteur-rice-s-autour-et-en-herault/adhesions/adhesion-et-cotisation-annuelle-2026";

// Places of the recurring events (Google Maps links).
export const PLACES = {
  baraka: { name: "Baraka Jeux", url: "https://maps.app.goo.gl/4uGxrnA3tru8WY8g8" },
  castors: { name: "Les Castors", url: "https://maps.app.goo.gl/bPvJifJEFo7Jvkwm9" },
};
