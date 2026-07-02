/**
 * Contexte transmis à chaque règle d'abattement.
 *
 * On passe un objet plutôt que des paramètres positionnels : le jour où une
 * règle plus complexe a besoin d'une donnée supplémentaire (montant
 * transmis, donations des 15 dernières années, situation de handicap...),
 * on l'ajoute ici sans casser la signature des règles déjà écrites.
 *
 * Volontairement indépendant de `Heir` : ce fichier ne doit rien importer de
 * `succession.ts`, puisque c'est `succession.ts` qui importe `RelationshipValue`
 * d'ici pour typer `Heir.relationship`. Si `AbattementContext` référençait
 * `Heir` en retour, les deux fichiers s'importeraient mutuellement.
 */
export interface AbattementContext {
    relationshipValue: RelationshipValue;
    // Étendre ici avec des données primitives, ex: donationsAnterieures?: number; patrimoineTransmis?: number;
}

/**
 * Une règle d'abattement : reçoit un contexte, retourne un montant en euros.
 * Un montant fixe est simplement une fonction qui ignore le contexte.
 */
export type AbattementRule = (context: AbattementContext) => number;

/**
 * Identifiant stable de chaque type de lien de parenté.
 * C'est cette valeur (et non le libellé affiché) qui doit être persistée
 * sur un ayant droit, pour pouvoir renommer un libellé sans jamais casser
 * les données déjà enregistrées.
 */
export type RelationshipValue =
    | 'CONJOINT'
    | 'PACS'
    | 'ENFANT'
    | 'PETIT_ENFANT'
    | 'FRERE_SOEUR'
    | 'NEVEU_NIECE'
    | 'PERE_MERE'
    | 'PARENT_JUSQUAU_4E_DEGRE'
    | 'PARENT_AU_DELA_4E_DEGRE_OU_TIERS'
    | 'ASSOCIATION_EXONEREE';

export interface RelationshipType {
    readonly value: RelationshipValue;
    readonly label: string;
    readonly abattementRule: AbattementRule;
}

/**
 * Petite factory pour garder l'ergonomie d'un "constructeur" (value, label,
 * règle) sans passer par une classe : on obtient un objet simple, facile à
 * cloner et à mocker dans les tests.
 */
function createRelationshipType(
    value: RelationshipValue,
    label: string,
    abattementRule: AbattementRule
): RelationshipType {
    return { value, label, abattementRule };
}

// Placeholder en attendant la vraie règle de chaque type (hors scope ici).
// On fait volontairement exploser plutôt que retourner 0, pour ne jamais
// afficher un abattement silencieusement faux tant que la règle réelle
// n'a pas été écrite.
const abattementNonDefini: AbattementRule = () => {
    throw new Error("Règle d'abattement non définie pour ce type de lien de parenté");
};

/**
 * Catalogue unique des types de lien de parenté.
 *
 * `satisfies Record<RelationshipValue, RelationshipType>` garantit, à la
 * compilation, qu'il existe une entrée pour CHAQUE valeur de
 * `RelationshipValue`. Si vous ajoutez un nouveau type de lien de parenté
 * dans l'union ci-dessus sans l'ajouter ici, TypeScript refuse de compiler :
 * impossible d'oublier de définir sa règle d'abattement.
 */
export const RELATIONSHIP_TYPES = {
    CONJOINT: createRelationshipType('CONJOINT', 'Conjoint survivant', abattementNonDefini),
    PACS: createRelationshipType('PACS', 'Partenaire de PACS', abattementNonDefini),
    ENFANT: createRelationshipType('ENFANT', 'Enfant', abattementNonDefini),
    PETIT_ENFANT: createRelationshipType('PETIT_ENFANT', 'Petit-enfant', abattementNonDefini),
    FRERE_SOEUR: createRelationshipType('FRERE_SOEUR', 'Frère/soeur', abattementNonDefini),
    NEVEU_NIECE: createRelationshipType('NEVEU_NIECE', 'Neveu/nièce', abattementNonDefini),
    PERE_MERE: createRelationshipType('PERE_MERE', 'Père/mère', abattementNonDefini),
    PARENT_JUSQUAU_4E_DEGRE: createRelationshipType(
        'PARENT_JUSQUAU_4E_DEGRE',
        "Parent jusqu'au 4ème degré",
        abattementNonDefini
    ),
    PARENT_AU_DELA_4E_DEGRE_OU_TIERS: createRelationshipType(
        'PARENT_AU_DELA_4E_DEGRE_OU_TIERS',
        'Parent au-delà du 4ème degré, tiers ou légataire',
        abattementNonDefini
    ),
    ASSOCIATION_EXONEREE: createRelationshipType(
        'ASSOCIATION_EXONEREE',
        'Association exonérée de droits',
        abattementNonDefini
    ),
} as const satisfies Record<RelationshipValue, RelationshipType>;

/** Pratique pour peupler un <select> à partir d'une seule source de vérité. */
export const RELATIONSHIP_TYPE_LIST: RelationshipType[] = Object.values(RELATIONSHIP_TYPES);

export function getRelationshipType(value: RelationshipValue): RelationshipType {
    return RELATIONSHIP_TYPES[value];
}

/** Point d'entrée unique pour calculer l'abattement d'un ayant droit. */
export function computeAbattement(
    relationshipValue: RelationshipValue,
    extraContext: Omit<AbattementContext, 'relationshipValue'> = {}
): number {
    const relationshipType = getRelationshipType(relationshipValue);
    return relationshipType.abattementRule({ relationshipValue, ...extraContext });
}
