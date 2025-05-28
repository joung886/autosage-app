# React + TypeScript 자동화 웹앱 템플릿

Firebase 인증이 포함된 React + TypeScript 웹 애플리케이션 템플릿입니다.

## 기능

- 🔐 Firebase 인증 (이메일/비밀번호)
- 🎨 Chakra UI를 이용한 모던한 디자인
- 📱 반응형 레이아웃
- 🛣️ React Router를 이용한 라우팅
- 🔒 보호된 라우트

## 시작하기

1. 프로젝트 클론 및 의존성 설치:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

2. Firebase 프로젝트 설정:
   - [Firebase Console](https://console.firebase.google.com)에서 새 프로젝트 생성
   - 웹 앱 추가 및 설정 정보 복사
   - 프로젝트 루트에 `.env` 파일 생성 후 아래 내용 추가:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. 개발 서버 실행:

```bash
npm run dev
```

## 프로젝트 구조

```
src/
  ├── components/        # 재사용 가능한 컴포넌트
  │   ├── Login.tsx     # 로그인 컴포넌트
  │   └── Signup.tsx    # 회원가입 컴포넌트
  ├── contexts/         # React Context
  │   └── AuthContext.tsx  # 인증 컨텍스트
  ├── config/           # 설정 파일
  │   └── firebase.ts   # Firebase 설정
  └── App.tsx           # 메인 앱 컴포넌트
```

## 기술 스택

- React
- TypeScript
- Vite
- Firebase Authentication
- Chakra UI
- React Router DOM

## 라이선스

MIT
