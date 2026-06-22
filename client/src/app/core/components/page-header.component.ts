import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @author Marcelo M. de Castro
 * @summary Cabeçalho padrão de página: título, subtítulo e área de ações (via projeção de conteúdo).
 *
 * @example
 * ```html
 * <app-page-header
 *     title="Credores"
 *     subtitle="Cadastro de credores e fornecedores.">
 *     <p-button icon="pi pi-plus" label="Novo" (click)="openDialog()" />
 * </app-page-header>
 * ```
 */
@Component({
    selector: 'app-page-header',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="page-header">
            <div class="page-header-text">
                <h1 class="page-header-title">{{ title }}</h1>
                @if (subtitle) {
                    <p class="page-header-subtitle">{{ subtitle }}</p>
                }
            </div>
            <div class="page-header-actions">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styles: [`
        .page-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        .page-header-text { min-width: 0; flex: 1; }
        .page-header-title {
            font-size: 1.6rem;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.2;
            margin: 0 0 0.35rem 0;
            letter-spacing: -0.01em;
        }
        .page-header-subtitle {
            font-size: 0.92rem;
            color: #64748b;
            line-height: 1.5;
            margin: 0;
            max-width: 70ch;
        }
        .page-header-actions {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            flex-wrap: wrap;
        }

        :host-context(.app-dark) .page-header-title {
            color: #f1f5f9;
        }
        :host-context(.app-dark) .page-header-subtitle {
            color: #94a3b8;
        }

        @media (max-width: 575.98px) {
            .page-header-title { font-size: 1.3rem; }
            .page-header-subtitle { font-size: 0.85rem; }
        }
    `]
})
export class PageHeaderComponent {
    @Input() title = '';
    @Input() subtitle = '';
}
