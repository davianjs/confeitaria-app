import styled from 'vue3-styled-components';

const buttonProps = {
  variant: String,
  size: String,
  fullWidth: Boolean
};

export const Button = styled('button', buttonProps)`
  padding: ${(props: any) => props.size === 'sm' ? '0.4rem 0.75rem' : props.size === 'lg' ? '0.75rem 1.25rem' : '0.5rem 1rem'};
  font-size: ${(props: any) => props.size === 'sm' ? '0.8125rem' : props.size === 'lg' ? '1rem' : '0.875rem'};
  font-weight: 600;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  width: ${(props: any) => props.fullWidth ? '100%' : 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;

  background-color: ${(props: any) => {
    if (props.variant === 'secondary') return '#6b7280';
    if (props.variant === 'danger') return '#dc2626';
    if (props.variant === 'success') return '#059669';
    return '#ef4444';
  }};
  
  color: white;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .material-symbols-outlined {
    font-size: ${(props: any) => props.size === 'sm' ? '1.125rem' : '1.25rem'};
  }
`;

const inputProps = {
  hasError: Boolean
};

export const Input = styled('input', inputProps)`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 2px solid ${(props: any) => props.hasError ? '#dc2626' : '#e5e7eb'};
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: ${(props: any) => props.hasError ? '#dc2626' : '#ef4444'};
    box-shadow: 0 0 0 3px ${(props: any) => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Select = styled('select', inputProps)`
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 2px solid ${(props: any) => props.hasError ? '#dc2626' : '#e5e7eb'};
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
  background-color: white;
  cursor: pointer;

  &:focus {
    border-color: ${(props: any) => props.hasError ? '#dc2626' : '#ef4444'};
    box-shadow: 0 0 0 3px ${(props: any) => props.hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

export const ErrorText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #dc2626;
  margin-top: 0.25rem;
`;

const badgeProps = {
  variant: String
};

export const Badge = styled('span', badgeProps)`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${(props: any) => {
    if (props.variant === 'success') return '#d1fae5';
    if (props.variant === 'warning') return '#fef3c7';
    if (props.variant === 'danger') return '#fee2e2';
    return '#e5e7eb';
  }};
  color: ${(props: any) => {
    if (props.variant === 'success') return '#065f46';
    if (props.variant === 'warning') return '#92400e';
    if (props.variant === 'danger') return '#991b1b';
    return '#374151';
  }};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

export const Th = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
`;

export const Td = styled.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin: 0 auto;
`;
