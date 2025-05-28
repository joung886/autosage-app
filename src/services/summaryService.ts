import { pipeline } from "@xenova/transformers";

export class SummaryService {
  private static summarizer: any = null;

  private static async initializeSummarizer() {
    if (!this.summarizer) {
      this.summarizer = await pipeline(
        "summarization",
        "Xenova/distilbart-cnn-6-6"
      );
    }
    return this.summarizer;
  }

  private static extractSentences(text: string): string[] {
    // 문장의 끝을 인식하는 정규식 수정
    const sentences = text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return sentences.length > 0 ? sentences : [text];
  }

  private static calculateSentenceScore(sentence: string): number {
    // 중요 키워드 (예시)
    const keywords = [
      "프로젝트",
      "개발",
      "구현",
      "생성",
      "작업",
      "기능",
      "목적",
      "결과",
      "요약",
      "정리",
      "설명",
      "소개",
      "주요",
      "핵심",
      "중요",
      "필수",
      "목표",
      "만들", // "만들어보았다" 같은 표현을 위해 추가
      "테스트",
      "서비스",
    ];

    // 키워드 포함 여부에 따른 점수
    const keywordScore = keywords.reduce((score, keyword) => {
      return score + (sentence.includes(keyword) ? 2 : 0);
    }, 0);

    // 문장 위치에 따른 가중치 (첫 문장에 가중치 부여)
    const positionScore =
      sentence.includes("나는") || sentence.includes("저는") ? 2 : 0;

    return keywordScore + positionScore;
  }

  private static extractKeyPhrases(text: string): string {
    // 핵심 구절 추출
    const phrases = text.split(/[,.!?]/);
    const keyPhrases = phrases
      .map((phrase) => phrase.trim())
      .filter((phrase) => {
        const hasKeyword = [
          "프로젝트",
          "개발",
          "구현",
          "작업",
          "기능",
          "목적",
          "결과",
          "요약",
          "정리",
        ].some((keyword) => phrase.includes(keyword));
        return hasKeyword && phrase.length > 5;
      });

    return keyPhrases[0] || text;
  }

  public static async summarizeText(text: string): Promise<string> {
    try {
      console.log("입력 텍스트:", text); // 디버깅 로그

      // 입력 텍스트 검증
      if (!text || typeof text !== "string") {
        console.log("유효하지 않은 입력"); // 디버깅 로그
        return "유효한 텍스트를 입력해주세요.";
      }

      // 텍스트 전처리
      const cleanText = text.trim();
      console.log("전처리된 텍스트:", cleanText); // 디버깅 로그

      // 짧은 텍스트는 그대로 반환
      if (cleanText.length < 20) {
        console.log("짧은 텍스트 그대로 반환"); // 디버깅 로그
        return cleanText;
      }

      // 문장 분리
      const sentences = cleanText
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      console.log("분리된 문장들:", sentences); // 디버깅 로그

      // 단일 문장이면 그대로 반환
      if (sentences.length <= 1) {
        console.log("단일 문장 그대로 반환"); // 디버깅 로그
        return cleanText;
      }

      // 중요 키워드
      const keywords = [
        "프로젝트",
        "개발",
        "구현",
        "생성",
        "작업",
        "기능",
        "목적",
        "결과",
        "요약",
        "정리",
        "설명",
        "소개",
        "주요",
        "핵심",
        "중요",
        "필수",
        "목표",
        "만들",
        "테스트",
        "서비스",
      ];

      // 각 문장 점수 계산
      const scoredSentences = sentences.map((sentence) => {
        let score = 0;

        // 키워드 점수
        keywords.forEach((keyword) => {
          if (sentence.toLowerCase().includes(keyword)) {
            score += 2;
          }
        });

        // 주체 언급 점수
        if (sentence.includes("나는") || sentence.includes("저는")) {
          score += 5; // 가중치 증가
        }

        // 행동 완료 표현 점수
        if (
          sentence.includes("했다") ||
          sentence.includes("았다") ||
          sentence.includes("었다") ||
          sentence.includes("보았다")
        ) {
          score += 3;
        }

        console.log("문장 점수:", { sentence, score }); // 디버깅 로그
        return { sentence, score };
      });

      // 점수 기준 정렬
      scoredSentences.sort((a, b) => b.score - a.score);
      console.log("정렬된 문장들:", scoredSentences); // 디버깅 로그

      // 최고 점수 문장 반환
      const result = scoredSentences[0].sentence;
      console.log("최종 결과:", result); // 디버깅 로그

      return result;
    } catch (error) {
      console.error("요약 중 오류 발생:", error);
      return "요약 중 오류가 발생했습니다.";
    }
  }
}
