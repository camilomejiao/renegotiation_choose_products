import styled from "@emotion/styled";

export const StepperContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${({ $stepsCount }) => Math.max($stepsCount, 1)}, minmax(0, 1fr));
  align-items: start;
  gap: 16px;

  @media (max-width: 640px) {
    gap: 12px;
  }
`;

export const StepperRail = styled.div`
  position: absolute;
  top: 14px;
  left: calc(100% / 6);
  right: calc(100% / 6);
  height: 2px;
  background: rgba(21, 40, 84, 0.12);
  z-index: 0;

  @media (max-width: 640px) {
    left: calc(100% / 5.2);
    right: calc(100% / 5.2);
  }
`;

export const StepperTrack = styled.div`
  width: ${({ $progress }) => `${Math.max(Math.min($progress, 1), 0) * 100}%`};
  height: 100%;
  background: linear-gradient(90deg, #163f8c 0%, #245bbf 100%);
  transition: width 180ms ease;
`;

export const StepperItem = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 0;
  text-align: center;
`;

export const StepperNode = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease;
  background: ${({ $isActive, $isCompleted }) =>
    $isActive || $isCompleted ? "#163f8c" : "#eef2f8"};
  color: ${({ $isActive, $isCompleted }) =>
    $isActive || $isCompleted ? "#ffffff" : "#95a0b8"};
  box-shadow: ${({ $isActive }) =>
    $isActive ? "0 10px 24px rgba(22, 63, 140, 0.28)" : "none"};
`;

export const StepperLabel = styled.span`
  color: ${({ $isActive }) => ($isActive ? "#163f8c" : "#98a2b3")};
  font-size: 0.95rem;
  font-weight: ${({ $isActive }) => ($isActive ? 700 : 500)};
  line-height: 1.3;
  max-width: 160px;

  @media (max-width: 640px) {
    font-size: 0.82rem;
  }
`;
