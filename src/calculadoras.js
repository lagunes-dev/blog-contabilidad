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

    // --- 2. Statistical Analysis Logic (5 years + Std Dev + Confidence Interval) ---
    const btnStat = document.getElementById('btn-calc-stat');
    const statPanel = document.getElementById('stat-justification');
    const statText = document.getElementById('stat-text');
    const statError = document.getElementById('stat-error');
    const statsAdvanced = document.getElementById('stats-advanced');

    const years = [2021, 2022, 2023, 2024, 2025];

    if (btnStat) {
        btnStat.addEventListener('click', () => {
            // Hide previous errors
            if (statError) { statError.classList.add('hidden'); statError.textContent = ''; }

            // Collect data from 5 years
            const data = years.map(year => ({
                year,
                v: parseFloat(document.getElementById(`h-v-${year}`)?.value) || 0,
                i: parseFloat(document.getElementById(`h-i-${year}`)?.value) || 0
            }));

            // Validate: no negative values
            const hasNegative = data.some(d => d.v < 0 || d.i < 0);
            if (hasNegative) {
                if (statError) {
                    statError.textContent = '⚠ No se permiten valores negativos. Revisa los campos marcados.';
                    statError.classList.remove('hidden');
                }
                // Highlight negative inputs
                years.forEach(year => {
                    const vInput = document.getElementById(`h-v-${year}`);
                    const iInput = document.getElementById(`h-i-${year}`);
                    if (vInput && parseFloat(vInput.value) < 0) vInput.classList.add('border-red-400', 'bg-red-50');
                    else if (vInput) vInput.classList.remove('border-red-400', 'bg-red-50');
                    if (iInput && parseFloat(iInput.value) < 0) iInput.classList.add('border-red-400', 'bg-red-50');
                    else if (iInput) iInput.classList.remove('border-red-400', 'bg-red-50');
                });
                return;
            }

            // Clear red borders
            years.forEach(year => {
                const vInput = document.getElementById(`h-v-${year}`);
                const iInput = document.getElementById(`h-i-${year}`);
                if (vInput) vInput.classList.remove('border-red-400', 'bg-red-50');
                if (iInput) iInput.classList.remove('border-red-400', 'bg-red-50');
            });

            // Filter only years with valid sales > 0
            const validData = data.filter(d => d.v > 0);

            if (validData.length < 2) {
                if (statError) {
                    statError.textContent = '⚠ Ingresa datos de ventas válidos (mayores a 0) para al menos 2 periodos.';
                    statError.classList.remove('hidden');
                }
                return;
            }

            const totalVentas = validData.reduce((acc, curr) => acc + curr.v, 0);
            const totalInco = validData.reduce((acc, curr) => acc + curr.i, 0);

            // Calculate per-year percentages
            const percentages = validData.map(d => (d.i / d.v) * 100);

            // Average percentage
            const avgPorc = percentages.reduce((a, b) => a + b, 0) / percentages.length;

            // Sample Standard Deviation (n-1 for sample)
            const n = percentages.length;
            const variance = percentages.reduce((acc, p) => acc + Math.pow(p - avgPorc, 2), 0) / (n - 1);
            const stdDev = Math.sqrt(variance);

            // Confidence Interval at 95% using t-distribution
            // t-values for 95% CI (two-tailed) by degrees of freedom (n-1)
            const tValues = { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262 };
            const df = n - 1;
            const tVal = tValues[df] || 1.96; // fallback to z for large samples
            const marginOfError = tVal * (stdDev / Math.sqrt(n));
            const ciLow = Math.max(0, avgPorc - marginOfError);
            const ciHigh = avgPorc + marginOfError;

            // Set the percentage in the main calculator
            if (porcInput) {
                porcInput.value = avgPorc.toFixed(2);
            }

            // Show justification text
            if (statPanel && statText) {
                statPanel.classList.remove('hidden');
                statText.innerHTML = `Basado en un historial de <strong>${validData.length} periodos</strong> con <strong>$${totalVentas.toLocaleString()}</strong> en ventas frente a <strong>$${totalInco.toLocaleString()}</strong> en pérdidas reales, el promedio estadístico de incobrabilidad es del <strong>${avgPorc.toFixed(2)}%</strong> (σ = ${stdDev.toFixed(2)}%). Este valor es el que se presupuesta para el nuevo ejercicio.`;
            }

            // Show advanced stats panel
            if (statsAdvanced) {
                statsAdvanced.classList.remove('hidden');
                const statAvg = document.getElementById('stat-avg');
                const statStd = document.getElementById('stat-std');
                const statCi = document.getElementById('stat-ci');
                const statCiNote = document.getElementById('stat-ci-note');

                if (statAvg) statAvg.textContent = avgPorc.toFixed(2) + '%';
                if (statStd) statStd.textContent = stdDev.toFixed(2) + '%';
                if (statCi) statCi.textContent = `[${ciLow.toFixed(2)}% — ${ciHigh.toFixed(2)}%]`;
                if (statCiNote) statCiNote.textContent = `Intervalo de confianza al 95% (t de Student, gl=${df}, t=${tVal.toFixed(3)}). Basado en ${n} periodos con datos válidos.`;
            }

            // Trigger calculation update
            calculateProvision();
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

    // --- 4. Depreciation Calculator (Línea Recta) ---
    const depCosto = document.getElementById('calc-dep-costo');
    const depRescate = document.getElementById('calc-dep-rescate');
    const depVida = document.getElementById('calc-dep-vida');
    const resDepVal = document.getElementById('txt-dep-val');
    const resDepDetail = document.getElementById('txt-dep-detail');
    const depError = document.getElementById('dep-error');
    let lastDepValue = 0;

    function calculateDepreciacion() {
        if (!depCosto || !depRescate || !depVida || !resDepVal) return;
        
        const costo = parseFloat(depCosto.value) || 0;
        const rescate = parseFloat(depRescate.value) || 0;
        const vida = parseFloat(depVida.value) || 0;
        
        // Reset styles
        depCosto.classList.remove('border-red-400', 'bg-red-50');
        depRescate.classList.remove('border-red-400', 'bg-red-50');
        depVida.classList.remove('border-red-400', 'bg-red-50');
        if (depError) {
            depError.classList.add('hidden');
            depError.textContent = '';
        }

        if (costo === 0 && rescate === 0 && vida === 0) {
            if (resDepVal.innerText !== '$0.00') {
                animateValue(resDepVal, lastDepValue, 0, 600);
                lastDepValue = 0;
            }
            if (resDepDetail) resDepDetail.innerText = '';
            return;
        }

        let hasError = false;
        
        if (costo <= 0) {
            depCosto.classList.add('border-red-400', 'bg-red-50');
            hasError = true;
        }
        if (vida <= 0) {
            depVida.classList.add('border-red-400', 'bg-red-50');
            hasError = true;
        }
        if (rescate >= costo && costo > 0) {
            depRescate.classList.add('border-red-400', 'bg-red-50');
            hasError = true;
            if (depError) {
                depError.textContent = '⚠ El valor de rescate debe ser menor al costo original.';
                depError.classList.remove('hidden');
            }
        }

        if (hasError) return;

        const montoDepreciable = costo - rescate;
        const depAnual = montoDepreciable / vida;
        const depMensual = depAnual / 12;
        const tasa = (1 / vida) * 100;

        if (depAnual !== lastDepValue) {
            animateValue(resDepVal, lastDepValue, depAnual, 600);
            lastDepValue = depAnual;
        }

        if (resDepDetail) {
            resDepDetail.innerText = `Depreciación Mensual: ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(depMensual)} | Tasa: ${tasa.toFixed(2)}%`;
        }
    }

    if (depCosto && depRescate && depVida) {
        depCosto.addEventListener('input', calculateDepreciacion);
        depRescate.addEventListener('input', calculateDepreciacion);
        depVida.addEventListener('input', calculateDepreciacion);
    }

    // --- 5. Interest Rate Converter ---
    const tasaTipo = document.getElementById('calc-tasa-tipo');
    const tasaValInput = document.getElementById('calc-tasa-val');
    const tasaFrec = document.getElementById('calc-tasa-frec');
    const resTasaVal = document.getElementById('txt-tasa-res');
    const resTasaDetail = document.getElementById('txt-tasa-detail');
    const tasaError = document.getElementById('tasa-error');
    const labelTasaInput = document.getElementById('label-tasa-input');

    function animateRateValue(obj, start, end, duration) {
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            const currentVal = (easeOutProgress * (end - start) + start);
            
            obj.innerText = currentVal.toFixed(4) + '%';
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerText = end.toFixed(4) + '%';
            }
        };
        window.requestAnimationFrame(step);
    }

    let lastTasaValue = 0;

    function calculateTasa() {
        if (!tasaTipo || !tasaValInput || !tasaFrec || !resTasaVal) return;

        const tipo = tasaTipo.value;
        const val = parseFloat(tasaValInput.value) || 0;
        const m = parseInt(tasaFrec.value) || 12;

        tasaValInput.classList.remove('border-red-400', 'bg-red-50');
        if (tasaError) {
            tasaError.classList.add('hidden');
            tasaError.textContent = '';
        }

        // Update Label
        if (labelTasaInput) {
            labelTasaInput.textContent = tipo === 'nom-to-eff' ? 'Tasa Nominal (%)' : 'Tasa Efectiva Anual (%)';
        }

        if (val === 0) {
            if (resTasaVal.innerText !== '0.00%') {
                animateRateValue(resTasaVal, lastTasaValue, 0, 400);
                lastTasaValue = 0;
            }
            if (resTasaDetail) resTasaDetail.innerText = '';
            return;
        }

        if (val < 0) {
            tasaValInput.classList.add('border-red-400', 'bg-red-50');
            if (tasaError) {
                tasaError.textContent = '⚠ Ingresa una tasa válida mayor a 0.';
                tasaError.classList.remove('hidden');
            }
            return;
        }

        let resultado = 0;
        let detail = '';

        if (tipo === 'nom-to-eff') {
            // j = nominal rate as decimal
            const j = val / 100;
            // i = effective rate
            const i = Math.pow(1 + (j / m), m) - 1;
            resultado = i * 100;
            detail = `Tasa Efectiva Equivalente`;
        } else {
            // i = effective rate as decimal
            const i = val / 100;
            // j = nominal rate
            const j = m * (Math.pow(1 + i, 1 / m) - 1);
            resultado = j * 100;
            detail = `Tasa Nominal Equivalente`;
        }

        if (resultado !== lastTasaValue) {
            animateRateValue(resTasaVal, lastTasaValue, resultado, 600);
            lastTasaValue = resultado;
        }

        if (resTasaDetail) {
            resTasaDetail.innerText = detail;
        }
    }

    if (tasaTipo && tasaValInput && tasaFrec) {
        tasaTipo.addEventListener('change', calculateTasa);
        tasaValInput.addEventListener('input', calculateTasa);
        tasaFrec.addEventListener('change', calculateTasa);
    }
});
