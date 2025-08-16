import { Box, HStack, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { GhostButton } from "./Button";

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

export default function PageHeader({ title, onBack, right }: PageHeaderProps) {
  return (
    <Box as="header" py={{ base: 2, md: 3 }}>
      <HStack justify="space-between" align="center">
        <HStack gap={2}>
          {onBack && (
            <GhostButton onClick={onBack} aria-label="戻る">
              ←
            </GhostButton>
          )}
          <Heading as="h2" size={{ base: "md", md: "lg" }}>
            {title}
          </Heading>
        </HStack>
        {right}
      </HStack>
    </Box>
  );
}

