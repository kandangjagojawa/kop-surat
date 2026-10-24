document.addEventListener('DOMContentLoaded', () => {
    // Referensi Elemen Input Form
    const logoInput = document.getElementById('logoInput');
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
    const sliderAlamat = document.getElementById('sliderAlamat');
    const sliderMaster = document.getElementById('sliderMaster');

    const valInstansi = document.getElementById('valInstansi');
    const valAlamat = document.getElementById('valAlamat');
    const valMaster = document.getElementById('valMaster');

    // Referensi Output Preview Kop
    const logoWrapper = document.getElementById('logoWrapper');
    const logoImg = document.getElementById('logoImg');
    const kopInstansi = document.getElementById('kopInstansi');
    const kopAlamat = document.getElementById('kopAlamat');

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
        // Menghapus spasi reguler antar aksara sesuai kaidah Scripto Continua
        return aksaraStr.replace(/\s+/g, '');
    }

    // Fungsi Render Utama Kop Surat
    function renderKop() {
        // 1. Nama Instansi
        const rawInstansi = inputInstansi.value.trim();
        const aksaraInstansi = applyScriptoContinua(transliterateText(rawInstansi));
        kopInstansi.textContent = aksaraInstansi;

        // 2. Mode Penulisan Alamat (Aksara Jawa vs Huruf Latin)
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
            // Format Alamat Latin
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
            // Format Alamat Aksara Jawa dengan Kaidah Skenario
            kopAlamat.className = 'kop-alamat font-ngayogyann';

            let resultAksara = '';

            // Alamat Jalan & No.
            if (alamatVal) {
                resultAksara += applyScriptoContinua(transliterateText(alamatVal));
            }

            // RT. (꧈ꦌꦂ꧈ꦠꦺ꧈)
            if (rtVal) {
                resultAksara += '꧈ꦌꦂ꧈ꦠꦺ꧈' + applyScriptoContinua(transliterateText(rtVal));
            }

            // RW. (꧈ꦌꦂ꧈ꦮꦺ)
            if (rwVal) {
                resultAksara += '꧈ꦌꦂ꧈ꦮꦺ' + applyScriptoContinua(transliterateText(rwVal));
            }

            // Kelurahan (꧈ꦏꦼꦭ꧀꧇)
            if (kelVal) {
                resultAksara += '꧈ꦏꦼꦭ꧀꧇' + applyScriptoContinua(transliterateText(kelVal));
            }

            // Kecamatan (꧈ꦏꦼꦕ꧀꧇)
            if (kecVal) {
                resultAksara += '꧈ꦏꦼꦕ꧀꧇' + applyScriptoContinua(transliterateText(kecVal));
            }

            // Kota/Kabupaten (Lingsa ꧈ di awal)
            if (kotaVal) {
                resultAksara += '꧈' + applyScriptoContinua(transliterateText(kotaVal));
            }

            // Provinsi (Lingsa ꧈ di awal, dengan proteksi singkatan seperti DIY)
            if (provVal) {
                // Jika input berupa singkatan kapital (misal DIY)
                if (/^[A-Z]{2,}$/.test(provVal)) {
                    resultAksara += '꧈' + applyScriptoContinua(transliterateText(provVal));
                } else {
                    resultAksara += '꧈' + applyScriptoContinua(transliterateText(provVal));
                }
            }

            // Kode Pos
            if (posVal) {
                resultAksara += '꧈' + applyScriptoContinua(transliterateText(posVal));
            }

            kopAlamat.textContent = resultAksara;
        }

        // 3. Pengaturan Ukuran Font & Slider Constraints
        let instansiSize = parseInt(sliderInstansi.value, 10);
        let alamatSize = parseInt(sliderAlamat.value, 10);

        // Constraint: Ukuran Alamat tidak boleh melebihi ukuran Instansi
        if (alamatSize > instansiSize) {
            alamatSize = instansiSize;
            sliderAlamat.value = alamatSize;
        }

        const masterScale = parseInt(sliderMaster.value, 10) / 100;

        // Update display angka slider
        valInstansi.textContent = instansiSize;
        valAlamat.textContent = alamatSize;
        valMaster.textContent = sliderMaster.value;

        // Terapkan Ukuran ke Element Kop
        kopInstansi.style.fontSize = `${instansiSize * masterScale}pt`;
        kopAlamat.style.fontSize = `${alamatSize * masterScale}pt`;
    }

    // Handler Upload Logo
    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoImg.src = event.target.result;
                logoWrapper.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            logoWrapper.style.display = 'none';
            logoImg.src = '';
        }
    });

    // Event Listeners pada Input Form
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
    sliderAlamat.addEventListener('input', renderKop);
    sliderMaster.addEventListener('input', renderKop);

    // Navigasi & Cetak
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
