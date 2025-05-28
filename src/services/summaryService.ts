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
      // 텍스트가 너무 짧으면 그대로 반환
      if (text.length < 10) {
        return text;
      }

      // 텍스트가 너무 길 경우 처리
      const maxLength = 1000;
      if (text.length > maxLength) {
        text = text.substring(0, maxLength);
      }

      // 문장 추출
      const sentences = this.extractSentences(text);

      // 문장이 하나뿐이면 그대로 반환
      if (sentences.length <= 1) {
        return text;
      }

      // 각 문장의 점수 계산
      const scoredSentences = sentences.map((sentence) => ({
        sentence: sentence.trim(),
        score: this.calculateSentenceScore(sentence),
      }));

      // 점수순으로 정렬
      scoredSentences.sort((a, b) => b.score - a.score);

      // 가장 높은 점수의 문장 선택
      const topSentence = scoredSentences[0].sentence;

      return topSentence || text; // 실패시 원본 반환
    } catch (error) {
      console.error("요약 중 오류 발생:", error);
      return text; // 오류 발생시 원본 반환
    }
  }
}
