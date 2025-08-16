import { Box, Heading, Stack, Text, type BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type CardProps = BoxProps & { title?: string; subtitle?: string; footer?: ReactNode };

export function Card({ title, subtitle, footer, children, ...rest }: CardProps) {
  return (
    <Box
      bg="bg"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      p={{ base: 4, md: 6 }}
      shadow="sm"
      {...rest}
    >
      <Stack gap={3}>
        {(title || subtitle) && (
          <Stack gap={1}>
            {title && (
              <Heading as="h3" size={{ base: "md", md: "lg" }}>
                {title}
              </Heading>
            )}
            {subtitle && (
              <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
                {subtitle}
              </Text>
            )}
          </Stack>
        )}
        <Box>{children}</Box>
        {footer && <Box pt={2}>{footer}</Box>}
      </Stack>
    </Box>
  );
}

