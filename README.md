# 아파트샵 - GitHub Pages 설정

이 저장소는 `aptshop.kr` 도메인을 위한 GitHub Pages 사이트입니다.

## 🚀 GitHub Pages 설정 방법

### 1. GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit: GitHub Pages setup"
git branch -M main
git remote add origin https://github.com/koreafox/aptshop-naver.git
git push -u origin main
```

### 2. GitHub Pages 활성화
1. GitHub 저장소로 이동: https://github.com/koreafox/aptshop-naver
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서:
   - Branch: `main` 선택
   - Folder: `/ (root)` 선택
   - **Save** 클릭

### 3. 커스텀 도메인 설정
1. 같은 Pages 설정 페이지에서
2. **Custom domain** 입력란에 `aptshop.kr` 입력
3. **Save** 클릭
4. **Enforce HTTPS** 체크박스 활성화 (DNS 전파 후)

### 4. DNS 레코드 업데이트

현재 DNS 설정을 GitHub Pages용으로 변경해야 합니다:

#### 옵션 1: A 레코드 사용 (권장)
기존 A 레코드를 GitHub Pages IP로 변경:
```
A    @    185.199.108.153
A    @    185.199.109.153
A    @    185.199.110.153
A    @    185.199.111.153
```

#### 옵션 2: CNAME 레코드 사용
```
CNAME    www    koreafox.github.io
```

**중요**: DNS 변경 후 전파까지 최대 48시간 소요될 수 있습니다.

### 5. CNAME 파일 생성 (자동)
GitHub Pages 설정에서 커스텀 도메인을 입력하면 자동으로 `CNAME` 파일이 생성됩니다.
수동으로 생성하려면:
```bash
echo "aptshop.kr" > CNAME
git add CNAME
git commit -m "Add CNAME for custom domain"
git push
```

## 📝 네이버/구글 사이트 등록

### 네이버 서치어드바이저
1. https://searchadvisor.naver.com/ 접속
2. 사이트 등록 시 HTML 확인 메타태그 받기
3. `index.html`의 주석 처리된 부분에 메타태그 추가:
```html
<meta name="naver-site-verification" content="받은_확인코드">
```

### 구글 서치 콘솔
1. https://search.google.com/search-console 접속
2. 속성 추가 시 HTML 확인 메타태그 받기
3. `index.html`의 주석 처리된 부분에 메타태그 추가:
```html
<meta name="google-site-verification" content="받은_확인코드">
```

### 사이트맵 제출
- 네이버: `https://aptshop.kr/sitemap.xml`
- 구글: `https://aptshop.kr/sitemap.xml`

## 📂 파일 구조
```
aptshop-naver/
├── index.html      # 메인 페이지 (스마트스토어 리다이렉트)
├── robots.txt      # 검색엔진 크롤러 설정
├── sitemap.xml     # 사이트맵
├── CNAME           # 커스텀 도메인 설정 (GitHub Pages 자동 생성)
└── README.md       # 이 파일
```

## 🔍 작동 방식
1. 사용자가 `aptshop.kr` 접속
2. GitHub Pages가 `index.html` 제공
3. 메타 태그와 JavaScript로 즉시 스마트스토어로 리다이렉트
4. 검색엔진은 메타데이터를 크롤링하여 SEO 정보 수집

## ✅ 체크리스트
- [ ] GitHub에 코드 푸시
- [ ] GitHub Pages 활성화
- [ ] 커스텀 도메인 설정
- [ ] DNS 레코드 업데이트
- [ ] DNS 전파 확인 (https://dnschecker.org)
- [ ] HTTPS 활성화
- [ ] 네이버 사이트 등록
- [ ] 구글 사이트 등록
- [ ] 사이트맵 제출

## 🌐 링크
- 스마트스토어: https://smartstore.naver.com/aptshop7/
- GitHub 저장소: https://github.com/koreafox/aptshop-naver
- 도메인: https://aptshop.kr
