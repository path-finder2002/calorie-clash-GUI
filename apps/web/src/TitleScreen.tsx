import { Box, VStack, Heading, Button, Text } from "@chakra-ui/react";
export default function TitleScreen() {
  return (
    <Box minH="100dvh" bgGradient="radial(#1a2330 0%, #0b0f14 70%)"
         display="grid" placeItems="center" px="40px">
      <VStack spacing="48px">
        <Heading as="h1" size="3xl" textAlign="center" maxW="70vw"
                 letterSpacing="0.02em" textShadow="0 8px 24px rgba(0,0,0,0.35)">
          Calorie Clash
        </Heading>
        <VStack spacing="48px" w="360px">
          <Button size="lg" h="72px" w="360px" borderRadius="12px" colorScheme="teal">Start</Button>
          <Button size="lg" h="72px" w="360px" borderRadius="12px" variant="outline">Options</Button>
          <Button size="lg" h="72px" w="360px" borderRadius="12px" variant="ghost">Exit</Button>
        </VStack>
        <Text fontSize="sm" opacity={0.75} mt="24px">© 2025 Team CC — v0.1.0</Text>
      </VStack>
    </Box>
  );
}
