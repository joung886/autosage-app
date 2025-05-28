import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Divider,
  Heading,
  Container,
} from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../config/firebase";

interface Summary {
  id: string;
  originalText: string;
  result: string;
  createdAt: Timestamp;
}

export default function SummaryList() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchSummaries = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const summariesRef = collection(db, "summaries");
        const q = query(
          summariesRef,
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const summariesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Summary[];

        setSummaries(summariesData);
      } catch (error) {
        console.error("요약 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, [currentUser]);

  if (loading) {
    return <Text>요약 목록을 불러오는 중...</Text>;
  }

  if (!currentUser) {
    return <Text>요약 목록을 보려면 로그인이 필요합니다.</Text>;
  }

  if (summaries.length === 0) {
    return <Text>저장된 요약 결과가 없습니다.</Text>;
  }

  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h2" size="lg" mb={6}>
        내 요약 목록
      </Heading>
      <VStack spacing={4} align="stretch">
        {summaries.map((summary) => (
          <Box
            key={summary.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            bg="white"
          >
            <Text fontSize="sm" color="gray.500" mb={2}>
              {summary.createdAt.toDate().toLocaleString()}
            </Text>
            <Text fontWeight="bold" mb={2}>
              원본 텍스트:
            </Text>
            <Text mb={4} noOfLines={3}>
              {summary.originalText}
            </Text>
            <Divider mb={4} />
            <Text fontWeight="bold" mb={2}>
              요약 결과:
            </Text>
            <Text>{summary.result}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
}
