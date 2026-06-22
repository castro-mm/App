import { Component, inject, input, output, TemplateRef, Type } from "@angular/core";
import { sharedConfig } from "../../shared/config/shared.config";
import { Entity } from "@/core/models/entity.model";
import { ModalService } from "@/core/services/modal.service";
import { MessagesService } from "@/core/services/messages.service";
import { ApiResponse } from "@/core/types/api-response.type";
import { StatusCode } from "@/core/objects/enums";
import { TableColumn } from "@/core/types/table-column.type";
import { CustomFormatPipe } from "../../shared/pipes/custom-format.pipe";
import { NestedFieldPipe } from "../../shared/pipes/nested-field.pipe";
import { DynamicFormatPipe } from "../../shared/pipes/dynamic-format.pipe";

@Component({
    selector: 'app-table-list',
    imports: [...sharedConfig.imports, CustomFormatPipe, NestedFieldPipe, DynamicFormatPipe],
    template: `
        <div style="border: 1px solid #e2e8f0; border-radius: 0.75rem; overflow: hidden;">
        <p-table        
            #dt
            [value]="this.entityList()"
            [columns]="cols()"
            [rows]="rows()"
            [paginator]="true"
            [globalFilterFields]="globalFilterFields()"
            [(selection)]="itensSelecionados"
            [rowHover]="true"
            dataKey="id"
            currentPageReportTemplate="{first} até {last} de {totalRecords} registros"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 20, 30]"
            size="small"
            [loading]="isLoading()"
            [loadingIcon]="'pi pi-spinner pi-spin'"
            [scrollable]="true"
            scrollDirection="horizontal"
            class="p-datatable-responsive"
        >
            @if(showFieldFilters()) {
                <ng-template #caption>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                            <p-iconfield>
                                <p-inputicon class="pi pi-search" />
                                <input pInputText type="text" (input)="onGlobalFilter(dt, $event)" placeholder="Pesquisar..." />
                            </p-iconfield>  
                    </div>
                </ng-template>
            }
            <ng-template #header let-columns>
                <tr>
                    <th style="width: 5rem; background-color: var(--p-datatable-header-cell-background)">
                        <div class="flex items-center gap-1">
                            <p-tableHeaderCheckbox />
                            @if (showCrudButtons()) {
                                <p-button pTooltip="Excluir itens selecionados" severity="danger" icon="pi pi-trash" outlined (click)="excluirVarios()" [disabled]="!itensSelecionados || !itensSelecionados.length" size="small" />
                            }
                        </div>
                    </th>
                    @if (menuTemplate()) {
                        <th style="width: 2rem; background-color: var(--p-datatable-header-cell-background);"></th>
                    }
                    @for(col of columns; track col) {
                        <th [style.min-width]="col.width || 'auto'" [style.text-align]="col.align || 'left'" [pSortableColumn]="col.sortable ? col.field : null" style="background-color: var(--p-datatable-header-cell-background); white-space: nowrap;">
                            {{ col.header }}
                            @if (col.sortable) {
                                <p-sortIcon [field]="col.field" />
                            }
                        </th>
                    }                    
                    <th style="text-align: right; min-width: 6rem; background-color: var(--p-datatable-header-cell-background); position: sticky; right: 0; z-index: 1;">Ações</th>
                </tr>
            </ng-template>
            <ng-template #body let-item let-columns="columns">
                <tr>
                    <td style="width: 5rem">
                        <p-tableCheckbox [value]="item" />
                    </td>
                    @if (menuTemplate()) {
                        <td style="width: 2rem; text-align: center;">
                            <ng-container *ngTemplateOutlet="menuTemplate()!; context: { $implicit: item }"></ng-container>
                        </td>
                    }
                    @for(col of columns; track col) {
                        <td [style.min-width]="col.width || 'auto'" [style.text-align]="col.align || 'left'" style="white-space: nowrap;">
                            @if (col.template && templates()[col.template]) {
                                <ng-container *ngTemplateOutlet="templates()[col.template]; context: { $implicit: item }"></ng-container>
                            }
                            @else if (col.pipe) {
                                {{ item | nestedField: col.field | customFormat: col }}
                            } @else if (col.type) { 
                                 {{ item | nestedField: col.field | dynamicFormat: col }}
                            } @else {
                                {{ item | nestedField: col.field }}
                            }
                        </td>
                    }
                    <td style="text-align: right; position: sticky; right: 0; background-color: inherit; z-index: 1;">
                        <div class="flex justify-end" style="gap:0.15rem;">
                            @if (actionsTemplate()) {
                                <ng-container *ngTemplateOutlet="actionsTemplate()!; context: { $implicit: item }"></ng-container>
                            }
                            <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" (click)="openDialog(item)" pTooltip="Editar" tooltipPosition="left" size="small" />
                            <p-button icon="pi pi-trash" [text]="true" [rounded]="true" severity="danger" (click)="this.onExcluir.emit(item)" pTooltip="Excluir" tooltipPosition="left" size="small" />
                        </div>
                    </td>
                </tr>
            </ng-template>
            <ng-template #emptymessage>
                <tr>
                    <td [attr.colspan]="cols().length + 3" class="text-center py-5">
                        <span style="font-size: 0.88rem; color: #94a3b8; font-style: italic;">Nenhum registo encontrado.</span>
                    </td>
                </tr>
            </ng-template>
        </p-table>
        </div>    
    `
})
/**
 * @author Marcelo M. de Castro
 * @summary Componente genérico para exibição de listas em tabela com funcionalidades de paginação, filtro, seleção e ações CRUD.
 * @template T Tipo genérico que estende a interface Entity, representando o tipo de dados exibidos na tabela.
 * @version 1.0.0
 */
