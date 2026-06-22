import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Exemplo } from '../../../shared/models/exemplo.model';
import { sharedConfig } from '@/shared/config/shared.config';
import { ExemploService } from '@/shared/services/exemplo.service';
import { EntityDetailComponent } from '@/core/components/entity-detail.component';
import { EntityService } from '@/core/services/entity.service';
import { FieldValidationMessageComponent } from "@/core/components/field-validation-message.component";

@Component({
    selector: 'app-exemplo-detail',
    imports: [...sharedConfig.imports, FieldValidationMessageComponent],
    templateUrl: './exemplo-detail.component.html',
    styles: [`
        .section-label {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.9px;
            color: var(--p-primary-color, #6366f1);
            opacity: 0.85;
        }
        .section-block {
            border-left: 3px solid var(--p-primary-color, #6366f1);
            padding-left: 0.85rem;
        }
        .field-label {
            display: block;
            font-size: 0.78rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--p-text-muted-color, #6b7280);
            margin-bottom: 0.3rem;
        }
    `],
    providers: [{ provide: EntityService, useClass: ExemploService }]
})
export class ExemploDetailComponent extends EntityDetailComponent<Exemplo> implements OnInit {

    fieldsLabels: { [key: string]: string } = {
        nome: 'Nome',
        descricao: 'Descrição'
    };

    constructor() {
        super({
            nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
            descricao: ['', [Validators.maxLength(500)]]
        });
    }

    ngOnInit(): void {
        // Inicialização adicional se necessário
    }
}
