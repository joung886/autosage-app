// TextSummary.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Textarea,
  VStack,
  useToast,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import SummaryResult from "./SummaryResult";
import { SummaryService } from "../services/summaryService";

interface ChangeEvent {
  target: {
    value: string;
  };
}

export default function TextSummary() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<{
    originalText: string;
    summarizedText: string;
    timestamp: string;
  } | null>(null);

  const { currentUser } = useAuth();
  const toast = useToast();

  // 반응형 스타일 설정
  const containerPadding = useBreakpointValue({ base: 4, md: 8 });
  const textareaHeight = useBreakpointValue({ base: "150px", md: "200px" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  const handleSubmit = async () => {
    if (!currentUser?.uid) {
      toast({
        title: "인증 필요",
        description: "이 기능을 사용하려면 로그인이 필요합니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top", // 모바일에서 더 잘 보이는 위치
      });
      return;
    }

    if (!inputText.trim()) {
      toast({
        title: "입력 오류",
        description: "텍스트를 입력해주세요.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);

      // 실제 요약 처리
      const summaryText = await SummaryService.summarizeText(inputText);
      const timestamp = new Date().toISOString();

      // UI 업데이트
      setSummaryResult({
        originalText: inputText,
        summarizedText: summaryText,
        timestamp: timestamp,
      });

      toast({
        title: "요약 완료",
        description: "텍스트가 성공적으로 요약되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("요약 실패:", error);
      toast({
        title: "요약 실패",
        description: "텍스트 요약 중 오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={containerPadding}>
      <VStack spacing={4}>
        <Box w="100%" position="relative">
          <Text mb={2} fontSize={{ base: "sm", md: "md" }} color="gray.600">
            요약할 텍스트를 입력하세요
          </Text>
          <Textarea
            value={inputText}
            onChange={(e: ChangeEvent) => setInputText(e.target.value)}
            placeholder="여기에 텍스트를 입력하세요..."
            size="md"
            minH={textareaHeight}
            fontSize={{ base: "sm", md: "md" }}
            p={3}
            resize="vertical"
            borderRadius="md"
            _focus={{
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
            }}
          />
          <Text
            position="absolute"
            bottom={2}
            right={2}
            fontSize="xs"
            color="gray.500"
          >
            {inputText.length} / 1000
          </Text>
        </Box>

        <Button
          colorScheme="blue"
          size={buttonSize}
          width="100%"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="요약 중..."
          fontSize={{ base: "sm", md: "md" }}
          h={{ base: "40px", md: "48px" }}
        >
          텍스트 요약하기
        </Button>

        {summaryResult && (
          <SummaryResult
            originalText={summaryResult.originalText}
            summarizedText={summaryResult.summarizedText}
            timestamp={summaryResult.timestamp}
          />
        )}
      </VStack>
    </Container>
  );
}
