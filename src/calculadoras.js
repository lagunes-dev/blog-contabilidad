// Logic for Calculators

document.addEventListener('DOMContentLoaded', () => {
    // Function to animate a value counting up or down
    function animateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOutProgress * (end - start) + start);
            
            obj.innerText = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(currentVal);
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerText = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(end);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- 1. Provisión / Estimación Calculator ---
    const ventasInput = document.getElementById('calc-ventas');
    const porcInput = document.getElementById('calc-porc');
    const resProvVal = document.getElementById('txt-prov-val');
    let lastProvValue = 0;

    function calculateProvision() {
        if (!ventasInput || !porcInput || !resProvVal) return;
        
        const ventas = parseFloat(ventasInput.value) || 0;
        const porc = parseFloat(porcInput.value) || 0;
        const provision = ventas * (porc / 100);
        
        if (provision !== lastProvValue) {
            animateValue(resProvVal, lastProvValue, provision, 600);
            lastProvValue = provision;
        }
    }

    if (ventasInput && porcInput) {
        ventasInput.addEventListener('input', calculateProvision);
        porcInput.addEventListener('input', calculateProvision);
    }

    // --- 2. Statistical Analysis Logic ---
    const btnStat = document.getElementById('btn-calc-stat');
    const statPanel = document.getElementById('stat-justification');
    const statText = document.getElementById('stat-text');

    if (btnStat) {
        btnStat.addEventListener('click', () => {
            const data = [
                { v: parseFloat(document.getElementById('h-v-2023').value) || 0, i: parseFloat(document.getElementById('h-i-2023').value) || 0 },
                { v: parseFloat(document.getElementById('h-v-2024').value) || 0, i: parseFloat(document.getElementById('h-i-2024').value) || 0 },
                { v: parseFloat(document.getElementById('h-v-2025').value) || 0, i: parseFloat(document.getElementById('h-i-2025').value) || 0 }
            ];

            const totalVentas = data.reduce((acc, curr) => acc + curr.v, 0);
            const totalInco = data.reduce((acc, curr) => acc + curr.i, 0);

            if (totalVentas > 0) {
                const avgPorc = (totalInco / totalVentas) * 100;
                porcInput.value = avgPorc.toFixed(2);
                
                // Show justification with calculated data
                if (statPanel && statText) {
                    statPanel.classList.remove('hidden');
                    statText.innerHTML = `Relación técnica confirmada: Basado en un historial de <strong>$${totalVentas.toLocaleString()}</strong> en ventas frente a <strong>$${totalInco.toLocaleString()}</strong> en pérdidas reales, el promedio estadístico de incobrabilidad es del <strong>${avgPorc.toFixed(2)}%</strong>. Este valor es el que se presupuesta para el nuevo ejercicio.`;
                }
                
                // Trigger calculation update
                calculateProvision();
            } else {
                alert("Por favor ingresa datos históricos válidos para calcular el promedio.");
            }
        });
    }

    // --- 3. ISR Calculator (Independent Page) ---
    const regimenSelect = document.getElementById('calc-regimen');
    const ingresoInput = document.getElementById('calc-ingreso');
    const resIsrVal = document.getElementById('txt-isr-val');
    const resIsrDetail = document.getElementById('txt-isr-detail');
    let lastIsrValue = 0;

    function calculateISR() {
        if (!regimenSelect || !ingresoInput || !resIsrVal) return;
        
        const regimen = regimenSelect.value;
        const ingreso = parseFloat(ingresoInput.value) || 0;
        let isr = 0;
        let detail = '';

        if (ingreso > 0) {
            if (regimen === 'moral') {
                isr = ingreso * 0.30;
                detail = 'Tasa corporativa fija del 30%';
            } else {
                const tarifasMensuales2026 = [
                    { limInf: 0.01, limSup: 893.55, cuotaFija: 0.00, porc: 0.0192 },
                    { limInf: 893.56, limSup: 7598.46, cuotaFija: 17.15, porc: 0.0640 },
                    { limInf: 7598.47, limSup: 13328.40, cuotaFija: 446.26, porc: 0.1088 },
                    { limInf: 13328.41, limSup: 15487.71, cuotaFija: 1069.56, porc: 0.1600 },
                    { limInf: 15487.72, limSup: 18585.25, cuotaFija: 1415.05, porc: 0.1792 },
                    { limInf: 18585.26, limSup: 37464.75, cuotaFija: 1970.12, porc: 0.2136 },
                    { limInf: 37464.76, limSup: 59057.26, cuotaFija: 6003.49, porc: 0.2352 },
                    { limInf: 59057.27, limSup: 112322.05, cuotaFija: 11082.90, porc: 0.3000 },
                    { limInf: 112322.06, limSup: 149508.40, cuotaFija: 27062.33, porc: 0.3200 },
                    { limInf: 149508.41, limSup: 448525.20, cuotaFija: 38961.96, porc: 0.3400 },
                    { limInf: 448525.21, limSup: Infinity, cuotaFija: 140627.67, porc: 0.3500 }
                ];
                const tarifa = tarifasMensuales2026.find(t => ingreso >= t.limInf && ingreso <= t.limSup);
                if (tarifa) {
                    const excedente = ingreso - tarifa.limInf;
                    isr = tarifa.cuotaFija + (excedente * tarifa.porc);
                    detail = `Cuota ($${tarifa.cuotaFija.toFixed(2)}) + Exc. al ${(tarifa.porc*100).toFixed(2)}%`;
                }
            }
        }

        if (isr !== lastIsrValue) {
            animateValue(resIsrVal, lastIsrValue, isr, 600);
            lastIsrValue = isr;
        }
        if (resIsrDetail) resIsrDetail.innerText = detail ? '*' + detail : '';
    }

    if (ingresoInput && regimenSelect) {
        ingresoInput.addEventListener('input', calculateISR);
        regimenSelect.addEventListener('change', calculateISR);
    }
});
