// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase 구성
const firebaseConfig = {
  apiKey: "AIzaSyBFRr2GJdvWW5cMfxuvrrN4DKC97srGrfA",
  authDomain: "autosage-7ef40.firebaseapp.com",
  projectId: "autosage-7ef40",
  storageBucket: "autosage-7ef40.firebasestorage.app",
  messagingSenderId: "197501746114",
  appId: "1:197501746114:web:2f73b34bfc1e2c0baaf45b",
};

// 설정 디버깅
console.log("Firebase 설정:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "설정됨" : "미설정",
});

// Firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 인증 서비스 & Firestore 인스턴스 export
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore 초기화 확인
console.log("Firestore 초기화 상태:", db ? "성공" : "실패");

// 개발 환경에서 오류 디버깅을 위한 추가 로깅
if (process.env.NODE_ENV === "development") {
  db.toJSON();
}
