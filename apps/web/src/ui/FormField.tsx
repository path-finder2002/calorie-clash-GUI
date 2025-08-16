import { Field } from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  label?: ReactNode;
  helperText?: ReactNode;
  errorText?: ReactNode;
  required?: boolean;
  children: ReactNode;
} & Omit<ComponentProps<typeof Field.Root>, "children">;

export default function FormField({ label, helperText, errorText, required, children, ...rest }: Props) {
  return (
    <Field.Root required={required} {...rest}>
      {label && <Field.Label>{label}</Field.Label>}
      {children}
      {helperText && <Field.HelperText>{helperText}</Field.HelperText>}
      {errorText && <Field.ErrorText>{errorText}</Field.ErrorText>}
    </Field.Root>
  );
}
