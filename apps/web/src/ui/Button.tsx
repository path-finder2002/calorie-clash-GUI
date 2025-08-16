import { Button, type ButtonProps } from "@chakra-ui/react";

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="solid" colorPalette="teal" size="lg" {...props} />;
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="surface" colorPalette="gray" size="lg" {...props} />;
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" size="lg" {...props} />;
}

export function DangerButton(props: ButtonProps) {
  return <Button variant="solid" colorPalette="red" size="lg" {...props} />;
}

