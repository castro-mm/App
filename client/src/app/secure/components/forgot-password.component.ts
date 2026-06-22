import { Component, inject, ViewChild, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../services/auth.service';
import { APP_INFO } from '../../core/constants/app.info';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, RippleModule, MessageModule, FluidModule, DialogModule],
    styles: [`
        .auth-right {
            background: #f8fafc;
        }
        .auth-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 0.875rem;
            padding: 2.5rem 2rem;
            box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06);
            width: 100%;
            max-width: 440px;
        }
        .auth-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 0.3rem;
            text-align: center;
        }
        .auth-subtitle {
            font-size: 0.875rem;
            color: #94a3b8;
            text-align: center;
        }
        .auth-field-label {
            display: block;
            font-size: 0.78rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            margin-bottom: 0.3rem;
        }
        .auth-link {
            font-size: 0.875rem;
            font-weight: 600;
            color: #6366f1;
            text-decoration: none;
            cursor: pointer;
        }
        .auth-link:hover {
            color: #4f46e5;
            text-decoration: underline;
        }
    `],
    template: `
        <div class="min-h-screen min-w-screen flex flex-col lg:flex-row overflow-hidden">

            <!-- Painel de branding (esquerda) -->
            <div class="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
                 style="background: linear-gradient(145deg, #3730a3 0%, #4f46e5 45%, #6366f1 100%);">
                <div style="position:absolute;top:-80px;right:-80px;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
                <div style="position:absolute;bottom:-60px;left:-60px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,0.06);"></div>
                <div style="position:absolute;top:40%;left:-40px;width:160px;height:160px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
                <div class="flex flex-col items-center text-center relative z-10 px-12">
                    <img src="assets/branding/icon-color.svg" [attr.alt]="appInfo.name"
                         style="width:6rem;height:6rem;border-radius:1.2rem;margin-bottom:1.5rem;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.25));">
                    <div style="font-size:2rem;font-weight:800;color:#fff;letter-spacing:-0.5px;margin-bottom:0.5rem;">{{ appInfo.name }}</div>
                    <div style="font-size:1.05rem;color:rgba(255,255,255,0.75);max-width:320px;line-height:1.6;">Recupere o acesso à sua conta com segurança</div>
                </div>
            </div>

            <!-- Painel do formulário (direita) -->
            <div class="auth-right flex-1 lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 min-h-screen">

                <!-- Logo mobile (oculto em lg+) -->
                <div class="flex flex-col items-center text-center mb-6 lg:hidden">
                    <img src="assets/branding/icon-color.svg" [attr.alt]="appInfo.name"
                         style="width:4rem;height:4rem;border-radius:0.75rem;margin-bottom:0.75rem;box-shadow:0 4px 16px rgba(79,70,229,0.2);">
                    <div style="font-size:1.25rem;font-weight:700;color:#6366f1;">{{ appInfo.name }}</div>
                </div>

                <div class="auth-card">
                    <div class="mb-6">
                        <p class="auth-title">Recuperar senha</p>
                        <p class="auth-subtitle">Informe seu e-mail para receber as instruções de recuperação</p>
                    </div>

                    @if(errorMessages.length > 0) {
                        @for (error of errorMessages; track error) {
                            <p-message severity="error" [text]="error" styleClass="mb-3 w-full" />
                        }
                    }
                    @if (successMessage) {
                        <p-message severity="success" [text]="successMessage" styleClass="mb-3 w-full" />
                    }

                    <p-fluid>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <label for="email" class="auth-field-label">E-mail</label>
                                <input #emailInput pInputText id="email" type="email" placeholder="seu@email.com" [(ngModel)]="email" (keydown.enter)="onSubmit()" />
                            </div>

                            <p-button label="Enviar instruções" styleClass="w-full" [loading]="loading" (onClick)="onSubmit()"></p-button>
                        </div>
                    </p-fluid>

                    <div class="text-center mt-5">
                        <a routerLink="/secure/login" class="auth-link">← Voltar para o login</a>
                    </div>
                </div>
            </div>
        </div>

        <p-dialog
            header="Link de Redefinição (Desenvolvimento)"
            [(visible)]="showDevDialog"
            [modal]="true"
            [closable]="true"
            [style]="{ width: '500px' }">
            <p class="mb-3 text-sm" style="color: var(--text-color-secondary)">Em produção, este link seria enviado por e-mail. Use-o para redefinir a senha:</p>
            <a [href]="devResetLink" class="text-primary" style="word-break: break-all; font-size: 0.875rem">{{ devResetLink }}</a>
            <ng-template pTemplate="footer">
                <p-button label="Fechar" (onClick)="showDevDialog = false" />
            </ng-template>
        </p-dialog>
    `
})
export class ForgotPasswordComponent implements AfterViewInit {
    protected readonly appInfo = APP_INFO;

    private authService = inject(AuthService);

    emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');

    email = '';
    loading = false;
    errorMessages: string[] = [];
    successMessage = '';
    devResetLink = '';
    showDevDialog = false;

    ngAfterViewInit() {
        this.focusEmail();
    }

    private focusEmail() {
        setTimeout(() => this.emailInput()?.nativeElement?.focus());
    }

    private clearFieldsAndFocus() {
        this.email = '';
        this.focusEmail();
    }

    async onSubmit() {
        this.errorMessages = [];
        this.successMessage = '';

        if (!this.email) {
            this.errorMessages.push('Informe o e-mail.');
            this.clearFieldsAndFocus();
            return;
        }

        this.loading = true;

        try {
            const response = await this.authService.forgotPassword({ email: this.email });

            if (response.result?.isSuccessful) {
                const resetLink = response.result?.data?.resetLink;
                if (resetLink) {
                    this.devResetLink = resetLink;
                    this.showDevDialog = true;
                } else {
                    this.successMessage = response.result.data || 'Instruções de recuperação enviadas para o seu e-mail.';
                }} else {
                this.errorMessages.push(response.result?.message || 'Erro ao enviar o e-mail de recuperação.');
                this.clearFieldsAndFocus();
            }
        } catch (ex: any) {
            console.log(ex);
            const errors = ex?.error?.result?.errors;
            if (errors?.length) {
                this.errorMessages = errors.map((e: any) => e.message);
            } else {
                this.errorMessages = [ex?.error?.result?.message || 'Erro ao alterar a senha. Tente novamente.'];
            }
            this.clearFieldsAndFocus();
        } finally {
            this.loading = false;
        }
    }
}
