import { Injectable } from '@angular/core';

/**
 * @author Marcelo M. de Castro
 * @summary Serviço para geração de payload PIX no padrão EMV/BRCode.
 * Segue a especificação do Banco Central do Brasil para QR Codes estáticos.
 * @see https://www.bcb.gov.br/content/estabilidadefinanceira/forumpireunioes/AnexoI-PadsroesBRCode.pdf
 */
@Injectable({ providedIn: 'root' })
export class PixService {

    /**
     * Gera o payload completo do PIX no padrão EMV para QR Code estático.
     * @param chave Chave PIX (e-mail, CPF, telefone ou chave aleatória)
     * @param nome Nome do recebedor (máx. 25 caracteres)
     * @param cidade Cidade do recebedor (máx. 15 caracteres)
     * @param valor Valor da transação (opcional)
     * @param descricao Descrição/identificador da transação (opcional, máx. 25 caracteres)
     */
    gerarPayload(
        chave: string,
        nome: string,
        cidade: string,
        valor?: number,
        descricao?: string
    ): string {
        const payload: string[] = [];

        // [00] Payload Format Indicator
        payload.push(this.montarCampo('00', '01'));

        // [26] Merchant Account Information (PIX)
        const merchantAccount: string[] = [];
        // [00] GUI - identificador do arranjo de pagamento
        merchantAccount.push(this.montarCampo('00', 'br.gov.bcb.pix'));
        // [01] Chave PIX
        merchantAccount.push(this.montarCampo('01', chave));
        // [02] Descrição (opcional)
        if (descricao) {
            merchantAccount.push(this.montarCampo('02', descricao.substring(0, 25)));
        }
        payload.push(this.montarCampo('26', merchantAccount.join('')));

        // [52] Merchant Category Code
        payload.push(this.montarCampo('52', '0000'));

        // [53] Transaction Currency (986 = BRL)
        payload.push(this.montarCampo('53', '986'));

        // [54] Transaction Amount (opcional)
        if (valor && valor > 0) {
            payload.push(this.montarCampo('54', valor.toFixed(2)));
        }

        // [58] Country Code
        payload.push(this.montarCampo('58', 'BR'));

        // [59] Merchant Name (máx. 25 caracteres)
        payload.push(this.montarCampo('59', this.sanitizar(nome).substring(0, 25)));

        // [60] Merchant City (máx. 15 caracteres)
        payload.push(this.montarCampo('60', this.sanitizar(cidade).substring(0, 15)));

        // [62] Additional Data Field Template
        const additionalData = this.montarCampo('05', '***');
        payload.push(this.montarCampo('62', additionalData));

        // [63] CRC16 - será calculado sobre todo o payload
        const payloadSemCRC = payload.join('') + '6304';
        const crc = this.calcularCRC16(payloadSemCRC);
        payload.push(this.montarCampo('63', crc));

        return payload.join('');
    }

    /**
     * Monta um campo TLV (Tag-Length-Value) conforme padrão EMV.
     */
    private montarCampo(id: string, valor: string): string {
        const tamanho = valor.length.toString().padStart(2, '0');
        return `${id}${tamanho}${valor}`;
    }

    /**
     * Remove acentos e caracteres especiais para compatibilidade.
     */
    private sanitizar(texto: string): string {
        return texto
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();
    }

    /**
     * Calcula o CRC-16/CCITT-FALSE conforme especificação EMV.
     * Polinômio: 0x1021, valor inicial: 0xFFFF
     */
    private calcularCRC16(payload: string): string {
        let crc = 0xFFFF;
        const polinomio = 0x1021;

        for (let i = 0; i < payload.length; i++) {
            crc ^= (payload.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = ((crc << 1) ^ polinomio) & 0xFFFF;
                } else {
                    crc = (crc << 1) & 0xFFFF;
                }
            }
        }

        return crc.toString(16).toUpperCase().padStart(4, '0');
    }
}
