import { useState, type ChangeEvent, type FormEvent } from 'react';
import { type Heir, type HeirShares } from '../../types/succession';
import { RELATIONSHIP_TYPE_LIST, type RelationshipValue } from '../../types/relationshipType';
import { addFractions, formatFraction, getMissingFraction, parseFraction, type Fraction } from '../../utils/fractions';

type StepAyantsDroitProps = {
    initialHeirs: Heir[];
    onSave: (heirs: Heir[]) => void;
};

type HeirFormData = Omit<Heir, 'id' | 'relationship'> & {
    relationship: RelationshipValue | '';
};

const emptyShares: HeirShares = {
    pleinePropriete: '',
    nuePropriete: '',
    usufruit: '',
};

const emptyHeirFormData: HeirFormData = {
    name: '',
    relationship: '',
    shares: emptyShares,
};

export default function StepAyantsDroit({ initialHeirs, onSave }: StepAyantsDroitProps) {
    const [heirs, setHeirs] = useState<Heir[]>(initialHeirs);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<HeirFormData>(emptyHeirFormData);

    const handleOpenForm = (heir?: Heir) => {
        setEditingId(heir?.id ?? null);
        setFormData(
            heir
                ? { name: heir.name, relationship: heir.relationship, shares: heir.shares }
                : emptyHeirFormData
        );
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        const nextHeirs = heirs.filter((heir) => heir.id !== id);
        setHeirs(nextHeirs);
        onSave(nextHeirs);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;

        if (name === 'pleinePropriete' || name === 'nuePropriete' || name === 'usufruit') {
            setFormData((previous) => ({
                ...previous,
                shares: {
                    ...previous.shares,
                    [name]: value,
                },
            }));
            return;
        }

        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.relationship) {
            return;
        }

        const nextHeirs =
            editingId === null
                ? [...heirs, { id: crypto.randomUUID(), ...formData, relationship: formData.relationship }]
                : heirs.map((heir) =>
                    (heir.id === editingId ? { id: heir.id, ...formData, relationship: formData.relationship } : heir)
                );

        setHeirs(nextHeirs);
        onSave(nextHeirs);
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(emptyHeirFormData);
    };

    const totalPleinePropriete = heirs.reduce((total, heir) => {
        const parsed = parseFraction(heir.shares.pleinePropriete);
        if (!parsed) {
            return total;
        }

        return total ? addFractions(total, parsed) : parsed;
    }, null as Fraction | null);

    const missingFraction = getMissingFraction(totalPleinePropriete);

    return (
        <div>
            <button type="button" onClick={() => handleOpenForm()}>
                Ajouter un ayant droit
            </button>

            {isFormOpen && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>
                            Nom
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Lien de parenté
                            <select
                                name="relationship"
                                value={formData.relationship}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Sélectionner</option>
                                {RELATIONSHIP_TYPE_LIST.map((relationshipType) => (
                                    <option key={relationshipType.value} value={relationshipType.value}>
                                        {relationshipType.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            Quote-part — Pleine propriété
                            <input
                                name="pleinePropriete"
                                value={formData.shares.pleinePropriete}
                                onChange={handleChange}
                                placeholder="1/2"
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Quote-part — Nue-propriété
                            <input
                                name="nuePropriete"
                                value={formData.shares.nuePropriete}
                                onChange={handleChange}
                                placeholder="1/2"
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Quote-part — Usufruit
                            <input
                                name="usufruit"
                                value={formData.shares.usufruit}
                                onChange={handleChange}
                                placeholder="1/2"
                            />
                        </label>
                    </div>
                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={() => setIsFormOpen(false)}>
                        Annuler
                    </button>
                </form>
            )}

            <div>
                {heirs.length === 0 ? (
                    <p>Aucun ayant droit enregistré</p>
                ) : (
                    <div>
                        <div>
                            <strong>Total pleine propriété :</strong> {totalPleinePropriete ? formatFraction(totalPleinePropriete) : '—'}
                        </div>
                        {missingFraction && (
                            <div>
                                Fraction manquante : {formatFraction(missingFraction)}
                            </div>
                        )}
                        <ul>
                            {heirs.map((heir) => (
                                <li key={heir.id}>
                                    <span>
                                        {heir.name} — {heir.relationship} — PP: {heir.shares.pleinePropriete || '—'} / NP: {heir.shares.nuePropriete || '—'} / U: {heir.shares.usufruit || '—'}
                                    </span>
                                    <button type="button" onClick={() => handleOpenForm(heir)}>
                                        Modifier
                                    </button>
                                    <button type="button" onClick={() => handleDelete(heir.id)}>
                                        Supprimer
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}