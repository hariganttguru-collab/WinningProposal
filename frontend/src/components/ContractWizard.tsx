import { useContract } from '../context/ContractContext';
import WBSForm from './WBSForm';
import EffortForm from './EffortForm';
import ResourcePlanningForm from './ResourcePlanningForm';
import ResourceCostForm from './ResourceCostForm';
import ProjectManagementForm from './ProjectManagementForm';
import HeuristicForm from './HeuristicForm';
import OnsiteForm from './OnsiteForm';
import SubContractForm from './SubContractForm';
import RiskContingencyForm from './RiskContingencyForm';
import InfrastructureForm from './InfrastructureForm';
import OverheadProfitForm from './OverheadProfitForm';
import FinancingChargesForm from './FinancingChargesForm';
import ProfitForm from './ProfitForm';
import FinalBidSummaryForm from './FinalBidSummaryForm';

export default function ContractWizard() {
    const { currentStep, validateCurrentStep, goToNextStep, goToPreviousStep } = useContract();

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return <WBSForm />;
            case 2:
                return <EffortForm />;
            case 3:
                return <ResourcePlanningForm />;
            case 4:
                return <ResourceCostForm />;
            case 5:
                return <ProjectManagementForm />;
            case 6:
                return <HeuristicForm />;
            case 7:
                return <OnsiteForm />;
            case 8:
                return <SubContractForm />;
            case 9:
                return <RiskContingencyForm />;
            case 10:
                return <InfrastructureForm />;
            case 11:
                return <OverheadProfitForm />;
            case 12:
                return <FinancingChargesForm />;
            case 13:
                return <ProfitForm />;
            case 14:
                return <FinalBidSummaryForm />;
            default:
                return <WBSForm />;
        }
    };

    const isValid = validateCurrentStep();

    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Current Step Content */}
            <div style={{ flex: 1 }}>
                {renderCurrentStep()}
            </div>

            {/* Navigation Buttons */}
            {currentStep < 14 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '40px',
                    padding: '20px 0',
                    borderTop: '2px solid #334155'
                }}>
                    <button
                        onClick={goToPreviousStep}
                        disabled={currentStep === 1}
                        style={{
                            padding: '14px 32px',
                            backgroundColor: currentStep === 1 ? '#475569' : '#1e293b',
                            color: '#e2e8f0',
                            border: '2px solid #475569',
                            borderRadius: '8px',
                            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            opacity: currentStep === 1 ? 0.5 : 1,
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            if (currentStep > 1) {
                                e.currentTarget.style.backgroundColor = '#334155';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (currentStep > 1) {
                                e.currentTarget.style.backgroundColor = '#1e293b';
                            }
                        }}
                    >
                        ← Previous Step
                    </button>

                    <div style={{
                        fontSize: '14px',
                        color: '#94a3b8',
                        textAlign: 'center'
                    }}>
                        {!isValid && (
                            <span style={{ color: '#ef4444' }}>
                                ⚠ Please complete all required fields to continue
                            </span>
                        )}
                    </div>

                    <button
                        onClick={goToNextStep}
                        disabled={!isValid}
                        style={{
                            padding: '14px 32px',
                            backgroundColor: isValid ? '#10b981' : '#475569',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isValid ? 'pointer' : 'not-allowed',
                            fontSize: '16px',
                            fontWeight: '600',
                            opacity: isValid ? 1 : 0.5,
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={(e) => {
                            if (isValid) {
                                e.currentTarget.style.backgroundColor = '#059669';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (isValid) {
                                e.currentTarget.style.backgroundColor = '#10b981';
                            }
                        }}
                    >
                        Next Step →
                    </button>
                </div>
            )}
        </div>
    );
}
