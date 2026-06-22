import { Component, OnInit } from '@angular/core';
import { Exemplo } from '../../shared/models/exemplo.model';
import { ExemploDetailComponent } from './detail/exemplo-detail.component';
import { BreadcrumbComponent } from "@/core/components/breadcrumb.component";
import { PageHeaderComponent } from "@/core/components/page-header.component";
import { ExemploParams } from '../../shared/params/exemplo.params';
import { sharedConfig } from '@/shared/config/shared.config';
import { ExemploService } from '@/shared/services/exemplo.service';
import { EntityService } from '@/core/services/entity.service';
import { EntityListComponent } from '@/core/components/entity-list.component';
import { TableListComponent } from '@/core/components/table-list.component';
import { TableColumn } from '@/core/types/table-column.type';

@Component({
    selector: 'app-exemplo',
    imports: [...sharedConfig.imports, BreadcrumbComponent, PageHeaderComponent, TableListComponent],
    templateUrl: './exemplo.component.html',
    styles: [`
        .section-label {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.9px;
            color: var(--p-primary-color, #6366f1);
            opacity: 0.85;
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
export class ExemploComponent extends EntityListComponent<Exemplo, ExemploParams, ExemploDetailComponent> implements OnInit {

    columns: TableColumn[] = [
        { field: 'id', header: '#', type: 'number', width: '2rem', sortable: true },
        { field: 'nome', header: 'Nome', type: 'text', width: '20rem', sortable: true },
        { field: 'descricao', header: 'Descrição', type: 'text', width: '30rem', sortable: false },
        { field: 'dataDeCriacao', header: 'Data de Criação', type: 'date', format: 'dd/MM/yyyy HH:mm:ss', width: '12rem', sortable: true },
        { field: 'dataDeAtualizacao', header: 'Data de Atualização', type: 'date', format: 'dd/MM/yyyy HH:mm:ss', width: '12rem', sortable: true },
    ];

    filterFields = ['id', 'nome', 'descricao'];

    constructor() {
        super({ nome: [''] }, ExemploDetailComponent, '25%');
    }

    ngOnInit(): void {
        this.listar();
    }
}
