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
      // 입력 텍스트가 비어있거나 너무 짧은 경우
      if (!text || text.length < 5) {
        return text;
      }

      // 텍스트 전처리
      const cleanText = text.trim();

      // 문장에 '나는' 또는 '저는'이 포함되어 있고, 
      // '만들었다', '했다', '보았다' 등의 종결어미가 있는 경우
      if (
        (cleanText.includes('나는') || cleanText.includes('저는')) &&
        (cleanText.includes('었다') || cleanText.includes('았다') || 
         cleanText.includes('했다') || cleanText.includes('보았다'))
      ) {
        return cleanText;
      }

      // 긴 텍스트의 경우 문장 단위로 분리
      const sentences = cleanText
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (sentences.length <= 1) {
        return cleanText;
      }

      // 각 문장의 중요도 계산
      const scoredSentences = sentences.map(sentence => {
        let score = 0;
        
        // 주요 키워드 점수
        const keywords = ['프로젝트', '개발', '구현', '생성', '작업', '기능', 
                        '목적', '결과', '요약', '정리', '설명', '소개', '주요',
                        '핵심', '중요', '필수', '목표', '만들', '테스트', '서비스'];
        
        keywords.forEach(keyword => {
          if (sentence.includes(keyword)) score += 2;
        });

        // 주체 언급 점수
        if (sentence.includes('나는') || sentence.includes('저는')) score += 3;
        
        // 문장 길이 점수 (너무 짧거나 긴 문장 제외)
        if (sentence.length >= 10 && sentence.length <= 50) score += 1;

        return { sentence, score };
      });

      // 점수 기준 정렬
      scoredSentences.sort((a, b) => b.score - a.score);

      // 최고 점수 문장 반환
      return scoredSentences[0].sentence || cleanText;

    } catch (error) {
      console.error('요약 중 오류 발생:', error);
      return text;
    }
  }
}
