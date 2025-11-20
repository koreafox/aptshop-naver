# SEO 최적화 가이드 - 아파트샵 황소밴드

## 📋 SEO 최적화 완료 현황 (2025-11-21)

### ✅ 완료된 작업
1. **메타태그 최적화**
   - 모든 페이지 통일된 메타태그 구조 적용
   - Open Graph, Twitter Card 설정 완료
   - 네이버 사이트 확인 완료 (aab4e90a7b6f11cff5bcbd1d4d7fc82eb261770f)
   
2. **Sitemap.xml 업데이트**
   - 11개 페이지 등록 완료
   - 최종 수정일: 2025-11-21
   - 우선순위 및 업데이트 빈도 설정
   
3. **Robots.txt 설정**
   - 모든 검색엔진 크롤러 허용
   - Sitemap 위치 명시
   
4. **구조화된 데이터 (JSON-LD)**
   - Organization 스키마 적용
   - 회사 정보, 연락처, SNS 링크 포함

### ⏳ 대기 중인 작업
1. **구글 서치 콘솔 등록**
   - `index.html` 32번 줄 `GOOGLE_VERIFICATION_CODE` 교체 필요
   - 사이트맵 제출 필요

---

## 🔧 구글 서치 콘솔 등록 방법

### 1. 구글 서치 콘솔 접속
- https://search.google.com/search-console 접속
- Google 계정으로 로그인

### 2. 속성 추가
- "속성 추가" 클릭
- "URL 접두어" 선택
- `https://aptshop.kr` 입력

### 3. 소유권 확인
- "HTML 태그" 방법 선택
- 제공된 메타태그 복사
- `index.html`의 32번 줄 `GOOGLE_VERIFICATION_CODE` 부분을 실제 코드로 교체
```html
<meta name="google-site-verification" content="실제_발급받은_코드" />
```

### 4. 사이트맵 제출
- 구글 서치 콘솔 > Sitemaps 메뉴
- `https://aptshop.kr/sitemap.xml` 제출

---

## 📝 통일된 메타태그 구조

### 필수 메타태그
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[페이지명] - 황소밴드 | 아파트샵</title>
<meta name="description" content="[페이지 설명 120-160자]">
<meta name="keywords" content="황소밴드, 파이프누수, 누수보수, [페이지별 키워드]">
<meta name="author" content="아파트샵">
<meta name="robots" content="index, follow">
```

### Open Graph (소셜 미디어)
```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="아파트샵">
<meta property="og:title" content="[페이지 제목]">
<meta property="og:description" content="[페이지 설명]">
<meta property="og:url" content="https://aptshop.kr/[페이지경로]">
<meta property="og:locale" content="ko_KR">
```

### Canonical URL
```html
<link rel="canonical" href="https://aptshop.kr/[페이지경로]">
```

## 핵심 키워드 전략

### 주요 키워드
1. **브랜드 키워드**: 황소밴드, 아파트샵
2. **제품 키워드**: 싱글밴드, 더블밴드, 공업용밴드
3. **용도 키워드**: 파이프누수, 누수보수, 배관보수, 호스밴드, 클램프
4. **특징 키워드**: 특허, 강력한조임력, 360도회전, 패킹패드

### 페이지별 키워드 매핑
- **메인**: 황소밴드, 파이프누수, 누수보수, 공식판매점
- **제품소개**: 싱글밴드, 더블밴드, 공업용밴드, 제품라인업
- **브랜드**: 황소밴드, 브랜드스토리, 특허기술
- **구매**: 온라인구매, 스마트스토어, 공식스토어
- **문의**: 고객상담, 문의, AS, 설치방법

## 구조화된 데이터 (Schema.org)

### Organization (메인 페이지)
- 회사명, 로고, 연락처, 소셜미디어 링크

### Product (제품 페이지)
- 제품명, 가격, 이미지, 설명, 리뷰

### BreadcrumbList (모든 서브 페이지)
- 네비게이션 경로 표시

## 성능 최적화

### 이미지 최적화
- WebP 포맷 사용 권장
- 적절한 크기로 리사이징
- lazy loading 적용

### 페이지 속도
- CSS/JS 압축
- 불필요한 리소스 제거
- CDN 활용

## 모니터링

### 주요 지표
- 구글 서치 콘솔: 검색 노출, 클릭률, 순위
- 구글 애널리틱스: 방문자, 이탈률, 전환율
- 네이버 서치어드바이저: 네이버 검색 최적화

### 정기 점검 항목
- [ ] 깨진 링크 확인
- [ ] 메타태그 중복 확인
- [ ] 사이트맵 업데이트
- [ ] 모바일 친화성 테스트
- [ ] 페이지 속도 측정
