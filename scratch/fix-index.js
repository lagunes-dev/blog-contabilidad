import fs from 'fs';

// Fix index.html: navbar dropdown + hero subtitle update
let content = fs.readFileSync('index.html', 'utf8');

// 1. Apply navbar dropdown (same as the batch script did before)
const oldDesktopNav = `                        <a href="herramientas-calculadoras.html" class="text-gray-600 hover:text-brand-blue font-medium transition-colors border-b-2 border-transparent hover:border-brand-gold py-2">Herramientas</a>
                        <a href="calculadora-isr.html" class="text-gray-600 hover:text-brand-blue font-medium transition-colors border-b-2 border-transparent hover:border-brand-gold py-2">Calc. ISR</a>
                        <a href="guia-usuario.html" class="text-gray-600 hover:text-brand-blue font-medium transition-colors border-b-2 border-transparent hover:border-brand-gold py-2">Guía de Uso</a>`;

const newDesktopNav = `                        <div class="relative" id="dropdown-calculadoras">
                            <button id="btn-dropdown-calc" class="text-gray-600 hover:text-brand-blue font-medium transition-colors border-b-2 border-transparent hover:border-brand-gold py-2 inline-flex items-center gap-1 cursor-pointer">
                                Calculadoras
                                <svg class="w-4 h-4 transition-transform duration-200" id="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div id="dropdown-menu-calc" class="hidden absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 opacity-0 translate-y-1 transition-all duration-200">
                                <a href="herramientas-calculadoras.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Estimación Incobrables</span>
                                        <span class="block text-xs text-gray-500">Provisión y análisis estadístico</span>
                                    </div>
                                </a>
                                <a href="calculadora-isr.html" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                                    <div class="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                                        <svg class="w-4 h-4 text-brand-gold-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <span class="block text-sm font-semibold text-gray-800">Calculadora ISR 2026</span>
                                        <span class="block text-xs text-gray-500">Personas Físicas y Morales</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <a href="guia-usuario.html" class="text-gray-600 hover:text-brand-blue font-medium transition-colors border-b-2 border-transparent hover:border-brand-gold py-2">Guía de Uso</a>`;

const oldMobileNav = `                    <a href="herramientas-calculadoras.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Herramientas</a>
                    <a href="calculadora-isr.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Calculadora ISR</a>
                    <a href="guia-usuario.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Guía de Uso</a>`;

const newMobileNav = `                    <div class="border-t border-gray-100 pt-2 mt-2">
                        <p class="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Calculadoras</p>
                        <a href="herramientas-calculadoras.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Estimación Incobrables</a>
                        <a href="calculadora-isr.html" class="block px-3 py-2 pl-6 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Calculadora ISR 2026</a>
                    </div>
                    <a href="guia-usuario.html" class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50">Guía de Uso</a>`;

content = content.replace(oldDesktopNav, newDesktopNav);
content = content.replace(oldMobileNav, newMobileNav);

// 2. Update hero subtitle
const oldSubtitle = `Análisis experto, guías prácticas sobre NIIF, reformas tributarias y estrategias fiscales para profesionales y
          estudiantes.`;
const newSubtitle = `Serie de artículos enfocados en el tratamiento contable de las <strong>Cuentas por Cobrar e Incobrables</strong>, normativas NIIF 9, métodos de estimación y estrategias fiscales para profesionales y estudiantes.`;

content = content.replace(oldSubtitle, newSubtitle);

fs.writeFileSync('index.html', content);
console.log('✅ index.html updated (navbar + subtitle)');
