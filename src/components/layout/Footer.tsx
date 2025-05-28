import { Box, Container, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" bg="gray.100" py={4}>
      <Container maxW="container.lg">
        <Text textAlign="center" color="gray.600">
          © {new Date().getFullYear()} 텍스트 요약 서비스. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
}
