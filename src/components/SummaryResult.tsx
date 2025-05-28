import { useState } from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  Flex,
  IconButton,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CopyIcon, CheckIcon } from "@chakra-ui/icons";

interface SummaryResultProps {
  originalText: string;
  summarizedText: string;
  timestamp: string;
}

export default function SummaryResult({
  originalText,
  summarizedText,
  timestamp,
}: SummaryResultProps) {
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  // 반응형 스타일 설정
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });
  const padding = useBreakpointValue({ base: 3, md: 4 });
  const spacing = useBreakpointValue({ base: 2, md: 4 });

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: "복사 완료",
        description: "텍스트가 클립보드에 복사되었습니다.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "텍스트 복사에 실패했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={padding}
      bg="white"
      shadow="sm"
    >
      <Flex direction="column" gap={spacing}>
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontSize={fontSize} fontWeight="semibold" color="gray.700">
              원본 텍스트
            </Text>
            <Tooltip label="원본 텍스트 복사">
              <IconButton
                aria-label="Copy original text"
                icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                size="sm"
                onClick={() => handleCopy(originalText)}
                colorScheme={isCopied ? "green" : "gray"}
              />
            </Tooltip>
          </Flex>
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            maxH="150px"
            overflowY="auto"
            fontSize={fontSize}
          >
            <Text>{originalText}</Text>
          </Box>
        </Box>

        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontSize={fontSize} fontWeight="semibold" color="gray.700">
              요약 결과
            </Text>
            <Tooltip label="요약 텍스트 복사">
              <IconButton
                aria-label="Copy summarized text"
                icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                size="sm"
                onClick={() => handleCopy(summarizedText)}
                colorScheme={isCopied ? "green" : "gray"}
              />
            </Tooltip>
          </Flex>
          <Box p={3} bg="blue.50" borderRadius="md" fontSize={fontSize}>
            <Text>{summarizedText}</Text>
          </Box>
        </Box>

        <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
          {new Date(timestamp).toLocaleString()}
        </Text>
      </Flex>
    </Box>
  );
}
