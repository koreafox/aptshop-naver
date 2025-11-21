# 구조화된 데이터(Structured Data) 가이드

## 개요

네이버 검색 결과에 이미지 카드가 표시되도록 Schema.org의 JSON-LD 형식으로 구조화된 데이터를 추가했습니다.

## 적용된 페이지

### 1. 메인 페이지 (index.html)

#### Organization Schema
- 회사 정보 (아파트샵)
- 로고 이미지
- **5개 대표 이미지**:
  1. `product_single_type.jpg` - 황소밴드 싱글
  2. `product_double_type.png` - 황소밴드 더블
  3. `product_all_type.jpg` - 황소밴드 호스밴드
  4. `intro_prod5.png` - 특허등록
  5. `intro_prod4.png` - 안전클립
- 연락처 정보
- 네이버 스마트스토어 링크

#### ImageObject ItemList
- 5개 이미지에 대한 상세 정보
- 각 이미지의 이름, 설명, 캡션 포함

#### Open Graph 메타 태그
- 5개 대표 이미지를 og:image로 추가
- SNS 공유 시 이미지 표시

### 2. 제품 페이지 (menu/products.html)

#### CollectionPage Schema
- 제품 컬렉션 페이지 정보

#### Product ItemList
- 싱글밴드, 더블밴드, 공업용밴드 제품 정보
- 각 제품의 이미지, 브랜드, 제조사, 판매 정보 포함

### 3. 인증 페이지 (menu/certifications.html)

#### Organization Schema with Credentials
- 특허 인증 (특허 제 10-1424730호)
- 벤처기업 인증 (제 20160103780호)
- 인증서 이미지 포함

#### ImageGallery Schema
- 5개 인증서 이미지:
  1. `cert_1.jpg` - 벤처기업 인증서
  2. `cert_2.jpg` - 특허증
  3. `cert_3.jpg` - 조달청 벤처나라 지정증서
  4. `cert_4.jpg` - KTC 토크 시험성적서
  5. `cert_5.jpg` - KTC 내압 시험성적서

## 네이버 검색 최적화 효과

### 1. 이미지 카드 표시
- 검색 결과에 제품 이미지가 카드 형태로 표시
- 시각적으로 눈에 띄어 클릭률(CTR) 향상

### 2. 리치 스니펫
- 제품 정보, 가격, 재고 상태 등이 검색 결과에 표시
- 사용자에게 더 많은 정보 제공

### 3. 신뢰도 향상
- 인증서 및 특허 정보가 검색 결과에 표시
- 공식 판매점으로서의 신뢰도 강화

## 검증 방법

### 1. Google Rich Results Test
```
https://search.google.com/test/rich-results
```
- URL 입력: `https://aptshop.kr`
- 구조화된 데이터 오류 확인

### 2. Schema Markup Validator
```
https://validator.schema.org/
```
- URL 입력 또는 코드 직접 붙여넣기
- Schema.org 표준 준수 확인

### 3. 네이버 서치어드바이저
```
https://searchadvisor.naver.com/
```
- 사이트 등록 및 소유권 확인
- 검색 결과 미리보기 확인

## 유지보수

### 이미지 변경 시
1. `/img/` 폴더에 새 이미지 업로드
2. `index.html`의 Schema 업데이트:
   - Organization의 `image` 배열
   - ItemList의 `contentUrl`
   - Open Graph의 `og:image`

### 제품 추가 시
1. `menu/products.html`의 ItemList에 새 제품 추가
2. 제품 이미지, 이름, 설명, URL 포함

### 인증서 추가 시
1. `menu/certifications.html`의 ImageGallery에 추가
2. 인증서 이미지, 이름, 발급기관 정보 포함

## 주의사항

### 이미지 요구사항
- **최소 해상도**: 1200 x 675px (권장)
- **형식**: JPG, PNG, WebP
- **파일 크기**: 1MB 이하 권장
- **비율**: 16:9 또는 4:3

### Schema.org 규칙
- 모든 필수 속성 포함
- 유효한 URL 사용
- 정확한 정보 제공 (허위 정보 금지)

### 네이버 가이드라인
- 대표 이미지는 최대 5개까지 권장
- 이미지는 실제 제품/서비스와 관련된 것만 사용
- 로고나 텍스트만 있는 이미지는 피하기

## 추가 개선 사항

### 향후 추가 가능한 Schema
1. **FAQPage** - 자주 묻는 질문
2. **HowTo** - 설치 방법 가이드
3. **Review** - 고객 리뷰
4. **Video** - 제품 소개 영상
5. **BreadcrumbList** - 페이지 경로

### 모니터링
- 네이버 서치어드바이저에서 주기적으로 확인
- 검색 노출 및 클릭률 추적
- 구조화된 데이터 오류 확인

## 참고 자료

- [Schema.org 공식 문서](https://schema.org/)
- [Google 구조화된 데이터 가이드](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [네이버 검색 최적화 가이드](https://searchadvisor.naver.com/guide)
