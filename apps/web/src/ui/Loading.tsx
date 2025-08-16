import { Center, Spinner, Stack, Text } from "@chakra-ui/react";

type LoadingProps = { label?: string };

export default function Loading({ label = "読み込み中..." }: LoadingProps) {
  return (
    <Center py={12}>
      <Stack align="center" gap={3}>
        <Spinner size="xl" />
        <Text color="fg.muted">{label}</Text>
      </Stack>
    </Center>
  );
}

