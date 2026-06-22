import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { HelpService, HelpContent } from '@/core/services/help.service';

@Component({
    selector: 'app-help-drawer',
    standalone: true,
    imports: [CommonModule, ButtonModule, DividerModule, TagModule, TooltipModule],
    template: `
        @if (help()) {
            <div class="help-drawer">

                <!-- Cabeçalho ilustrado -->
                <div class="help-cover" [style.background]="coverGradient()">
                    <div class="help-cover-inner">
                        <div class="help-cover-icon">
                            <i [class]="help()!.coverIcon"></i>
                        </div>
                        <div>
                            <div class="help-cover-title">{{ help()!.title }}</div>
                            <div class="help-cover-subtitle">{{ help()!.subtitle }}</div>
                        </div>
                    </div>
                </div>

                <!-- Introdução -->
                <div class="help-intro">
                    <p>{{ help()!.intro }}</p>
                </div>

                <p-divider styleClass="my-3" />

                <!-- Passos -->
                <div class="help-steps-header">
                    <i class="pi pi-compass"></i>
                    <span>O que você pode fazer aqui</span>
                </div>

                <div class="help-steps">
                    @for (step of help()!.steps; track $index) {
                        <div class="help-step">
                            <div class="help-step-icon" [style.background]="step.iconColor + '1a'" [style.color]="step.iconColor">
                                <i [class]="step.icon"></i>
                            </div>
                            <div class="help-step-content">
                                <div class="help-step-title">{{ step.title }}</div>
                                <div class="help-step-desc">{{ step.description }}</div>
                            </div>
                        </div>
                    }
                </div>

                <!-- Dicas -->
                @if (help()!.tips && help()!.tips!.length > 0) {
                    <p-divider styleClass="my-3" />
                    <div class="help-tips-header">
                        <i class="pi pi-star"></i>
                        <span>Dicas</span>
                    </div>
                    <div class="help-tips">
                        @for (tip of help()!.tips; track $index) {
                            <div class="help-tip">
                                <i [class]="tip.icon + ' help-tip-icon'"></i>
                                <span>{{ tip.text }}</span>
                            </div>
                        }
                    </div>
                }

                <!-- Rodapé -->
                <p-divider styleClass="my-3" />
                <div class="help-footer">
                    <i class="pi pi-file-pdf" style="color: #e03e2d;"></i>
                    <span>Para instruções detalhadas, consulte o</span>
                    <a href="assets/downloads/manual-do-usuario.pdf" download="manual-do-usuario.pdf" class="help-manual-link">
                        Manual do Usuário
                    </a>
                </div>
            </div>
        }
    `,
    styles: [`
        .help-drawer {
            display: flex;
            flex-direction: column;
            gap: 0;
        }

        /* ---- Capa ---- */
        .help-cover {
            border-radius: 0.75rem;
            padding: 1.25rem 1rem;
            margin-bottom: 1rem;
        }
        .help-cover-inner {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .help-cover-icon {
            width: 3.5rem;
            height: 3.5rem;
            border-radius: 0.75rem;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .help-cover-icon i {
            font-size: 1.75rem;
            color: #fff;
        }
        .help-cover-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #fff;
            line-height: 1.2;
        }
        .help-cover-subtitle {
            font-size: 0.82rem;
            color: rgba(255,255,255,0.82);
            margin-top: 0.2rem;
        }

        /* ---- Intro ---- */
        .help-intro p {
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--text-color-secondary);
            margin: 0;
        }

        /* ---- Steps header ---- */
        .help-steps-header, .help-tips-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.78rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-color-secondary);
            margin-bottom: 0.75rem;
        }
        .help-steps-header i, .help-tips-header i {
            font-size: 0.85rem;
        }

        /* ---- Steps ---- */
        .help-steps {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        .help-step {
            display: flex;
            align-items: flex-start;
            gap: 0.875rem;
            padding: 0.75rem;
            border-radius: 0.6rem;
            background: var(--surface-ground);
            border: 1px solid var(--surface-border);
            transition: border-color 0.15s;
        }
        .help-step:hover {
            border-color: var(--primary-color);
        }
        .help-step-icon {
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .help-step-icon i {
            font-size: 1rem;
        }
        .help-step-content {
            flex: 1;
            min-width: 0;
        }
        .help-step-title {
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--text-color);
            margin-bottom: 0.2rem;
        }
        .help-step-desc {
            font-size: 0.82rem;
            line-height: 1.5;
            color: var(--text-color-secondary);
        }

        /* ---- Tips ---- */
        .help-tips {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .help-tip {
            display: flex;
            align-items: flex-start;
            gap: 0.625rem;
            padding: 0.6rem 0.75rem;
            border-radius: 0.5rem;
            background: var(--yellow-50, #fefce8);
            border: 1px solid var(--yellow-200, #fde68a);
            font-size: 0.83rem;
            color: var(--yellow-900, #713f12);
            line-height: 1.5;
        }
        :host-context(.p-dark) .help-tip {
            background: rgba(234,179,8,0.1);
            border-color: rgba(234,179,8,0.25);
            color: var(--yellow-200, #fde68a);
        }
        .help-tip-icon {
            font-size: 0.85rem;
            flex-shrink: 0;
            margin-top: 0.1rem;
        }

        /* ---- Footer ---- */
        .help-footer {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.82rem;
            color: var(--text-color-secondary);
            flex-wrap: wrap;
        }
        .help-manual-link {
            color: var(--primary-color);
            font-weight: 600;
            text-decoration: none;
        }
        .help-manual-link:hover {
            text-decoration: underline;
        }
    `]
})
export class HelpDrawerComponent implements OnInit {
    private helpService = inject(HelpService);
    private router = inject(Router);

    help = signal<HelpContent | null>(null);

    coverGradient() {
        const color = this.help()?.coverColor ?? '#6366f1';
        return `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`;
    }

    ngOnInit() {
        this.updateHelp(this.router.url);

        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => this.updateHelp(e.urlAfterRedirects));
    }

    private updateHelp(url: string): void {
        this.help.set(this.helpService.getHelpForRoute(url));
    }
}
