import { useState } from 'react';
import { type SuccessionData, type Heir } from '../../types/succession';
import StepAyantsDroit from './StepAyantsDroit';
import StepDonations from './StepDonations';
import StepAssurancesVie from './StepAssurancesVie';
import StepPatrimoine from './StepPatrimoine';
import StepSynthese from './StepSynthese';
import StepCalculDroits from './StepCalculDroits';

const steps = ['Ayants droit', 'Donations', 'Assurances-vie', 'Patrimoine', 'Synthèse', 'Calcul des droits'];

const initialSuccessionData: SuccessionData = {
    ayantsDroit: [],
};

export default function Succession() {
    const [currentStep, setCurrentStep] = useState(0);
    const [savedState, setSavedState] = useState<SuccessionData>(initialSuccessionData);

    const handleSaveAyantsDroit = (ayantsDroit: Heir[]) => {
        setSavedState((previous) => ({ ...previous, ayantsDroit }));
    };

    const goToStep = (nextStep: number) => {
        if (nextStep !== currentStep) {
            setCurrentStep(nextStep);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            goToStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepAyantsDroit initialHeirs={savedState.ayantsDroit} onSave={handleSaveAyantsDroit} />;
            case 1:
                return <StepDonations />;
            case 2:
                return <StepAssurancesVie />;
            case 3:
                return <StepPatrimoine />;
            case 4:
                return <StepSynthese />;
            case 5:
                return <StepCalculDroits />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div>
                {steps.map((step, index) => (
                    <button key={step} type="button" onClick={() => goToStep(index)}>
                        {step}
                    </button>
                ))}
            </div>

            {renderStep()}

            <div>
                <button type="button" onClick={handlePrevious}>
                    Précédent
                </button>
                <button type="button" onClick={handleNext}>
                    Suivant
                </button>
            </div>
        </div>
    );
}
