# 텍스트 요약 서비스 (AutoSage)

텍스트를 입력하면 자동으로 핵심 내용을 요약해주는 웹 서비스입니다.

## 주요 기능

- ✍️ 텍스트 자동 요약 (규칙 기반 알고리즘)
- 📱 모바일 반응형 디자인
- 📋 원본/요약 텍스트 복사 기능
- 🔒 Firebase 인증 (준비중)

## 기술 스택

- **Frontend**

  - React 18
  - TypeScript
  - Chakra UI
  - Vite

- **Backend/DB**

  - Firebase Authentication (준비중)
  - Cloud Firestore (준비중)

- **요약 알고리즘**
  - 자체 개발 규칙 기반 요약 알고리즘
  - 키워드 추출 및 문장 중요도 계산

## 시작하기

1. 저장소 클론

```bash
git clone https://github.com/joung886/autosage-app.git
cd autosage-app
```

2. 의존성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm run dev
```

4. 브라우저에서 확인

```
http://localhost:5173
```

## 주요 화면

1. **메인 화면**

   - 텍스트 입력 영역
   - 요약 결과 표시
   - 복사 기능
   - 모바일 최적화된 UI/UX

2. **로그인/회원가입**

   - 이메일/비밀번호 인증
   - 사용자 정보 관리

3. **요약 기록**
   - 과거 요약 목록 조회
   - 시간순 정렬

## 업데이트 내역

- 2025.05.29: 프로젝트 시작
- 2025.05.29: 기본 요약 기능 구현
- 2025.05.29: Firebase 연동 시도 및 임시 보류
- 2025.05.29: 모바일 UI 최적화

## 현재 진행 중인 작업

- Firebase 인증 및 데이터베이스 연동
- 요약 알고리즘 개선
- 사용자 피드백 반영

## 향후 계획

- [ ] Firebase 인증 완료
- [ ] 요약 기록 저장 기능
- [ ] GPT 기반 요약 기능 추가
- [ ] 다국어 지원
- [ ] PDF 파일 지원

## 라이선스

MIT License
