import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/blog-contabilidad/',
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        articulos: 'articulos.html',
        cuentas_por_cobrar: 'cuentas-por-cobrar.html',
        herramientas_calculadoras: 'herramientas-calculadoras.html',
        metodos_estimacion: 'metodos-estimacion.html',
        nif_b10_inflacion: 'nif-b10-inflacion.html',
        privacidad: 'privacidad.html',
        provision_incobrables: 'provision-incobrables.html',
        sobre_nosotros: 'sobre-nosotros.html',
        terminos: 'terminos.html',
        calculadora_isr: 'calculadora-isr.html',
      },
    },
  },
});
