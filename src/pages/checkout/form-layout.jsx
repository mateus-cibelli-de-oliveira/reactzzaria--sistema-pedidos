import styled from "styled-components";

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
`;

export const FlexItem = styled.div`
  flex: ${({ grow = 1 }) => grow};
`;

export const CepContainer = styled.div`
  flex: 0 1 160px;
`;

export const FetchingCepInfo = styled.span`
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-size: 0.875rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.palette.text.secondary};
`;
