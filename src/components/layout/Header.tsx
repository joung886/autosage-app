import {
  Box,
  Container,
  Flex,
  Button,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "로그아웃 성공",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="header" bg="blue.500" color="white" py={4}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center">
          <Text
            as={RouterLink}
            to="/"
            fontSize="2xl"
            fontWeight="bold"
            _hover={{ textDecoration: "none" }}
          >
            텍스트 요약 서비스
          </Text>

          <HStack spacing={4}>
            {currentUser ? (
              <>
                <Button
                  as={RouterLink}
                  to="/history"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                >
                  요약 기록
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                >
                  로그인
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup"
                  variant="ghost"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                >
                  회원가입
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
