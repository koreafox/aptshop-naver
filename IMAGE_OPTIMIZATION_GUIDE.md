# 🖼️ 이미지 최적화 가이드

## 현재 상태 분석

### 문제점
1. **외부 도메인 이미지 사용**: `hsband.kr`에서 제품 이미지 로드
2. **WebP 미사용**: JPG/PNG 포맷으로 용량 큼
3. **반응형 이미지 미적용**: 모든 디바이스에 동일한 크기 전송

---

## 📋 Step 1: 이미지 다운로드 및 정리

### 현재 사용 중인 외부 이미지
```
https://hsband.kr/web/product/medium/201701/66_shop1_680043.jpg (싱글밴드)
https://hsband.kr/web/product/medium/201701/71_shop1_204314.jpg (더블밴드)
https://hsband.kr/web/product/medium/201701/18_shop1_393985.jpg (공업용밴드)
```

### 작업 순서
```bash
# 1. 이미지 다운로드
cd /Users/fox/aptshop-naver/img
curl -O https://hsband.kr/web/product/medium/201701/66_shop1_680043.jpg
curl -O https://hsband.kr/web/product/medium/201701/71_shop1_204314.jpg
curl -O https://hsband.kr/web/product/medium/201701/18_shop1_393985.jpg

# 2. 파일명 변경 (SEO 친화적)
mv 66_shop1_680043.jpg product_single_band.jpg
mv 71_shop1_204314.jpg product_double_band.jpg
mv 18_shop1_393985.jpg product_industrial_band.jpg
```

---

## 🔄 Step 2: WebP 변환

### 방법 1: 온라인 도구 사용
- [Squoosh](https://squoosh.app/) - Google 제공
- [CloudConvert](https://cloudconvert.com/jpg-to-webp)

### 방법 2: 커맨드 라인 (추천)

#### macOS 설치
```bash
brew install webp
```

#### 변환 명령어
```bash
cd /Users/fox/aptshop-naver/img

# 단일 파일 변환 (품질 80%)
cwebp -q 80 product_single_band.jpg -o product_single_band.webp

# 전체 파일 일괄 변환
for file in *.jpg; do
  cwebp -q 80 "$file" -o "${file%.jpg}.webp"
done

for file in *.png; do
  cwebp -q 80 "$file" -o "${file%.png}.webp"
done
```

#### 반응형 이미지 생성 (여러 크기)
```bash
# 320px, 640px, 1024px 버전 생성
for size in 320 640 1024; do
  sips -Z $size product_single_band.jpg --out product_single_band_${size}w.jpg
  cwebp -q 80 product_single_band_${size}w.jpg -o product_single_band_${size}w.webp
done
```

---

## 📝 Step 3: HTML 코드 업데이트

### 기본 WebP 적용
```html
<!-- 기존 -->
<img src="https://hsband.kr/web/product/medium/201701/66_shop1_680043.jpg" 
     alt="황소밴드 싱글밴드">

<!-- WebP 적용 (폴백 포함) -->
<picture>
  <source srcset="https://aptshop.kr/img/product_single_band.webp" type="image/webp">
  <img src="https://aptshop.kr/img/product_single_band.jpg" 
       alt="황소밴드 싱글밴드"
       loading="lazy">
</picture>
```

### 반응형 이미지 적용
```html
<picture>
  <!-- WebP 반응형 -->
  <source 
    srcset="https://aptshop.kr/img/product_single_band_320w.webp 320w,
            https://aptshop.kr/img/product_single_band_640w.webp 640w,
            https://aptshop.kr/img/product_single_band_1024w.webp 1024w"
    sizes="(max-width: 640px) 100vw, 640px"
    type="image/webp">
  
  <!-- JPG 폴백 -->
  <source 
    srcset="https://aptshop.kr/img/product_single_band_320w.jpg 320w,
            https://aptshop.kr/img/product_single_band_640w.jpg 640w,
            https://aptshop.kr/img/product_single_band_1024w.jpg 1024w"
    sizes="(max-width: 640px) 100vw, 640px">
  
  <img src="https://aptshop.kr/img/product_single_band.jpg" 
       alt="황소밴드 싱글밴드"
       loading="lazy"
       width="640"
       height="480">
</picture>
```

---

## 🎯 Step 4: Lazy Loading 적용

### 기본 Lazy Loading
```html
<img src="image.jpg" alt="설명" loading="lazy">
```

### JavaScript로 고급 Lazy Loading
```javascript
// /js/lazy-load.js 생성
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});
```

```html
<!-- HTML에서 사용 -->
<img data-src="https://aptshop.kr/img/product.webp" 
     alt="제품" 
     class="lazy">
```

---

## 📊 예상 효과

### 용량 절감
- **JPG → WebP**: 30-50% 용량 감소
- **반응형 이미지**: 모바일에서 70% 용량 감소

### 성능 개선
- **Lighthouse 점수**: +20-30점
- **페이지 로드 속도**: 2-3초 단축
- **LCP (Largest Contentful Paint)**: 50% 개선

---

## 🔧 자동화 스크립트

### 이미지 최적화 자동화
```bash
#!/bin/bash
# optimize-images.sh

echo "🖼️  이미지 최적화 시작..."

# WebP 변환
for file in img/*.{jpg,jpeg,png}; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    name="${filename%.*}"
    
    echo "Converting: $filename"
    cwebp -q 80 "$file" -o "img/${name}.webp"
    
    # 반응형 버전 생성
    for size in 320 640 1024; do
      sips -Z $size "$file" --out "img/${name}_${size}w.${filename##*.}"
      cwebp -q 80 "img/${name}_${size}w.${filename##*.}" -o "img/${name}_${size}w.webp"
    done
  fi
done

echo "✅ 최적화 완료!"
```

### 실행 방법
```bash
chmod +x optimize-images.sh
./optimize-images.sh
```

---

## 📋 체크리스트

### 즉시 실행 가능
- [ ] WebP 도구 설치 (`brew install webp`)
- [ ] 외부 이미지 다운로드
- [ ] WebP 변환 실행
- [ ] HTML 코드 업데이트 (picture 태그)
- [ ] loading="lazy" 속성 추가

### 고급 최적화
- [ ] 반응형 이미지 생성 (320w, 640w, 1024w)
- [ ] Intersection Observer 구현
- [ ] 이미지 CDN 적용 (선택사항)
- [ ] 자동화 스크립트 작성

---

## 🚀 다음 단계

1. **즉시**: WebP 변환 및 기본 적용
2. **1주일 내**: 반응형 이미지 적용
3. **1개월 내**: CDN 도입 검토

**예상 작업 시간**: 2-4시간
**예상 효과**: 페이지 로드 속도 50% 개선
