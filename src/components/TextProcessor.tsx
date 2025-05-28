import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Text,
  useToast,
  Container,
  Spinner,
} from "@chakra-ui/react";

interface ProcessResponse {
  result: string;
  timestamp: string;
}

export default function TextProcessor() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // POST 요청 결과를 처리하는 useEffect
  useEffect(() => {
    if (result) {
      toast({
        title: "처리 완료",
        description: "텍스트 처리가 완료되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [result, toast]);

  // 에러 처리를 위한 useEffect
  useEffect(() => {
    if (error) {
      toast({
        title: "처리 실패",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim()) {
      toast({
        title: "입력 오류",
        description: "텍스트를 입력해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("http://your-api-endpoint/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold">
            텍스트 처리
          </Text>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>처리할 텍스트</FormLabel>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="처리할 텍스트를 입력하세요..."
                  size="lg"
                  minH="200px"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={isProcessing}
                loadingText="처리 중..."
              >
                처리하기
              </Button>
            </VStack>
          </form>

          {result && (
            <Box w="100%" p={4} borderWidth={1} borderRadius={4}>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">처리 결과:</Text>
                <Text>{result.result}</Text>
                <Text fontSize="sm" color="gray.500">
                  처리 시간: {result.timestamp}
                </Text>
              </VStack>
            </Box>
          )}

          {isProcessing && (
            <Box textAlign="center" w="100%">
              <Spinner size="xl" />
              <Text mt={2}>처리 중입니다...</Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Container>
  );
}
