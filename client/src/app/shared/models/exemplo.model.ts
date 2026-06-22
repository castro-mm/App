import { Entity } from "@/core/models/entity.model";

/// Modelo de entidade. Renomeie e adicione as propriedades do seu domínio.
export class Exemplo extends Entity {
    nome: string = '';
    descricao?: string;
}
