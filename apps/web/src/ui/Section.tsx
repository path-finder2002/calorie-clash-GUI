import { Box, Heading, Stack, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type SectionProps = BoxProps & {
  title?: string;
  description?: ReactNode;
};

export default function Section({ title, description, children, ...rest }: SectionProps) {
  return (
    <Box as="section" {...rest}>
      <Stack gap={3}>
        {(title || description) && (
          <Stack gap={1}>
            {title && (
              <Heading as="h3" size={{ base: "sm", md: "md" }}>
                {title}
              </Heading>
            )}
            {description && (
              <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
                {description}
              </Text>
            )}
          </Stack>
        )}
        <Box>{children}</Box>
      </Stack>
    </Box>
  );
}

