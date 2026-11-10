# 아파트샵 - 황소밴드 기업형 웹사이트

## 프로젝트 구조

```
aptshop-naver/
├── index.html              # 메인 페이지
├── components/             # 재사용 가능한 컴포넌트
│   ├── header.html        # 헤더 (로고, 네비게이션)
│   └── footer.html        # 푸터
├── css/                   # 스타일시트
│   ├── main.css          # 메인 스타일
│   └── responsive.css    # 반응형 스타일
├── js/                    # JavaScript 파일
│   ├── main.js           # 메인 스크립트 (컴포넌트 로딩, 네비게이션)
│   └── utils.js          # 유틸리티 함수
└── img/                   # 이미지 파일
    └── logo.png          # 로고 이미지 (추가 필요)
```

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Vanilla JavaScript**: 순수 자바스크립트 (프레임워크 없음)
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 주요 기능

### 1. 모듈화된 구조
- 헤더와 푸터를 별도 컴포넌트로 분리
- JavaScript로 동적 로딩
- 코드 중복 최소화

### 2. 반응형 네비게이션
- 데스크톱: 드롭다운 메뉴
- 모바일: 햄버거 메뉴
- 자동 크기 조절

### 3. 메뉴 구조
- **회사소개**: 브랜드, 기업정보, 기업연혁, 미션
- **제품소개**: 황소밴드, 공업용밴드
- **제품구매**: 소셜마켓
- **뉴스**: 기사 및 보도자료
- **파트너스**: 파트너스, 오시는길, 문의 및 상담

## 설치 및 실행

### 로컬 서버 실행

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000` 접속

## 파일 규칙

1. **디렉토리 분리**: css, js, img, components 폴더로 명확히 구분
2. **모듈화**: 재사용 가능한 컴포넌트는 별도 파일로 분리
3. **코드 중복 금지**: 동일한 코드는 함수나 컴포넌트로 추출
4. **파일 분리**: HTML, CSS, JS를 한 파일에 작성하지 않음
5. **파일 길이**: 한 파일당 최대 600줄 이하 유지

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- 모바일 브라우저

## 추가 작업 필요

1. `img/logo.png` 로고 이미지 추가
2. 각 서브 페이지 생성 (brand.html, company-info.html 등)
3. 실제 콘텐츠 추가
4. SEO 최적화
5. 성능 최적화

## 라이선스

© 2025 아파트샵. All rights reserved.

## 배포 빌드 및 SEO 검사

공유 헤더·푸터는 `components/*.html`에서 수정한 뒤 `npm run build`를 실행합니다.
빌드는 홈페이지와 `menu/*.html`에 메뉴·사업자 정보를 정적으로 포함하고 CSS를 생성합니다.
생성된 HTML도 GitHub Pages 배포 대상이므로 함께 커밋합니다.

```bash
npm ci
npm run build
npm run validate:seo
python3 scripts/validate-site-metadata.py
```

홈페이지와 제품 목록은 카탈로그이므로 단일 상품의 가격·평점 리치 결과 마크업을 사용하지 않습니다.
개별 상품 마크업을 추가하려면 해당 상세 페이지에 실제 규격, 최신 가격, 재고와 자체 수집 리뷰를 검증한 뒤 적용해야 합니다.
