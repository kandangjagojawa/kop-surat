document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Referensi Elemen Modal Pop-up Cara Penulisan
    // -------------------------------------------------------------
    const btnOpenGuide = document.getElementById('btnOpenGuide');
    const btnCloseGuide = document.getElementById('btnCloseGuide');
    const modalGuide = document.getElementById('modalGuide');

    // Otomatis Tampilkan Modal Pop-up saat Pertama Kali Akses
    if (modalGuide) {
        modalGuide.style.display = 'flex';
    }

    if (btnOpenGuide && modalGuide) {
        btnOpenGuide.addEventListener('click', () => {
            modalGuide.style.display = 'flex';
        });
    }

    if (btnCloseGuide && modalGuide) {
        btnCloseGuide.addEventListener('click', () => {
            modalGuide.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalGuide) {
            modalGuide.style.display = 'none';
        }
    });

    // -------------------------------------------------------------
    // 2. Referensi Elemen Asisten Dropdown Karakter
    // -------------------------------------------------------------
    const toggleAssist = document.getElementById('toggleAssist');
    const assistDropdown = document.getElementById('assistDropdown');
    let activeInputForAssist = null;
    let targetCharIndex = -1;

    // Map Aksara Murda & Swara untuk Label Dropdown
    const MURDA_MAP = {
        'n': 'ꦟ', 'k': 'ꦑ', 't': 'ꦡ', 's': 'ꦯ', 'p': 'ꦦ', 'g': 'ꦓ', 'b': 'ꦨ', 'j': 'ꦙ',
        'N': 'ꦟ', 'K': 'ꦑ', 'T': 'ꦡ', 'S': 'ꦯ', 'P': 'ꦦ', 'G': 'ꦓ', 'B': 'ꦨ', 'J': 'ꦙ'
    };

    const SWARA_MAP_SHOW = {
        'a': 'ꦄ', 'i': 'ꦆ', 'u': 'ꦈ', 'o': 'ꦎ',
        'A': 'ꦄ', 'I': 'ꦆ', 'U': 'ꦈ', 'O': 'ꦎ'
    };

    // -------------------------------------------------------------
    // 3. Referensi Input Form & Logo
    // -------------------------------------------------------------
    const logoInput = document.getElementById('logoInput');
    const btnRemoveLogo = document.getElementById('btnRemoveLogo');
    const selectLogoRatio = document.getElementById('selectLogoRatio');
    const inputInstansi = document.getElementById('inputInstansi');
    const inputAlamat = document.getElementById('inputAlamat');
    const inputRT = document.getElementById('inputRT');
    const inputRW = document.getElementById('inputRW');
    const inputKelurahan = document.getElementById('inputKelurahan');
    const inputKecamatan = document.getElementById('inputKecamatan');
    const inputKota = document.getElementById('inputKota');
    const inputProvinsi = document.getElementById('inputProvinsi');
    const inputKodePos = document.getElementById('inputKodePos');

    const inputElements = [
        inputInstansi, inputAlamat, inputRT, inputRW,
        inputKelurahan, inputKecamatan, inputKota, inputProvinsi, inputKodePos
    ];

    // -------------------------------------------------------------
    // 4. Referensi Radio & Sliders
    // -------------------------------------------------------------
    const radioModeAlamat = document.getElementsByName('modeAlamat');
    const sliderInstansi = document.getElementById('sliderInstansi');
    const sliderGapInstansi = document.getElementById('sliderGapInstansi');
    const sliderAlamat = document.getElementById('sliderAlamat');
    const sliderLineHeightAlamat = document.getElementById('sliderLineHeightAlamat');
    const sliderGapAlamat = document.getElementById('sliderGapAlamat');
    const sliderMaster = document.getElementById('sliderMaster');

    const valInstansi = document.getElementById('valInstansi');
    const valGapInstansi = document.getElementById('valGapInstansi');
    const valAlamat = document.getElementById('valAlamat');
    const valLineHeightAlamat = document.getElementById('valLineHeightAlamat');
    const valGapAlamat = document.getElementById('valGapAlamat');
    const valMaster = document.getElementById('valMaster');

    // -------------------------------------------------------------
    // 5. Referensi Output Preview Kop
    // -------------------------------------------------------------
    const logoWrapper = document.getElementById('logoWrapper');
    const logoImg = document.getElementById('logoImg');
    const kopText = document.getElementById('kopText');
    const kopInstansi = document.getElementById('kopInstansi');
    const kopAlamat = document.getElementById('kopAlamat');
    const kopDivider = document.getElementById('kopDivider');

    // Referensi Tombol
    const btnPreview = document.getElementById('btnPreview');
    const btnPrint = document.getElementById('btnPrint');
    const btnPrint2 = document.getElementById('btnPrint2');
    const btnEdit = document.getElementById('btnEdit');
    const controlPanel = document.getElementById('controlPanel');
    const previewActions = document.getElementById('previewActions');

    // -------------------------------------------------------------
    // 6. Fungsi Transliterasi & Helper
    // -------------------------------------------------------------
    function transliterateText(text) {
        if (!text) return '';

        // Pre-processing Khusus Singkatan KAPITAL (2 Huruf atau lebih)
        // Memeriksa dwihuruf seperti DH, TH, NY, NG dalam singkatan tanpa spasi
        let processedText = text.replace(/\b[A-Z]{2,}\b/g, (match) => {
            let result = '';
            let i = 0;
            while (i < match.length) {
                let sub2 = match.substr(i, 2);
                if (sub2 === 'DH') {
                    result += 'ꦣ꧈';
                    i += 2;
                } else if (sub2 === 'TH') {
                    result += 'ꦛ꧈';
                    i += 2;
                } else if (sub2 === 'NY') {
                    result += 'ꦚ꧈';
                    i += 2;
                } else if (sub2 === 'NG') {
                    result += 'ꦔ꧈';
                    i += 2;
                } else if (sub2 === 'KH') {
                    result += 'ꦑ꧈';
                    i += 2;
                } else if (sub2 === 'SH') {
                    result += 'ꦯ꧈';
                    i += 2;
                } else {
                    result += match[i];
                    i += 1;
                }
            }
            return result;
        });

        if (typeof window.transliterasiKalimat === 'function') {
            return window.transliterasiKalimat(processedText);
        }
        return processedText;
    }

    function applyScriptoContinua(aksaraStr) {
        if (!aksaraStr) return '';
        return aksaraStr.replace(/\s+/g, '');
    }

    // Fungsi Penyesuaian Visual Scale untuk Layar HP/Tablet Kecil
    function adjustMobileScale() {
        const pageA4 = document.getElementById('pageA4');
        const previewContainer = document.querySelector('.preview-container');
        if (!pageA4 || !previewContainer) return;

        const screenWidth = window.innerWidth;
        const a4WidthPx = pageA4.offsetWidth; // Standar 210mm (~794px)

        if (screenWidth < 834) {
            const padding = 32;
            const availableWidth = screenWidth - padding;
            const scale = availableWidth / a4WidthPx;

            pageA4.style.transform = `scale(${scale})`;
            previewContainer.style.height = `${pageA4.offsetHeight * scale}px`;
        } else {
            pageA4.style.transform = 'none';
            previewContainer.style.height = 'auto';
        }
    }

    // -------------------------------------------------------------
    // 7. Logika Asisten Dropdown Transliterasi
    // -------------------------------------------------------------
    function hideAssistDropdown() {
        if (assistDropdown) {
            assistDropdown.style.display = 'none';
            assistDropdown.innerHTML = '';
        }
        activeInputForAssist = null;
        targetCharIndex = -1;
    }

    function showAssistDropdown(inputEl, options) {
        if (!assistDropdown) return;

        activeInputForAssist = inputEl;
        assistDropdown.innerHTML = '';

        options.forEach((opt) => {
            const optDiv = document.createElement('div');
            optDiv.className = 'assist-option';
            optDiv.innerHTML = `<span>${opt.label}</span><span class="aksara-badge">${opt.aksara}</span>`;
            
            optDiv.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Mencegah input kehilangan fokus
                replaceCharacterInInput(inputEl, targetCharIndex, opt.value);
                hideAssistDropdown();
            });

            assistDropdown.appendChild(optDiv);
        });

        const rect = inputEl.getBoundingClientRect();
        assistDropdown.style.left = `${rect.left + window.scrollX}px`;
        assistDropdown.style.top = `${rect.bottom + window.scrollY + 4}px`;
        assistDropdown.style.width = `${Math.max(rect.width, 200)}px`;
        assistDropdown.style.display = 'flex';
    }

    function replaceCharacterInInput(inputEl, index, newStr) {
        const val = inputEl.value;
        if (index < 0 || index >= val.length) return;

        const before = val.substring(0, index);
        const after = val.substring(index + 1);
        inputEl.value = before + newStr + after;

        const newCursorPos = index + newStr.length;
        inputEl.setSelectionRange(newCursorPos, newCursorPos);

        renderKop();
    }

    function handleInputAssist(e) {
        if (!toggleAssist || !toggleAssist.checked) {
            hideAssistDropdown();
            return;
        }

        const inputEl = e.target;
        const cursorPos = inputEl.selectionStart;
        if (cursorPos === 0) {
            hideAssistDropdown();
            return;
        }

        const typedIndex = cursorPos - 1;
        const char = inputEl.value[typedIndex];
        if (!char) {
            hideAssistDropdown();
            return;
        }

        targetCharIndex = typedIndex;
        const lowerChar = char.toLowerCase();
        let options = [];

        // 1. Kasus Karakter D / d (Termasuk Singkatan DH)
        if (char === 'D') {
            options = [
                { label: 'D (Singkatan Da)', value: 'D', aksara: 'ꦢ' },
                { label: 'DH (Singkatan Dha / Murda)', value: 'DH', aksara: 'ꦣ' }
            ];
        } else if (char === 'd') {
            options = [
                { label: 'd (Nga-lugu / Biasa)', value: 'd', aksara: 'ꦢ' },
                { label: 'dh (Murni / Pasangan)', value: 'dh', aksara: 'ꦝ' },
                { label: 'DH (Singkatan Dha)', value: 'DH', aksara: 'ꦣ' }
            ];
        } 
        // 2. Kasus Karakter e / é (taling/pepet)
        else if (lowerChar === 'e' || char === 'é' || char === 'è') {
            options = [
                { label: 'e (Pepet / e biasa)', value: 'e', aksara: 'ꦼ' },
                { label: "é / e' (Taling)", value: "e'", aksara: 'ꦺ' }
            ];
        } 
        // 3. Kasus Aksara Murda
        else if (MURDA_MAP[char]) {
            const lower = char.toLowerCase();
            const upper = char.toUpperCase();

            options = [
                { label: `${lower} (Aksara Biasa)`, value: lower, aksara: transliterateText(lower) },
                { label: `${upper} (Aksara Murda)`, value: upper, aksara: MURDA_MAP[upper] }
            ];
        } 
        // 4. Kasus Aksara Swara
        else if (SWARA_MAP_SHOW[char]) {
            const lower = char.toLowerCase();
            const upper = char.toUpperCase();

            options = [
                { label: `${lower} (Vokal Biasa)`, value: lower, aksara: transliterateText(lower) },
                { label: `${upper} (Aksara Swara)`, value: upper, aksara: SWARA_MAP_SHOW[upper] }
            ];
        }

        if (options.length > 0) {
            showAssistDropdown(inputEl, options);
        } else {
            hideAssistDropdown();
        }
    }

    inputElements.forEach(el => {
        el.addEventListener('keyup', handleInputAssist);
        el.addEventListener('click', handleInputAssist);
        el.addEventListener('blur', () => {
            setTimeout(hideAssistDropdown, 200);
        });
    });

    window.addEventListener('scroll', hideAssistDropdown);

    // -------------------------------------------------------------
    // 8. Fungsi Utama Render Kop Surat
    // -------------------------------------------------------------
    function renderKop() {
        // 1. Render Nama Instansi
        const rawInstansi = inputInstansi.value.trim();
        const aksaraInstansi = applyScriptoContinua(transliterateText(rawInstansi));
        kopInstansi.textContent = aksaraInstansi;

        // 2. Render Alamat (Aksara vs Latin)
        let modeAlamat = 'aksara';
        for (const radio of radioModeAlamat) {
            if (radio.checked) {
                modeAlamat = radio.value;
                break;
            }
        }

        const alamatVal = inputAlamat.value.trim();
        const rtVal = inputRT.value.trim();
        const rwVal = inputRW.value.trim();
        const kelVal = inputKelurahan.value.trim();
        const kecVal = inputKecamatan.value.trim();
        const kotaVal = inputKota.value.trim();
        const provVal = inputProvinsi.value.trim();
        const posVal = inputKodePos.value.trim();

        if (modeAlamat === 'latin') {
            kopAlamat.className = 'kop-alamat';
            let parts = [];
            if (alamatVal) parts.push(alamatVal);
            if (rtVal || rwVal) {
                let rtrw = '';
                if (rtVal) rtrw += `RT. ${rtVal}`;
                if (rwVal) rtrw += `${rtrw ? ' / ' : ''}RW. ${rwVal}`;
                parts.push(rtrw);
            }
            if (kelVal) parts.push(`Kel. ${kelVal}`);
            if (kecVal) parts.push(`Kec. ${kecVal}`);
            if (kotaVal) parts.push(kotaVal);
            if (provVal) parts.push(provVal);
            if (posVal) parts.push(posVal);

            kopAlamat.textContent = parts.join(', ');
        } else {
            kopAlamat.className = 'kop-alamat font-ngayogyann';
            let resultAksara = '';

            if (alamatVal) resultAksara += applyScriptoContinua(transliterateText(alamatVal));
            if (rtVal) resultAksara += '꧈ꦌꦂ꧈ꦠꦺ꧈' + applyScriptoContinua(transliterateText(rtVal));
            if (rwVal) resultAksara += '꧈ꦌꦂ꧈ꦮꦺ' + applyScriptoContinua(transliterateText(rwVal));
            if (kelVal) resultAksara += '꧈ꦏꦼꦭ꧀꧇' + applyScriptoContinua(transliterateText(kelVal));
            if (kecVal) resultAksara += '꧈ꦏꦼꦕ꧀꧇' + applyScriptoContinua(transliterateText(kecVal));
            if (kotaVal) resultAksara += '꧈' + applyScriptoContinua(transliterateText(kotaVal));
            if (provVal) resultAksara += '꧈' + applyScriptoContinua(transliterateText(provVal));
            if (posVal) resultAksara += '꧈' + applyScriptoContinua(transliterateText(posVal));

            kopAlamat.textContent = resultAksara;
        }

        // 3. Ambil Nilai Slider Awal
        let instansiSize = parseInt(sliderInstansi.value, 10);
        let alamatSize = parseInt(sliderAlamat.value, 10);

        if (alamatSize > instansiSize) {
            alamatSize = instansiSize;
            sliderAlamat.value = alamatSize;
        }

        let rawMasterPercent = parseInt(sliderMaster.value, 10);
        let masterScale = rawMasterPercent / 100;
        const gapInstansiVal = parseInt(sliderGapInstansi.value, 10);
        const lineHeightAlamatVal = parseFloat(sliderLineHeightAlamat.value);
        const gapAlamatVal = parseInt(sliderGapAlamat.value, 10);

        kopInstansi.style.marginBottom = `${gapInstansiVal}px`;
        kopAlamat.style.lineHeight = lineHeightAlamatVal;
        kopDivider.style.marginTop = `${gapAlamatVal}px`;

        // 4. Pembatasan Master Scale & Font Size Berdasarkan Margin Kertas
        const availableWidth = kopText.clientWidth;

        let targetInstansiPt = instansiSize * masterScale;
        let targetAlamatPt = alamatSize * masterScale;

        kopInstansi.style.fontSize = `${targetInstansiPt}pt`;
        kopAlamat.style.fontSize = `${targetAlamatPt}pt`;

        let isOverflowing = () => {
            return (kopInstansi.scrollWidth > availableWidth) || (kopAlamat.scrollWidth > availableWidth);
        };

        if (isOverflowing() && masterScale > 0.5) {
            while (isOverflowing() && masterScale > 0.5) {
                masterScale -= 0.01;
                targetInstansiPt = instansiSize * masterScale;
                targetAlamatPt = alamatSize * masterScale;
                kopInstansi.style.fontSize = `${targetInstansiPt}pt`;
                kopAlamat.style.fontSize = `${targetAlamatPt}pt`;
            }

            const clampedMasterPercent = Math.max(70, Math.floor(masterScale * 100));
            sliderMaster.value = clampedMasterPercent;
            valMaster.textContent = clampedMasterPercent;
        } else {
            valMaster.textContent = rawMasterPercent;
        }

        while (kopInstansi.scrollWidth > availableWidth && targetInstansiPt > 8) {
            targetInstansiPt -= 0.5;
            kopInstansi.style.fontSize = `${targetInstansiPt}pt`;
        }
        
        let fittedInstansiVal = Math.floor(targetInstansiPt / masterScale);
        if (fittedInstansiVal < parseInt(sliderInstansi.value, 10)) {
            sliderInstansi.value = fittedInstansiVal;
            valInstansi.textContent = fittedInstansiVal;
        } else {
            valInstansi.textContent = instansiSize;
        }

        while (kopAlamat.scrollWidth > availableWidth && targetAlamatPt > 6) {
            targetAlamatPt -= 0.5;
            kopAlamat.style.fontSize = `${targetAlamatPt}pt`;
        }

        let fittedAlamatVal = Math.floor(targetAlamatPt / masterScale);
        if (fittedAlamatVal < parseInt(sliderAlamat.value, 10)) {
            sliderAlamat.value = fittedAlamatVal;
            valAlamat.textContent = fittedAlamatVal;
        } else {
            valAlamat.textContent = alamatSize;
        }

        valGapInstansi.textContent = gapInstansiVal;
        valLineHeightAlamat.textContent = lineHeightAlamatVal;
        valGapAlamat.textContent = gapAlamatVal;

        // Sesuaikan skala visual untuk HP
        adjustMobileScale();
    }

    // -------------------------------------------------------------
    // 9. Event Handler Logo & Rasio
    // -------------------------------------------------------------
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoImg.src = event.target.result;
                logoWrapper.style.display = 'flex';
                if (btnRemoveLogo) btnRemoveLogo.style.display = 'inline-block';
                requestAnimationFrame(() => {
                    renderKop();
                });
            };
            reader.readAsDataURL(file);
        } else {
            logoWrapper.style.display = 'none';
            logoImg.src = '';
            if (btnRemoveLogo) btnRemoveLogo.style.display = 'none';
            requestAnimationFrame(() => {
                renderKop();
            });
        }
    });

    if (btnRemoveLogo) {
        btnRemoveLogo.addEventListener('click', () => {
            logoInput.value = '';
            logoImg.src = '';
            logoWrapper.style.display = 'none';
            btnRemoveLogo.style.display = 'none';
            requestAnimationFrame(() => {
                renderKop();
            });
        });
    }

    selectLogoRatio.addEventListener('change', (e) => {
        const ratio = e.target.value;
        logoWrapper.className = 'logo-wrapper';
        if (ratio === '3:4') {
            logoWrapper.classList.add('ratio-3-4');
        } else if (ratio === '4:3') {
            logoWrapper.classList.add('ratio-4-3');
        } else {
            logoWrapper.classList.add('ratio-1-1');
        }
        requestAnimationFrame(() => {
            renderKop();
        });
    });

    // -------------------------------------------------------------
    // 10. Event Listener Input Form, Sliders & Navigation
    // -------------------------------------------------------------
    inputElements.forEach(el => {
        el.addEventListener('input', renderKop);
    });

    for (const radio of radioModeAlamat) {
        radio.addEventListener('change', renderKop);
    }

    sliderInstansi.addEventListener('input', renderKop);
    sliderGapInstansi.addEventListener('input', renderKop);
    sliderAlamat.addEventListener('input', renderKop);
    sliderLineHeightAlamat.addEventListener('input', renderKop);
    sliderGapAlamat.addEventListener('input', renderKop);
    sliderMaster.addEventListener('input', renderKop);

    btnPreview.addEventListener('click', () => {
        controlPanel.style.display = 'none';
        previewActions.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnEdit.addEventListener('click', () => {
        controlPanel.style.display = 'block';
        previewActions.style.display = 'none';
    });

    const triggerPrint = () => {
        window.print();
    };

    btnPrint.addEventListener('click', triggerPrint);
    btnPrint2.addEventListener('click', triggerPrint);

    window.addEventListener('resize', adjustMobileScale);

    // Initial Render
    renderKop();
});
