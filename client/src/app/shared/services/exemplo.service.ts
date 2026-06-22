import { EntityService } from '@/core/services/entity.service';
import { Injectable } from '@angular/core';
import { Exemplo } from '../models/exemplo.model';

@Injectable({
    providedIn: 'root'
})
/**
 * @summary Serviço modelo para Exemplo. Renomeie para a sua entidade.
 * @description Fornece acesso ao endpoint `/api/exemplo`.
 */
export class ExemploService extends EntityService<Exemplo> {
    constructor() {
        super('exemplo');
    }
}
