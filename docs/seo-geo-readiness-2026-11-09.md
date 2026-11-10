# 아파트샵 SEO·GEO 적용 및 운영 기준

공식 지침 기준일: **2026-11-09**. 구현·자료 확인일: **2026-11-10**.

기술 SEO, 마케팅·검색 의도, GEO 크롤러·보안 담당 3개 에이전트가 조사했고, 주 에이전트가 원본 자료 확인·구현·검증을 통합했다. 홈페이지는 사용자 제공 Search Console에서 이미 색인 완료로 확인됐다. 목표는 검색어별 유용성과 발견·인용·문의 가능성을 높이는 것이며, 특정 순위나 AI 인용 횟수를 보장하지 않는다.

## 기준일 이전 최신 공식 변경의 적용

| 확인한 공식 지침 | 이 사이트의 적용 |
| --- | --- |
| 2026-07-10 Google 생성형 AI 최적화 가이드 | 실제 상품 목록과 보유 시험자료를 연결하는 가이드 제공. AI용 특수 마크업·문단 쪼개기·검색어별 대량 페이지 생성은 하지 않음. |
| 2026-10-01 생성형 AI 콘텐츠 지침 | 제목·설명·이미지 대체 텍스트·본문·구조화 데이터의 사실관계를 함께 검토. |
| 2026-09-08 Organization 지침 | 아파트샵 판매자를 고정된 #organization으로 식별. 제품 브랜드·과거 자료 발급 주체와 구분. |
| 2026-05-07 FAQ 리치 결과 종료 / 06-15 문서 제거 | 화면의 유용한 질문·답변은 유지하고 FAQPage 마크업 제거. |
| 2026년 Search 생성형 AI 설정·성과 보고서 | 계정에서 포함 여부와 별도 생성형 AI 성과 보고서를 확인하도록 운영 절차 기록. |
| 2026-11-09 Google 변경 내역 | 이날 신규 항목은 관광 관련 기능이며 이 판매점에 적용할 이유가 없어 제외. |

`llms.txt`는 공개 페이지 참고 목록으로 정합성만 보정했다. Google은 이 파일을 순위·노출에 사용하지 않는다고 명시한다. 2027년 적용 예정인 AI 학습 선호 제어를 현재 검색 노출 설정으로 혼동하지 않았다.

## 적용 완료

- **규격 선택·구매 가이드:** `/menu/selection-guide.html`. 싱글·더블·공업용의 판매 규격을 HTML 표로 비교하고, 실제 외경·재질·누수 위치·현장 조건과 사진을 준비하는 상담 경로를 제공한다. 검증되지 않은 A→mm 환산, 제품 수명, 허용 압력·온도, 설치 토크, 실시간 재고·가격은 만들지 않았다.
- **특허·시험 원본 자료:** `/menu/certifications.html`. 실제 이미지 5개와 텍스트 설명을 연결했다. 특허증 이미지 연결 오류와 판매점 인증 오인을 수정했다. 대명더블유에스의 2016–2018 확인서, 럭키텍의 2017–2020 지정서를 과거 자료로 구분한다.
- **시험 범위:** KTC T2015-07951의 공업용 호스밴드(50A)+패킹패드 시료, 토크 20 N·m 및 수압 3 MPa·5분 시험 결과만 설명한다. 특정 시료 결과를 전체 규격의 설치·사용 조건으로 일반화하지 않는다.
- **주장 정합성:** 일반 비교 제품이 반드시 실패한다는 설명, 영구 고정·반영구·전 제품 고압 성능 같은 포괄 표현을 정리했다. 기존 사용자의 인용 후기는 별개로 유지하되 검색 평점으로 재집계하지 않는다.
- **판매자 엔터티:** 홈페이지 Organization/OnlineStore를 `https://aptshop.kr/#organization`으로 통합하고, WebSite·영상·문의 페이지에서 연결했다. 고정 manufacturer=아파트샵도 제거했다.
- **발견 경로:** 홈페이지·제품목록·공통 메뉴·푸터·HTML/XML 사이트맵에서 새 가이드로 연결한다. `#hwangso` 실제 앵커와 제품군 앵커가 동작한다. 총 사이트맵 URL은 14개다.
- **검색 표현:** 색인 대상 페이지에 `max-image-preview:large`, 중복 계층 없는 BreadcrumbList, 직접 미디어가 아닌 YouTube watch URL의 잘못된 VideoObject.contentUrl 제거. 영상 embedUrl과 실제 발행자 참조는 유지한다.
- **피드·참고자료:** RSS를 실제 목적 페이지의 제목·설명으로 동기화해 과거의 당일배송·KC·수명 등 확인되지 않은 피드 문구를 제거했다. 기존 항목의 발행일은 유지하고 신규 가이드만 실제 생성일을 사용했다. sitemap lastmod도 실제 수정한 본문/구조화 데이터 기준이다.
- **QA:** 내부 파일·앵커, 메타데이터 중복, H1, JSON-LD, 정적 컴포넌트·정책 모달 누락 검사를 CI에 추가했다. 새 페이지에도 기존 약관·개인정보 모달이 작동한다.

## 확인한 결과와 한계

