# 🚀 Snake Game - Deployment Guide

## 로컬 실행

### 방법 1: 파일 직접 열기
`index.html` 파일을 브라우저로 드래그 앤 드롭하거나 더블클릭

### 방법 2: HTTP 서버 사용 (권장)

**Python 3:**
```bash
cd snake-game
python3 -m http.server 8000
# http://localhost:8000 접속
```

**Node.js (http-server):**
```bash
npx http-server snake-game -p 8000
```

**PHP:**
```bash
cd snake-game
php -S localhost:8000
```

## 게임 컨트롤

### 키보드
- **방향키** 또는 **WASD**: 뱀 조종
- **스페이스바**: 일시정지/재개

### 버튼
- **시작**: 게임 시작
- **일시정지**: 게임 멈춤/재개
- **재시작**: 게임 리셋

## 특징

✅ 반응형 디자인 (Glassmorphism UI)  
✅ 점수 및 최고점 자동 저장 (localStorage)  
✅ 부드러운 애니메이션  
✅ 충돌 감지 (벽, 자기 몸)  
✅ 180도 회전 방지  

## 브라우저 호환성

- ✅ Chrome/Edge (권장)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

최소 요구사항: HTML5 Canvas 지원

## 트러블슈팅

### 게임이 로드되지 않음
- 브라우저 콘솔(F12)에서 에러 확인
- HTTP 서버 사용 (CORS 이슈 방지)

### 컨트롤이 작동하지 않음
- "시작" 버튼 클릭 확인
- 브라우저 창이 포커스되어 있는지 확인

### 점수가 저장되지 않음
- localStorage가 활성화되어 있는지 확인
- 시크릿 모드에서는 저장 안 됨

## 웹 호스팅

GitHub Pages, Netlify, Vercel 등에 바로 배포 가능:

```bash
# GitHub Pages 예시
git push origin master
# Settings > Pages에서 master branch 선택
```

## 라이선스

MIT License - 자유롭게 수정 및 배포 가능
