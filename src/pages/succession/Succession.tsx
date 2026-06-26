import { useState } from 'react';
import StepAyantsDroit from './StepAyantsDroit';
import StepDonations from './StepDonations';
import StepAssurancesVie from './StepAssurancesVie';
import StepPatrimoine from './StepPatrimoine';
import StepSynthese from './StepSynthese';
import StepCalculDroits from './StepCalculDroits';

const steps = ['Ayants droit', 'Donations', 'Assurances-vie', 'Patrimoine', 'Synthèse', 'Calcul des droits'];

export default function Succession() {
    const [currentStep, setCurrentStep] = useState(0);
    const handleNext = () => {
        setCurrentStep((previous) => (previous < steps.length - 1 ? previous + 1 : previous));
    };

    const handlePrevious = () => {
        setCurrentStep((previous) => (previous > 0 ? previous - 1 : previous));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StepAyantsDroit />;
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
                    <button key={step} type="button" disabled={index > currentStep}>
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
