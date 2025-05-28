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
      console.log("입력 텍스트:", text);

      // 입력 검증
      if (!text || typeof text !== "string") {
        return "유효한 텍스트를 입력해주세요.";
      }

      // 텍스트 전처리
      const cleanText = text.trim();
      console.log("전처리된 텍스트:", cleanText);

      // 짧은 문장이면서 '나는/저는'이 포함된 경우 그대로 반환
      if (
        cleanText.length < 100 &&
        (cleanText.includes("나는") || cleanText.includes("저는"))
      ) {
        console.log("짧은 문장 그대로 반환");
        return cleanText;
      }

      // 문장 분리 (마침표가 없는 경우도 처리)
      let sentences = cleanText.split(/[.!?]+/);
      if (sentences.length === 1 && sentences[0] === cleanText) {
        // 마침표가 없는 경우 띄어쓰기로 분리
        sentences = cleanText.split(/[\s,]+/);
      }

      sentences = sentences.map((s) => s.trim()).filter((s) => s.length > 0);

      console.log("분리된 문장/구절들:", sentences);

      // 문장이 하나뿐이면 그대로 반환
      if (sentences.length <= 1) {
        return cleanText;
      }

      // 각 문장/구절의 점수 계산
      const scoredSentences = sentences.map((sentence) => {
        let score = 0;

        // 주요 키워드 점수
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

        keywords.forEach((keyword) => {
          if (sentence.includes(keyword)) score += 2;
        });

        // 주체 언급 점수
        if (sentence.includes("나는") || sentence.includes("저는")) {
          score += 5;
        }

        // 동작/행위 표현 점수
        if (
          sentence.includes("했") ||
          sentence.includes("았") ||
          sentence.includes("었") ||
          sentence.includes("보았") ||
          sentence.includes("만들")
        ) {
          score += 3;
        }

        console.log("문장 점수:", { sentence, score });
        return { sentence, score };
      });

      // 점수로 정렬
      scoredSentences.sort((a, b) => b.score - a.score);
      console.log("정렬된 문장들:", scoredSentences);

      // 최고 점수 문장 반환 또는 원본 반환
      return scoredSentences[0]?.sentence || cleanText;
    } catch (error) {
      console.error("요약 중 오류 발생:", error);
      return cleanText; // 오류 시 원본 반환
    }
  }
}
