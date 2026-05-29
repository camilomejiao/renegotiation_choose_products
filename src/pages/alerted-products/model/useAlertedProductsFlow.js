import { useState } from "react";

const initialAssignment = {
  selectedRowKeys: [],
  selectedRows: [],
  managementType: "",
};

export const useAlertedProductsFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [assignment, setAssignment] = useState(initialAssignment);

  const handleRaiseAlert = (nextAssignment) => {
    setAssignment({
      selectedRowKeys: nextAssignment?.selectedRowKeys || [],
      selectedRows: nextAssignment?.selectedRows || [],
      managementType: nextAssignment?.managementType || "",
    });
    setCurrentStep(1);
  };

  const goToPreparation = () => {
    setCurrentStep(0);
  };

  const goToCentralization = () => {
    setCurrentStep(2);
  };

  const goToManagement = () => {
    setCurrentStep(1);
  };

  return {
    assignment,
    currentStep,
    goToCentralization,
    goToManagement,
    goToPreparation,
    handleRaiseAlert,
  };
};
