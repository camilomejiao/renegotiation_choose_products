import styled from "@emotion/styled";
import { Button } from "antd";

export const HomologationSearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-items: end;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchButton = styled(Button)`
  && {
    height: 40px;
    border-radius: 10px;
    font-weight: 700;
    box-shadow: none;
    background: #1d4ed8;
    border-color: #1d4ed8;
    color: #ffffff;
  }

  &&:hover,
  &&:focus {
    background: #1e40af !important;
    border-color: #1e40af !important;
    color: #ffffff !important;
  }
`;