import { Container, type ContainerProps } from "@chakra-ui/react";

export default function ScreenContainer(props: ContainerProps) {
  return (
    <Container maxW={{ base: "lg", md: "2xl" }} py={{ base: 6, md: 8 }} {...props} />
  );
}

