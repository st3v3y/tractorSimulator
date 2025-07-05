import styled from "styled-components";

const StyledButton = styled.button.attrs({
  className:
    'px-4 py-2 rounded-md border-none font-medium transition-all duration-200 cursor-pointer text-white bg-green-500 hover:bg-green-600 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed',
})``;

export function Button({ children, ...rest }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return(
    <StyledButton {...rest}>
      {children}
    </StyledButton>
  );
}