import { Component, OnInit, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { sharedConfig } from '../../shared/config/shared.config';
import { HelpService } from '../services/help.service';

@Component({
    selector: 'app-breadcrumb',
    imports: [...sharedConfig.imports],
    template: `
        <p-toolbar class="mb-4">
            <ng-template #start >
                <nav aria-label="breadcrumb" class="breadcrumb-container">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <a><i [class]="home.icon"></i></a>
                        </li>
                        @for (item of items; track $index) {
                            <li class="breadcrumb-item" >
                                @if ($index !== items.length - 1 && item.routerLink) {
                                    <a [routerLink]="item.routerLink">
                                        @if (item.icon) {
                                            <i [class]="item.icon" style="margin-right: 0.1rem;"></i>
                                        }
                                        {{ item.label }}
                                    </a>
                                } @else {
                                    @if (item.icon) {
                                        <i [class]="item.icon" style="margin-right: 0.1rem;"></i>
                                    }
                                    {{ item.label }}
                                }
                            </li>
                        }
                    </ol>
                    <button type="button" class="help-btn" pTooltip="Ajuda desta tela" tooltipPosition="right"
                        (click)="helpService.helpVisivel.set(true)">
                        <i class="pi pi-question-circle" style="color: var(--primary-color);"></i>
                    </button>
                </nav>
            </ng-template>
            <ng-template #end>
                <ng-content></ng-content>
            </ng-template>
        </p-toolbar>
    `,
    styles: `
        .breadcrumb-container {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 0.5rem;
        }
        .breadcrumb {
            margin-bottom: 0;
        }
        .help-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            color: var(--red-500);
            font-size: 1rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .help-btn:hover {
            opacity: 1;
        }
    `
})
/**
 * @author Marcelo M. de Castro
 * @summary Componente de breadcrumb para navegação.
 * Fornece uma barra de navegação que exibe o caminho atual dentro da aplicação.
 * Os itens do breadcrumb são armazenados no localStorage para persistência entre recarregamentos de página.
 */
export class BreadcrumbComponent implements OnInit {
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
    items: MenuItem[] = [];
    helpService = inject(HelpService);

    constructor() { }

    ngOnInit(): void {
        const storedBreadcrumb = localStorage.getItem('breadcrumb');
        if (storedBreadcrumb) {
            this.items = JSON.parse(storedBreadcrumb);
        }
    }
}
