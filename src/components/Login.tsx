import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (error) {
      toast({
        title: "로그인 실패",
        description: "이메일 또는 비밀번호를 확인해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <Stack spacing="4">
          <Text fontSize="2xl" fontWeight="bold">
            로그인
          </Text>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing="4">
              <FormControl isRequired>
                <FormLabel>이메일</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>비밀번호</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isDisabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>
            </Stack>
          </form>
          <Text>
            계정이 없으신가요?{" "}
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => navigate("/signup")}
              size="sm"
            >
              회원가입
            </Button>
          </Text>
        </Stack>
      </Box>
    </Container>
  );
}
