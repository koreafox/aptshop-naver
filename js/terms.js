// 이용약관 및 개인정보처리방침 내용

const termsContent = `
<h3 class="text-lg font-bold mb-4">제1조 (목적)</h3>
<p class="mb-4">본 약관은 아파트샵(이하 "회사")이 운영하는 황소밴드 온라인 쇼핑몰(이하 "몰")에서 제공하는 인터넷 관련 서비스(이하 "서비스")를 이용함에 있어 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제2조 (정의)</h3>
<p class="mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>"몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.</li>
    <li>"이용자"란 "몰"에 접속하여 본 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
    <li>"회원"이라 함은 "몰"에 개인정보를 제공하여 회원등록을 한 자로서, "몰"의 정보를 지속적으로 제공받으며, "몰"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
    <li>"비회원"이라 함은 회원에 가입하지 않고 "몰"이 제공하는 서비스를 이용하는 자를 말합니다.</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제3조 (약관의 명시와 설명 및 개정)</h3>
<p class="mb-4">"몰"은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 전자우편주소, 사업자등록번호, 통신판매업 신고번호 등을 이용자가 쉽게 알 수 있도록 "몰"의 초기 서비스화면에 게시합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제4조 (서비스의 제공 및 변경)</h3>
<p class="mb-2">"몰"은 다음과 같은 업무를 수행합니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
    <li>구매계약이 체결된 재화 또는 용역의 배송</li>
    <li>기타 "몰"이 정하는 업무</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제5조 (서비스의 중단)</h3>
<p class="mb-4">"몰"은 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제6조 (회원가입)</h3>
<p class="mb-4">이용자는 "몰"이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제7조 (회원 탈퇴 및 자격 상실 등)</h3>
<p class="mb-4">회원은 "몰"에 언제든지 탈퇴를 요청할 수 있으며 "몰"은 즉시 회원탈퇴를 처리합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제8조 (개인정보보호)</h3>
<p class="mb-4">"몰"은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. "몰"은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제9조 (구매신청)</h3>
<p class="mb-4">"몰" 이용자는 "몰"상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, "몰"은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제10조 (계약의 성립)</h3>
<p class="mb-4">"몰"은 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.</p>

<p class="mt-8 text-xs text-gray-500">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
`;

const privacyContent = `
<h3 class="text-lg font-bold mb-4">제1조 (개인정보의 처리 목적)</h3>
<p class="mb-4">아파트샵(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>홈페이지 회원 가입 및 관리</li>
    <li>재화 또는 서비스 제공</li>
    <li>마케팅 및 광고에 활용</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제2조 (개인정보의 처리 및 보유기간)</h3>
<p class="mb-4">회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
<p class="mb-4">각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>홈페이지 회원 가입 및 관리: 회원 탈퇴 시까지</li>
    <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
    <li>전자상거래에서의 계약·청약철회, 대금결제, 재화 등 공급기록: 5년</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제3조 (처리하는 개인정보의 항목)</h3>
<p class="mb-4">회사는 다음의 개인정보 항목을 처리하고 있습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>필수항목: 성명, 생년월일, 아이디, 비밀번호, 주소, 전화번호, 이메일</li>
    <li>선택항목: 관심분야, 취미</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제4조 (개인정보의 제3자 제공)</h3>
<p class="mb-4">회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제5조 (개인정보처리의 위탁)</h3>
<p class="mb-4">회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>배송업무: 위탁받는 자(수탁자), 위탁하는 업무의 내용</li>
    <li>결제처리: 위탁받는 자(수탁자), 위탁하는 업무의 내용</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제6조 (정보주체의 권리·의무 및 행사방법)</h3>
<p class="mb-4">정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>개인정보 열람요구</li>
    <li>오류 등이 있을 경우 정정 요구</li>
    <li>삭제요구</li>
    <li>처리정지 요구</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제7조 (개인정보의 파기)</h3>
<p class="mb-4">회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</p>

<h3 class="text-lg font-bold mb-4 mt-6">제8조 (개인정보 보호책임자)</h3>
<p class="mb-4">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제를 처리하기 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>개인정보 보호책임자: 지상진</li>
    <li>연락처: 010-7357-8613</li>
    <li>이메일: aptshop7@naver.com</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제9조 (개인정보의 안전성 확보조치)</h3>
<p class="mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
<ul class="list-disc list-inside mb-4 space-y-2">
    <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
    <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
    <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
</ul>

<h3 class="text-lg font-bold mb-4 mt-6">제10조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h3>
<p class="mb-4">회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.</p>

<p class="mt-8 text-xs text-gray-500">본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</p>
`;

// 모달 열기/닫기 함수
function openTermsModal() {
    const modal = document.getElementById('terms-modal');
    const content = document.getElementById('terms-content');
    if (modal && content) {
        content.innerHTML = termsContent;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const content = document.getElementById('privacy-content');
    if (modal && content) {
        content.innerHTML = privacyContent;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// ESC 키로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTermsModal();
        closePrivacyModal();
    }
});

// 배경 클릭으로 모달 닫기
document.addEventListener('click', (e) => {
    if (e.target.id === 'terms-modal') {
        closeTermsModal();
    }
    if (e.target.id === 'privacy-modal') {
        closePrivacyModal();
    }
});
