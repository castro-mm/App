export interface ReplicarRegistroDaConta {
    mesOrigem: number;
    anoOrigem: number;
    mesDestino: number;
    anoDestino: number;
    idsDoRegistro?: number[];
    valoresOverride?: { [id: number]: number };
}