- `npm run build`, `npm run validate:seo`, `python3 scripts/validate-site-metadata.py`, `python3 scripts/validate-page-links.py` 통과.
- 14페이지의 JSON-LD 20블록, 제목·설명·H1·로컬 링크·이미지·앵커와 사이트맵·RSS를 검증했다.
- 모바일 390px, 데스크톱 및 JavaScript 비활성화 환경에서 새 본문·표·문의 링크를 확인했다. 전체 페이지 가로 넘침은 없고, 규격표는 필요한 경우 표 영역 안에서 스크롤한다. 새 자료 페이지 정책 모달 열기·닫기도 확인했다.
- Lighthouse 13.6.0, 로컬 서버, 모바일 기본 설정, 새 가이드 1회 최종 실행: Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100. LCP 1.2초, CLS 0, TBT 0ms. 이 값은 실제 운영 트래픽의 Core Web Vitals, Google의 품질 평가나 검색 순위가 아니다.
- 외부 상품 페이지의 가격·재고·옵션별 치수와 전체 시험성적서 최신본은 확인하지 못했다. 현재 확보한 공개 이미지의 범위만 사용했다.
- 계정 내부 Search Console 성과·AI 포함 상태, Bing AI Performance는 아직 접근하지 못했다. 검색어별 현재 순위·검색량을 추정하지 않았다.

## 계정·외부 설정에서 남은 실행 항목

1. Search Console의 **설정 → Search 생성형 AI**에서 사이트가 포함 상태인지 확인한다. 공식 문서상 기본값은 포함이지만 현재 계정값은 확인하지 못했다. 도메인 속성과 URL 접두어 속성의 상속 관계도 확인한다.
2. 새 가이드·자료 페이지·제품목록·홈페이지의 실시간 URL 테스트 후 색인 생성을 요청하고 XML 사이트맵 처리 상태를 확인한다. 이전 상품 경고는 재수집 후 항목 자체가 줄어들 수 있다.
3. `www` DNS를 실제 호스팅 설정에 맞게 연결하고 인증서·대표 도메인 리디렉션을 확인한다. 현재 apex HTTPS는 정상이나 www는 해석되지 않았다.
4. 소유한 스마트스토어·블로그·유튜브 소개의 공식 웹사이트 주소와 판매자명을 일치시킨다. 실제로 소유하지 않은 계정이나 외부 게시물은 수정하지 않았다.
5. 검증된 상품별 외경·패킹 구성·현재 가격·배송/반품 조건이 확보되면 유용한 독립 상품 상세 페이지를 설계한다. 같은 문구만 바꾼 규격별 대량 페이지나 임의 Merchant Center 피드는 생성하지 않는다.

## 성과 확인 기준

현재값은 Search Console 내보내기 전까지 비워 두고, 배포 직전 28일과 이후 기간을 비교한다. 노출이 적으면 더 긴 기간을 사용한다. 순위 변화 하나로 효과를 단정하지 않고 클릭·문의·실제 구매를 함께 본다.

| 의도 | 대표 검색어 예시 | 목적 페이지 | 관찰할 결과 |
| --- | --- | --- | --- |
| 판매점 찾기 | 아파트샵, 황소밴드 아파트샵 | 홈페이지·기업정보 | 브랜드 노출/클릭, 문의 |
| 규격 선택 | 황소밴드 규격, 누수밴드 규격 선택 | 새 선택 가이드 | 검색 노출/클릭, 제품목록 이동·상담 |
| 제품 비교 | 황소밴드 싱글 더블, 공업용밴드 규격 | 가이드·제품소개 | 필요한 규격 구매 링크 선택 |
| 근거 확인 | 황소밴드 시험성적서, 황소밴드 특허 | 특허·시험자료 | 자료 페이지 방문과 관련 제품 문의 |
| 사용 흐름 | 황소밴드 사용방법 | 영상 페이지 | 영상 접근과 설치 문의 |

배포 후 1주에는 색인·실시간 응답·링크와 과거 경고 재수집 상태를 확인한다. 2–4주에는 Search Console의 Web 성과와 **Generative AI 성과 보고서**를 각각 확인한다. Bing Webmaster Tools의 AI Performance도 사용 가능한 데이터가 있으면 인용 페이지·주제를 참고한다. Bing Topics Portfolio는 베타·데이터 조건이 있으므로 제공 여부를 먼저 확인한다. 외부 구매 링크 클릭은 구매 완료와 다르며 별도 판매 데이터로 확인해야 한다. 자동 분석·추적 태그나 예약 작업을 임의로 설정하지 않았다.

## 공식 출처

- [Google AI 최적화 가이드 — 2026-07-10](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
- [Google AI 콘텐츠 지침 — 2026-10-01](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [사람을 위한 콘텐츠 — 2026-10-05](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Organization 구조화 데이터 — 2026-09-08](https://developers.google.com/search/docs/appearance/structured-data/organization)
- [Google 변경 내역 — 2026-11-09까지](https://developers.google.com/search/updates)
- [Search 생성형 AI 포함 제어](https://support.google.com/webmasters/answer/16908024)
- [생성형 AI 성과 보고서 발표 — 2026-06-03](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports)
- [영상 구조화 데이터](https://developers.google.com/search/docs/appearance/structured-data/video)
- [robots 및 이미지 미리보기 제어](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
- [Bing Topics Portfolio — 2026-10-13](https://blogs.bing.com/webmaster/2026/10/introducing-topics-portfolio-beta-in-ai-performance/)
- [OpenAI 검색·학습 크롤러 구분](https://developers.openai.com/api/docs/bots)
