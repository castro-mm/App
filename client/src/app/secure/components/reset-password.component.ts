import { Component, inject, ViewChild, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { AuthService } from '../services/auth.service';
import { APP_INFO } from '../../core/constants/app.info';
import { Password } from 'primeng/password';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, PasswordModule, RippleModule, MessageModule, FluidModule],
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
        <div class="auth-right min-h-screen min-w-screen flex items-center justify-center p-8">

            <!-- Logo mobile -->
            <div class="flex flex-col items-center" style="width:100%;max-width:440px;">
                <div class="flex flex-col items-center text-center mb-6">
                    <img src="assets/branding/icon-color.svg" [attr.alt]="appInfo.name"
                         style="width:4rem;height:4rem;border-radius:0.75rem;margin-bottom:0.75rem;box-shadow:0 4px 16px rgba(79,70,229,0.2);">
                    <div style="font-size:1.25rem;font-weight:700;color:#6366f1;">{{ appInfo.name }}</div>
                </div>

                <div class="auth-card">
                    <div class="mb-6">
                        <p class="auth-title">Redefinir senha</p>
                        <p class="auth-subtitle">Informe sua nova senha</p>
                    </div>

                    @if (errorMessage) {
                        <p-message severity="error" [text]="errorMessage" styleClass="mb-3 w-full" />
                    }
                    @if (successMessage) {
                        <p-message severity="success" [text]="successMessage" styleClass="mb-3 w-full" />
                    }

                    <p-fluid>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <label for="newPassword" class="auth-field-label">Nova Senha</label>
                                <p-password #newPasswordInput id="newPassword" [(ngModel)]="newPassword" placeholder="••••••••" [toggleMask]="true"></p-password>
                            </div>

                            <div class="flex flex-col">
                                <label for="confirmPassword" class="auth-field-label">Confirmar Senha</label>
                                <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="••••••••" [toggleMask]="true" [feedback]="false" (keydown.enter)="onSubmit()"></p-password>
                            </div>

                            <p-button label="Redefinir senha" styleClass="w-full" [loading]="loading" (onClick)="onSubmit()"></p-button>
                        </div>
                    </p-fluid>

                    <div class="text-center mt-5">
                        <a routerLink="/secure/login" class="auth-link">← Voltar para o login</a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ResetPasswordComponent implements AfterViewInit {
    protected readonly appInfo = APP_INFO;

    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    newPasswordInput = viewChild<Password>('newPasswordInput');

    newPassword = '';
    confirmPassword = '';
    loading = false;
    errorMessage = '';
    successMessage = '';

    private get email(): string {
        return this.route.snapshot.queryParams['email'] || '';
    }

    private get token(): string {
        return this.route.snapshot.queryParams['token'] || '';
    }

    ngAfterViewInit() {
        this.focusNewPassword();
    }

    async onSubmit() {
        this.errorMessage = '';
        this.successMessage = '';

        if (!this.newPassword || !this.confirmPassword) {
            this.errorMessage = 'Preencha todos os campos.';
            this.clearFieldsAndFocus();
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'As senhas não conferem.';
            this.clearFieldsAndFocus();
            return;
        }

        if (!this.email || !this.token) {
            this.errorMessage = 'Link de redefinição inválido ou expirado.';
            this.clearFieldsAndFocus();
            return;
        }

        this.loading = true;

        try {
            const response = await this.authService.resetPassword({
                email: this.email,
                token: this.token,
                newPassword: this.newPassword
            });

            if (response.result?.isSuccessful) {
                this.successMessage = 'Senha redefinida com sucesso! Redirecionando para o login...';
                this.clearFieldsAndFocus();
                setTimeout(() => this.router.navigate(['/secure/login']), 2000);
            } else {
                this.errorMessage = response.result?.message || 'Erro ao redefinir a senha.';
                this.clearFieldsAndFocus();
            }
        } catch (error: any) {
            this.errorMessage = error?.error?.result?.message || 'Erro ao redefinir a senha. Tente novamente.';
            this.clearFieldsAndFocus();
        } finally {
            this.loading = false;
        }
    }

    private focusNewPassword() {
        setTimeout(() => this.newPasswordInput()?.input?.nativeElement?.focus());
    }

    private clearFieldsAndFocus() {
        this.newPassword = '';
        this.confirmPassword = '';
        this.focusNewPassword();
    }
}
