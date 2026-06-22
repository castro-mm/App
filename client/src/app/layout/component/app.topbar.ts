import { Component, inject, ViewChild, ElementRef, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DrawerModule } from 'primeng/drawer';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../secure/services/auth.service';
import { MessagesService } from '../../core/services/messages.service';
import { HelpDrawerComponent } from './help-drawer.component';
import { HelpService } from '../../core/services/help.service';
import { APP_INFO } from '../../core/constants/app.info';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, PopoverModule, TagModule, DividerModule, ButtonModule, TooltipModule, DatePipe, AppConfigurator, DrawerModule, HelpDrawerComponent],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/" style="display:inline-flex; align-items:center; gap:0.6rem; text-decoration:none;">
                <img src="assets/branding/icon-color.svg" alt="" style="height:2.2rem; width:2.2rem; border-radius:0.4rem; display:block; flex-shrink:0;">
                <span style="font-size:1.05rem; font-weight:700; color:var(--primary-color); letter-spacing:-0.3px; line-height:1.1;">{{ appInfo.name }}<br><span style="font-weight:400; font-size:0.85rem; color:var(--text-color-secondary);">{{ appInfo.tagline }}</span></span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <!-- <button type="button" class="layout-topbar-action topbar-action-sun" (click)="toggleDarkMode()" pTooltip="Alternar tema claro/escuro" tooltipPosition="bottom">
                    @if (layoutService.isDarkTheme()) {
                        <i class="pi pi-moon" style="color: #94a3b8; font-size: 1.35rem;"></i>
                    } @else {
                        <i class="pi pi-sun" style="color: #f59e0b; font-size: 1.35rem;"></i>
                    }
                </button> -->
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                        pTooltip="Personalizar cores"
                        tooltipPosition="bottom"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action topbar-action-heart" pTooltip="Apoie este projeto" tooltipPosition="bottom" style="display:none;">
                        <i class="pi pi-heart-fill" style="color: #ef4444; font-size: 1.2rem;"></i>
                    </button>

                    <div class="topbar-divider"></div>

                    <button type="button" class="layout-topbar-user" (click)="userPopover.toggle($event)" pTooltip="Conta" tooltipPosition="bottom">
                        @if (authService.userPhoto()) {
                            <img [src]="authService.userPhoto()" alt="Foto" class="topbar-user-avatar" />
                        } @else {
                            <i class="pi pi-user" style="color: var(--primary-color); font-size: 1.15rem; margin-right: 0.5rem;"></i>
                        }
                        <span class="topbar-user-name">{{ userShortName() }}</span>
                    </button>
                    <p-popover #userPopover>
                        <div style="min-width: 250px; max-width: 90vw;">
                            <!-- Cabeçalho do perfil -->
                            <div class="flex items-center gap-3 mb-3" style="overflow-wrap: break-word; word-break: break-word;">
                                <div class="relative">
                                    @if (authService.userPhoto()) {
                                        <img [src]="authService.userPhoto()" alt="Foto de perfil"
                                            style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; cursor: pointer;"
                                            pTooltip="Clique para alterar a foto" tooltipPosition="bottom"
                                            (click)="fileInput.click()" />
                                        <button type="button"
                                            class="p-button p-button-rounded p-button-danger p-button-sm"
                                            style="position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; padding: 0; display: flex; align-items: center; justify-content: center;"
                                            pTooltip="Remover foto" tooltipPosition="right"
                                            (click)="onRemovePhoto()">
                                            <i class="pi pi-times" style="font-size: 0.6rem"></i>
                                        </button>
                                    } @else {
                                        <div class="flex items-center justify-center bg-primary text-primary-contrast"
                                            style="width: 56px; height: 56px; border-radius: 50%; cursor: pointer;"
                                            pTooltip="Clique para adicionar uma foto" tooltipPosition="bottom"
                                            (click)="fileInput.click()">
                                            <i class="pi pi-camera" style="font-size: 1.4rem"></i>
                                        </div>
                                    }
                                    <input #fileInput type="file" accept="image/png,image/jpeg,image/webp"
                                        style="display: none" (change)="onPhotoSelected($event)" />
                                </div>
                                <div>
                                    <div class="font-semibold text-lg">{{ authService.userName() }}</div>
                                    <div class="text-muted-color text-sm">{{ authService.userEmail() }}</div>
                                    <p-tag [value]="authService.userRole()" [severity]="authService.isAdmin() ? 'contrast' : 'info'" class="mt-1" />
                                </div>
                            </div>

                            <!-- Último acesso -->
                            @if (authService.lastAccess()) {
                                <p-divider />
                                <div class="flex items-center gap-2 text-muted-color text-sm py-1">
                                    <i class="pi pi-clock"></i>
                                    <div>
                                        <span class="font-medium">Último acesso</span><br/>
                                        <span>{{ authService.lastAccess() | date: 'dd/MM/yyyy' }} às {{ authService.lastAccess() | date: 'HH:mm' }}</span>
                                    </div>
                                </div>
                            }

                            <!-- Ações -->
                            <p-divider />
                            <div class="flex flex-column gap-1">
                                <button pButton 
                                    label="Alterar Senha" 
                                    icon="pi pi-lock" 
                                    class="p-button-text p-button-plain w-full justify-start" 
                                    (click)="onChangePassword(userPopover)">
                                </button>
                                <a href="assets/downloads/manual-do-usuario.pdf" download="manual-do-usuario.pdf"
                                    class="p-button p-button-text p-button-plain w-full justify-start"
                                    style="text-decoration:none; display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0.75rem; border-radius:var(--border-radius);">
                                    <i class="pi pi-file-pdf" style="color: #e03e2d;"></i>
                                    <span>Manual do Usuário</span>
                                </a>
                            </div>
                            <p-divider />
                            <div class="flex flex-column gap-1">
                                <button pButton 
                                    label="Sair" 
                                    icon="pi pi-sign-out" 
                                    class="p-button-text p-button-danger w-full justify-start" 
                                    (click)="onLogout()">
                                </button>
                            </div>
                        </div>
                    </p-popover>
                </div>
            </div>
        </div>
    </div>

    <p-drawer [(visible)]="helpService.helpVisivel" position="right" [style]="{ width: '26rem' }" header="Ajuda">
        <app-help-drawer />
    </p-drawer>
    `
})
export class AppTopbar {
    protected readonly appInfo = APP_INFO;

    private static readonly MAX_PHOTO_SIZE = 500 * 1024; // 500KB
    private static readonly ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

    items!: MenuItem[];
    authService = inject(AuthService);
    private messagesService = inject(MessagesService);
    private router = inject(Router);

    helpService = inject(HelpService);

    constructor(public layoutService: LayoutService) {}

    /** Converte algo como "castro.mm@yahoo.com" → "castro mm" para usar como nome. */
    private nameOrEmailParts(): string[] {
        let raw = (this.authService.userName() || '').trim();
        if (!raw) raw = (this.authService.userEmail() || '').trim();
        if (!raw) return [];
        // Se for email, pega só o prefixo antes do "@" e troca "." e "_" por espaço
        if (raw.includes('@')) {
            raw = raw.split('@')[0].replace(/[._-]+/g, ' ');
        }
        return raw.split(/\s+/).filter(Boolean);
    }

    /** Iniciais (até 2 letras) para o avatar. */
    userInitials(): string {
        const parts = this.nameOrEmailParts();
        if (parts.length === 0) return '?';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    /** Apenas o primeiro nome capitalizado (ex: "João", "Castro"). */
    userShortName(): string {
        const parts = this.nameOrEmailParts();
        if (parts.length === 0) return '';
        const first = parts[0];
        return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    onLogout() {
        this.authService.logout();
    }

    async onPhotoSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        input.value = '';

        if (!file) return;

        if (!AppTopbar.ALLOWED_TYPES.includes(file.type)) {
            this.messagesService.showWarn('Formato inválido. Use PNG, JPEG ou WebP.', 'Foto de perfil');
            return;
        }

        if (file.size > AppTopbar.MAX_PHOTO_SIZE) {
            this.messagesService.showWarn('A imagem deve ter no máximo 500KB.', 'Foto de perfil');
            return;
        }

        try {
            const base64 = await this.fileToBase64(file);
            const response = await this.authService.updatePhoto(base64);
            this.messagesService.showMessageFromReponse(response);
        } catch (ex: any) {
            this.messagesService.showMessageFromReponse(ex.error);
        }
    }

    async onRemovePhoto() {
        try {
            const response = await this.authService.removePhoto();
            this.messagesService.showMessageFromReponse(response);
        } catch (ex: any) {
            this.messagesService.showMessageFromReponse(ex.error);
        }
    }

    onChangePassword(popover: any) {
        popover.hide();
        this.router.navigate(['/change-password']);
    }

    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}
