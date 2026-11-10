# 아파트샵 검색 노출·보안 진단 및 조치

진단일: 2026-11-10. 보안, 기술 SEO, 마케팅 담당 에이전트 3개가 읽기 전용 진단하고 주 에이전트가 변경을 통합했다.

## 결론과 확인 범위

`highPrice` 누락 경고는 사이트 전체 미노출 원인으로 확인되지 않았다. 공개 HTTP·DNS와 저장소를 조사했으나 Search Console 계정 내부의 색인 제외 사유, Google 선택 표준 URL, 수동 조치·보안 문제는 확인하지 못했다. 원인을 단정하거나 검색 노출을 보장하지 않는다.

- 사이트맵의 13개 URL은 일반/Googlebot UA 요청에서 200, robots는 전체 허용, canonical 정상, X-Robots-Tag 차단 없음. UA 비교는 실제 Googlebot의 접근을 증명하지 않는다.
- HTTPS 정상, HTTP apex → HTTPS 301, 없는 경로는 실제 404.
- `www.aptshop.kr`은 DNS가 해석되지 않았다. 정상 apex의 색인 제외를 직접 설명하는 증거는 아니다.

## 적용한 변경

1. `index.html`의 Store.makesOffer, 중복 LocalBusiness 상품 카탈로그 및 `menu/products.html`의 전체 제품군 Product 마크업을 제거했다. 제품 목록은 CollectionPage / ItemList와 실제 섹션 URL로 표현했다.
2. 홈페이지와 목록에서 규격별 상품에 붙인 AggregateOffer를 제거했다. 누락된 highPrice는 총 6개였으며, 현재 확인할 수 없는 최고가를 추정하지 않았다. 외부 스마트스토어 평점을 여러 제품에 복제한 review / aggregateRating도 검색용 마크업에서 제거했다. 화면의 기존 후기와 구매 링크는 유지한다.
3. 재수집 후 Search Console 상품 리치 결과 항목 수가 줄거나 사라질 수 있다. 일반 웹 검색 자격과는 별개다. 상품 가격 리치 결과가 필요하면 검증 가능한 개별 제품 상세 페이지를 별도로 구축해야 한다.
4. 12개 페이지의 헤더·푸터를 빌드 때 HTML에 포함했다. 기존 JS는 이미 렌더링된 컴포넌트를 재사용하며, 이전의 fetch 방식은 fallback으로 유지했다. JS 없이도 연락처와 푸터 탐색 링크를 제공한다. 제품 탭의 no-JS 표시와 싱글/더블/공업용 목록 앵커를 보완했다.
5. WebSite 이름과 Open Graph 사이트명을 아파트샵으로 통일하고 홈페이지 설명의 무조건적인 ‘전국 당일배송’ 문구를 사실 중심으로 교체했다.
6. 구조화 데이터 파싱·카탈로그 상품/리뷰 마크업 재발·정적 컴포넌트 동기화를 CI에서 검사한다. 본문/구조화 데이터가 달라진 홈페이지·제품소개만 sitemap lastmod를 갱신했다.

## 보안 진단

### S1 — 빌드 의존성 취약점 (수정 완료)

초기 npm audit에서 high 4개, moderate 1개 패키지 취약점이 보고되었다. 개발 의존성인 nanoid, picomatch, postcss, postcss-selector-parser, source-map-js의 전이 의존성을 `npm audit fix`로 갱신했다. 변경 근거는 `package-lock.json:463` (nanoid), `:526` / `:963` (picomatch), `:559` (postcss), `:701` (postcss-selector-parser), `:821` (source-map-js)이며, 수정 후 전체 audit 및 운영 의존성 audit 모두 0건이다. 정적 사이트 런타임이 직접 침해되었다는 증거는 아니다.

### S2 — www DNS 미설정 (외부 조치 필요)

DNS 관리 화면에서 `www` CNAME을 `koreafox.github.io`로 설정한 후 GitHub Pages의 사용자 도메인/HTTPS 인증서와 apex 리디렉션을 확인한다. 현재 .htaccess가 자동으로 해결해 준다는 주석은 수정했다. DNS 계정 변경은 이 작업에 포함하지 못했다.

### S3 — 호스팅 보안 헤더 제약 (추가 개선)

현재 GitHub Pages에서는 `.htaccess:1`의 안내대로 `.htaccess:57` 이하의 CSP·X-Frame-Options·nosniff 등 서버 헤더 설정이 실행되지 않는다. 공개 응답에서 해당 헤더를 확인하지 못했다. 인라인 이벤트가 있는 기존 UI를 보호하기 위해 검증 없이 CSP를 주입하지 않았다. 필요하면 응답 헤더를 제어할 수 있는 호스팅/프록시로 옮기는 작업을 별도로 계획한다. 색인 미노출의 확인된 원인은 아니다.

공개 정적 사이트에서 명백한 사용자 입력 기반 실행 경로, 노출 비밀키, 악성 삽입 코드는 관찰되지 않았다. 이는 침투 테스트나 무침해 보증이 아니다.

## 배포 뒤 Search Console에서 확인할 항목

1. 도메인 속성 또는 정확한 `https://aptshop.kr/` 속성에서 홈페이지와 `/menu/products.html`의 URL 검사 → 페이지 색인 생성 사유·마지막 크롤링·Google 선택 표준 URL을 기록한다.
2. 실시간 URL 테스트로 배포 내용을 확인하고 두 URL의 색인 생성을 요청한다.
3. Sitemaps에 `https://aptshop.kr/sitemap.xml`을 제출하고 처리 결과를 확인한다.
4. 제품 스니펫 경고에 수정 결과 검증을 요청한다. 항목 자체가 사라질 수도 있으며, 재수집 전에는 이전 경고가 남을 수 있다.
5. 수동 조치·보안 문제 보고서를 확인한다. 거부 사유가 있으면 그 사유를 근거로 후속 조치를 결정한다.
6. 성과 보고서에서 아파트샵 / 황소밴드 브랜드 검색과 비브랜드 검색의 노출·클릭을 나눠 관찰한다. 검증된 규격별 상세 정보 확장, 소유한 스마트스토어·블로그·유튜브의 공식 도메인 연결이 다음 성장 과제다.

재크롤링에는 며칠에서 몇 주가 걸릴 수 있으며 요청이 색인을 보장하지 않는다.

## 근거

- [Google 상품 스니펫: 개별 상품, AggregateOffer 및 변형 지침](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google 리뷰: 외부 사이트 집계 및 특정 항목 지침](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [구조화 데이터 정책](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [사이트 이름](https://developers.google.com/search/docs/appearance/site-names)
- [Google 최소 기술 요건](https://developers.google.com/search/docs/essentials/technical)
- [재크롤링 요청과 처리 기간](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [GitHub Pages 사용자 도메인 및 www DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 검증 결과

- npm run build, npm run validate:seo: 통과. 13페이지의 JSON-LD 22블록 및 12페이지 정적 컴포넌트 확인.
- 시스템 Python의 validate-site-metadata.py: 사이트맵 13 URL·RSS·robots 통과.
- 모바일 390px / 데스크톱 1440px: 메뉴와 제품 탭 직접 링크 동작, 가로 넘침 없음, 콘솔 오류 없음. JS 비활성화 환경의 제품 탭과 푸터 탐색 표시 확인.
- npm audit / npm audit --omit=dev: 취약점 0건.
- git diff --check 및 변경 JS 문법 검사 통과.
