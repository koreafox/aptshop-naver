/**
 * 구조화된 데이터(Structured Data) 생성 모듈
 * 네이버 검색 결과에 이미지 카드 표시를 위한 Schema.org JSON-LD 생성
 */

const StructuredData = {
    /**
     * JSON-LD 스크립트를 페이지에 추가
     */
    addToPage(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data, null, 2);
        document.head.appendChild(script);
    },

    /**
     * 제품 스키마 생성
     */
    createProductSchema(product) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images || [],
            "brand": {
                "@type": "Brand",
                "name": "황소밴드"
            },
            "manufacturer": {
                "@type": "Organization",
                "name": "아파트샵",
                "url": "https://aptshop.kr"
            },
            "offers": {
                "@type": product.offerType || "Offer",
                "url": product.url,
                "priceCurrency": "KRW",
                "availability": "https://schema.org/InStock",
                "seller": {
                    "@type": "Organization",
                    "name": "아파트샵"
                }
            },
            "category": product.category || "파이프 누수보수"
        };

        // AggregateOffer인 경우 lowPrice, highPrice, offerCount 추가
        if (product.offerType === "AggregateOffer") {
            schema.offers.lowPrice = product.lowPrice;
            schema.offers.highPrice = product.highPrice;
            schema.offers.offerCount = product.offerCount;
        } else if (product.price) {
            // 단일 Offer인 경우 price 추가
            schema.offers.price = product.price;
        }

        // aggregateRating 추가 (있는 경우)
        if (product.aggregateRating) {
            schema.aggregateRating = {
                "@type": "AggregateRating",
                "ratingValue": product.aggregateRating.ratingValue,
                "reviewCount": product.aggregateRating.reviewCount
            };
        }

        // review 추가 (있는 경우)
        if (product.reviews && product.reviews.length > 0) {
            schema.review = product.reviews.map(review => ({
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": review.rating
                },
                "author": {
                    "@type": "Person",
                    "name": review.author
                },
                "reviewBody": review.body
            }));
        }

        return schema;
    },

    /**
     * 제품 목록 스키마 생성 (ItemList)
     */
    createProductListSchema(products) {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "image": product.image,
                    "url": product.url,
                    "brand": {
                        "@type": "Brand",
                        "name": "황소밴드"
                    }
                }
            }))
        };
    },

    /**
     * 이미지 객체 스키마 생성
     */
    createImageObjectSchema(images) {
        if (!Array.isArray(images)) {
            images = [images];
        }

        return images.map(img => ({
            "@context": "https://schema.org",
            "@type": "ImageObject",
            "contentUrl": img.url,
            "name": img.name,
            "description": img.description,
            "caption": img.caption || img.name,
            "representativeOfPage": img.representative || false
        }));
    },

    /**
     * 인증서 스키마 생성
     */
    createCertificationSchema(certifications) {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "아파트샵",
            "description": "황소밴드 공식 온라인 판매점",
            "url": "https://aptshop.kr",
            "hasCredential": certifications.map(cert => ({
                "@type": "EducationalOccupationalCredential",
                "name": cert.name,
                "credentialCategory": cert.category,
                "recognizedBy": {
                    "@type": "Organization",
                    "name": cert.issuer
                },
                "image": cert.image
            }))
        };
    },

    /**
     * 웹페이지 스키마 생성
     */
    createWebPageSchema(pageInfo) {
        return {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": pageInfo.name,
            "description": pageInfo.description,
            "url": pageInfo.url,
            "mainEntity": pageInfo.mainEntity || null,
            "breadcrumb": pageInfo.breadcrumb || null,
            "image": pageInfo.images || []
        };
    },

    /**
     * 빵부스러기 네비게이션 스키마 생성
     */
    createBreadcrumbSchema(items) {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
    }
};

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StructuredData;
}
