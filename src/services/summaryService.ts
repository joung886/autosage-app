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
    // 문장 구분을 위한 정규식 (마침표, 느낌표, 물음표, 쉼표로 구분)
    const sentenceRegex = /[^.!?,]+[.!?,]+/g;
    const matches = text.match(sentenceRegex) || [];

    // 빈 문자열이나 공백만 있는 문장 제거
    return matches
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
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
    ];

    // 키워드 포함 여부에 따른 점수
    const keywordScore = keywords.reduce((score, keyword) => {
      return score + (sentence.includes(keyword) ? 2 : 0);
    }, 0);

    // 문장 위치에 따른 가중치 (첫 문장에 가중치 부여)
    const positionScore =
      sentence.includes("저는") || sentence.includes("나는") ? 1 : 0;

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
      // 텍스트가 너무 길 경우 처리
      const maxLength = 1000;
      if (text.length > maxLength) {
        text = text.substring(0, maxLength);
      }

      // 문장 추출
      const sentences = this.extractSentences(text);

      // 텍스트가 매우 짧은 경우 핵심 구절 추출
      if (text.length < 50 || sentences.length <= 1) {
        return this.extractKeyPhrases(text);
      }

      if (sentences.length === 0) {
        return "텍스트에서 유효한 문장을 찾을 수 없습니다.";
      }

      // 각 문장의 점수 계산
      const scoredSentences = sentences.map((sentence) => ({
        sentence: sentence.trim(),
        score: this.calculateSentenceScore(sentence),
      }));

      // 점수순으로 정렬
      scoredSentences.sort((a, b) => b.score - a.score);

      // 상위 문장 선택
      const numSentences = Math.max(
        1,
        Math.min(2, Math.ceil(sentences.length * 0.3))
      );
      const topSentences = scoredSentences
        .slice(0, numSentences)
        .map((item) => item.sentence);

      // 원래 순서대로 재정렬
      const orderedSummary = sentences
        .filter((sentence) => topSentences.includes(sentence.trim()))
        .join(" ");

      return orderedSummary || "요약을 생성할 수 없습니다.";
    } catch (error) {
      console.error("요약 중 오류 발생:", error);
      throw new Error("텍스트 요약 중 오류가 발생했습니다.");
    }
  }
}
