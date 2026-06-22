'use strict';

const fs   = require('fs');
const path = require('path');

const svgPath  = path.resolve(__dirname, '../../client/src/assets/branding/icon-color.svg');
const svgB64   = Buffer.from(fs.readFileSync(svgPath)).toString('base64');
const logoUri  = `data:image/svg+xml;base64,${svgB64}`;

const BRAND_COLOR   = '#4F6EF7';
const BORDER_COLOR  = '#e2e8f0';
const TEXT_MUTED    = '#94a3b8';

const header = `
<div style="
  width: 100%;
  padding: 6px 20mm;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${BORDER_COLOR};
  font-size: 9px;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: ${TEXT_MUTED};
  box-sizing: border-box;
">
  <img src="${logoUri}" style="height:22px;width:22px;border-radius:5px;margin-right:9px;flex-shrink:0;">
  <span style="font-weight:700;color:${BRAND_COLOR};font-size:12px;">Controle de Contas</span>
  <span style="margin-left:auto;color:${TEXT_MUTED};">v1.0 &nbsp;|&nbsp; Maio/2026</span>
</div>`;

const footer = `
<div style="
  width: 100%;
  padding: 6px 20mm;
  display: flex;
  align-items: center;
  border-top: 1px solid ${BORDER_COLOR};
  font-size: 9px;
  font-family: 'Segoe UI', Arial, sans-serif;
  color: ${TEXT_MUTED};
  box-sizing: border-box;
">
  <span>© 2026 Controle de Contas. Todos os direitos reservados.</span>
  <span style="margin-left:auto;">
    Página <span class="pageNumber"></span> de <span class="totalPages"></span>
  </span>
</div>`;

module.exports = {
  stylesheet: path.resolve(__dirname, 'style.css'),
  pdf_options: {
    format: 'A4',
    margin: { top: '32mm', bottom: '24mm', left: '20mm', right: '20mm' },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: header,
    footerTemplate: footer,
  },
  marked_options: {
    smartypants: true,
  },
  launch_options: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};
