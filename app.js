document.addEventListener('DOMContentLoaded', () => {
    // Referensi Elemen Input Form
    const logoInput = document.getElementById('logoInput');
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

    // Referensi Radio & Sliders
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

    // Referensi Output Preview Kop
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

    // Function Transliterasi Aksara Jawa menggunakan sriwedari-skt.js
    function transliterateText(text) {
        if (!text) return '';
        if (typeof window.transliterasiKalimat === 'function') {
            return window.transliterasiKalimat(text);
        }
        return text;
    }

    // Pemrosesan Scripto Continua (Tanpa Spasi antar kata)
    function applyScriptoContinua(aksaraStr) {
        if (!aksaraStr) return '';
        return aksaraStr.replace(/\s+/g, '');
    }

    // Fungsi Utama Render Kop Surat
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

        // 3. Terapkan Nilai Slider Spasi & Ukuran
        let instansiSize = parseInt(sliderInstansi.value, 10);
        let alamatSize = parseInt(sliderAlamat.value, 10);

        // Batas: Ukuran font alamat tidak boleh melebihi ukuran instansi
        if (alamatSize > instansiSize) {
            alamatSize = instansiSize;
            sliderAlamat.value = alamatSize;
        }

        const masterScale = parseInt(sliderMaster.value, 10) / 100;
        const gapInstansiVal = parseInt(sliderGapInstansi.value, 10);
        const lineHeightAlamatVal = parseFloat(sliderLineHeightAlamat.value);
        const gapAlamatVal = parseInt(sliderGapAlamat.value, 10);

        // Terapkan spasi vertikal
        kopInstansi.style.marginBottom = `${gapInstansiVal}px`;
        kopAlamat.style.lineHeight = lineHeightAlamatVal;
        kopDivider.style.marginTop = `${gapAlamatVal}px`;

        // Update nilai teks slider
        valInstansi.textContent = instansiSize;
        valGapInstansi.textContent = gapInstansiVal;
        valAlamat.textContent = alamatSize;
        valLineHeightAlamat.textContent = lineHeightAlamatVal;
        valGapAlamat.textContent = gapAlamatVal;
        valMaster.textContent = sliderMaster.value;

        // Terapkan ukuran font awal
        let targetInstansiPt = instansiSize * masterScale;
        let targetAlamatPt = alamatSize * masterScale;

        kopInstansi.style.fontSize = `${targetInstansiPt}pt`;
        kopAlamat.style.fontSize = `${targetAlamatPt}pt`;

        // 4. Pembatasan Otomatis Ukuran Font Agar Tidak Melebihi Margin Kertas
        const availableWidth = kopText.clientWidth;

        // Cek dan kunci batas horizontal Nama Instansi (harus 1 baris)
        while (kopInstansi.scrollWidth > availableWidth && targetInstansiPt > 8) {
            targetInstansiPt -= 0.5;
            kopInstansi.style.fontSize = `${targetInstansiPt}pt`;
        }
        
        // Sesuaikan nilai slider jika font tertekan oleh batas margin
        let fittedInstansiVal = Math.floor(targetInstansiPt / masterScale);
        if (fittedInstansiVal < parseInt(sliderInstansi.value, 10)) {
            sliderInstansi.value = fittedInstansiVal;
            valInstansi.textContent = fittedInstansiVal;
        }

        // Cek dan kunci batas horizontal Alamat
        while (kopAlamat.scrollWidth > availableWidth && targetAlamatPt > 6) {
            targetAlamatPt -= 0.5;
            kopAlamat.style.fontSize = `${targetAlamatPt}pt`;
        }

        let fittedAlamatVal = Math.floor(targetAlamatPt / masterScale);
        if (fittedAlamatVal < parseInt(sliderAlamat.value, 10)) {
            sliderAlamat.value = fittedAlamatVal;
            valAlamat.textContent = fittedAlamatVal;
        }
    }

    // Handler Logo & Rasio
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoImg.src = event.target.result;
                logoWrapper.style.display = 'flex';
                renderKop();
            };
            reader.readAsDataURL(file);
        } else {
            logoWrapper.style.display = 'none';
            logoImg.src = '';
            renderKop();
        }
    });

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
        renderKop();
    });

    // Event Listeners Input & Slider
    const inputElements = [
        inputInstansi, inputAlamat, inputRT, inputRW,
        inputKelurahan, inputKecamatan, inputKota, inputProvinsi, inputKodePos
    ];

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

    // Navigasi Preview & Print
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

    // Initial Render
    renderKop();
});
