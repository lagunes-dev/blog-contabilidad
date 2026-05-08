import fs from 'fs';
import path from 'path';

const htmlFiles = [
    'index.html', 'articulos.html', 'calculadora-isr.html', 
    'cuentas-por-cobrar.html', 'guia-usuario.html', 'herramientas-calculadoras.html', 
    'metodos-estimacion.html', 'nif-b10-inflacion.html', 'privacidad.html', 
    'provision-incobrables.html', 'sobre-nosotros.html', 'terminos.html'
];

const desktopOld = `                                <a href="calculadora-isr.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Calculadora ISR 2026</span>
                                        <span class="block text-xs text-gray-500">Personas Físicas y Morales</span>
                                    </div>
                                </a>`;

const desktopNew = `                                <a href="calculadora-isr.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Calculadora ISR 2026</span>
                                        <span class="block text-xs text-gray-500">Personas Físicas y Morales</span>
                                    </div>
                                </a>
                                <a href="calculadora-depreciacion.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Depreciación Línea Recta</span>
                                        <span class="block text-xs text-gray-500">Activos fijos (NIF C-6)</span>
                                    </div>
                                </a>
                                <a href="conversor-tasas.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Conversor de Tasas</span>
                                        <span class="block text-xs text-gray-500">Nominal y Efectiva (NIIF 9)</span>
                                    </div>
                                </a>`;

const mobileOld = `<a href="calculadora-isr.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Calculadora ISR 2026</a>`;

const mobileNew = `<a href="calculadora-isr.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Calculadora ISR 2026</a>
                        <a href="calculadora-depreciacion.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Depreciación Línea Recta</a>
                        <a href="conversor-tasas.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Conversor de Tasas</a>`;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes(desktopOld)) {
        content = content.replace(desktopOld, desktopNew);
        changed = true;
    }
    
    if (content.includes(mobileOld)) {
        content = content.replace(mobileOld, mobileNew);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log(`✅ Updated: ${file}`);
    } else {
        console.log(`⏩ Skipped (no match): ${file}`);
    }
});