export class TableListComponent<T extends Entity> {
    protected modalService = inject(ModalService);
    protected messageService = inject(MessagesService); 

    globalFilterFields = input.required<string[]>();
    rows = input<number>(10);
    cols = input.required<TableColumn[]>();
    entityList = input.required<T[]>();
    modalSize = input<string>('50%');
    detailComponent = input.required<Type<any>>();
    isLoading = input<boolean>(false);    
    templates = input<{ [key: string]: TemplateRef<any> }>({});
    actionsTemplate = input<TemplateRef<any> | null>(null);
    menuTemplate = input<TemplateRef<any> | null>(null);
    showCrudButtons = input<boolean>(true);
    showFieldFilters = input<boolean>(false);

    onListar = output();
    onExcluir = output<T>();
    onExcluirVarios = output<number[]>();

    itensSelecionados: T[] | null = null;    

    constructor() { }
   
    /**
     * @summary Aplica um filtro global na tabela.
     * @param table Referência à tabela do primeng onde o filtro será aplicado.
     * @param event Evento de entrada do filtro.
     */
    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * @summary Abre um dialog para criação ou edição de uma entidade.
     * @param entity Entidade a ser editada. Se nula, o diálog será aberto para criação de uma nova entidade.
     * @description Após o fechamento do diálog, atualiza a lista de entidades se houver alterações.
     * Exibe mensagens de sucesso ou erro com base na resposta da API.
     */
    openDialog(entity: T | null = null) {
        const onClose = this.modalService.openDialogPage(
            this.detailComponent(), 
            entity ? 'Editar Registro' : 'Novo Registro',
            { item: entity },
            this.modalSize(),
        );

        onClose.subscribe(
            async (response: ApiResponse) => {
                if (response.statusCode === StatusCode.OK) {
                    this.messageService.showMessageFromReponse(
                        response, 
                        entity === null ? 'Registro criado com sucesso.' : 'Registro atualizado com sucesso.'
                    );
                } else {
                    this.messageService.showMessageFromReponse(response);
                }
                this.onListar.emit();
            }       
        );
    }

    /**
     * @summary Exclui vários itens selecionadas.
     * @description Verifica se há itens selecionados, exibe uma confirmação antes de proceder com a exclusão.
     * Atualiza a lista de entidades após a exclusão e exibe mensagens de sucesso ou erro.
     */
    excluirVarios() {
        if (!this.itensSelecionados || this.itensSelecionados.length === 0) {
            this.messageService.showWarn('Nenhum item selecionado para exclusão.');
            return;
        }

        const ids = this.itensSelecionados.map(i => i.id).filter(id => id !== undefined) as number[];
        this.onExcluirVarios.emit(ids);
        this.itensSelecionados = [];
    }
}

