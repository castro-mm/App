import { Component, inject, ViewChild, ElementRef, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { AuthService } from '../services/auth.service';
import { APP_INFO } from '../../core/constants/app.info';
import { Register } from '../models/register.model';

@Component({
    selector: 'app-register',
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
        .auth-footer-text {
            font-size: 0.875rem;
            color: #94a3b8;
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
                    <div style="font-size:1.05rem;color:rgba(255,255,255,0.75);max-width:320px;line-height:1.6;">{{ appInfo.descriptionRegister }}</div>
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
                        <p class="auth-title">Criar conta</p>
                        <p class="auth-subtitle">Preencha os dados abaixo para se cadastrar</p>
                    </div>

                    @if (errorMessages.length > 0) {
                        @for (error of errorMessages; track $index) {
                            <p-message severity="error" [text]="error" styleClass="mb-3 w-full" />
                        }
                    }
                    @if (successMessage) {
                        <p-message severity="success" [text]="successMessage" styleClass="mb-3 w-full" />
                    }

                    <p-fluid>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <label for="nomeCompleto" class="auth-field-label">Nome Completo</label>
                                <input #nomeCompletoInput pInputText id="nomeCompleto" type="text" placeholder="Seu nome completo" [(ngModel)]="user.nomeCompleto" />
                            </div>

                            <div class="flex flex-col">
                                <label for="email" class="auth-field-label">E-mail</label>
                                <input pInputText id="email" type="email" placeholder="seu@email.com" [(ngModel)]="user.email" />
                            </div>

                            <div class="flex flex-col">
                                <label for="password" class="auth-field-label">Senha</label>
                                <p-password id="password" [(ngModel)]="user.password" placeholder="••••••••" [toggleMask]="true"></p-password>
                            </div>

                            <div class="flex flex-col">
                                <label for="confirmPassword" class="auth-field-label">Confirmar Senha</label>
                                <p-password id="confirmPassword" [(ngModel)]="confirmPassword" placeholder="••••••••" [toggleMask]="true" [feedback]="false" (keydown.enter)="onRegister()"></p-password>
                            </div>

                            <p-button label="Cadastrar" styleClass="w-full" [loading]="loading" (onClick)="onRegister()"></p-button>
                        </div>
                    </p-fluid>

                    <div class="text-center mt-5">
                        <span class="auth-footer-text">Já tem uma conta? </span>
                        <a routerLink="/secure/login" class="auth-link">Entrar</a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class RegisterComponent implements AfterViewInit {
    protected readonly appInfo = APP_INFO;

    private authService = inject(AuthService);
    private router = inject(Router);

    nomeCompletoInput = viewChild<ElementRef<HTMLInputElement>>('nomeCompletoInput');

    user: Register = { email: '', password: '', nomeCompleto: '' };
    confirmPassword = '';
    loading = false;
    errorMessages: string[] = [];
    successMessage = '';

    ngAfterViewInit() {
        this.focusNomeCompleto();
    }

    private focusNomeCompleto() {
        setTimeout(() => this.nomeCompletoInput()?.nativeElement?.focus());
    }

    private clearFieldsAndFocus() {
        this.user = { email: '', password: '', nomeCompleto: '' };
        this.confirmPassword = '';
        this.focusNomeCompleto();
    }

    async onRegister() {
        this.errorMessages = [];
        this.successMessage = '';

        if (!this.user.nomeCompleto || !this.user.email || !this.user.password) {
            this.errorMessages.push('Preencha todos os campos.');
            this.clearFieldsAndFocus();
            return;
        }

        if (this.user.password !== this.confirmPassword) {
            this.errorMessages.push('As senhas não conferem.');
            this.clearFieldsAndFocus();
            return;
        }

        this.loading = true;

        try {
            const response = await this.authService.register(this.user);

            if (response.result?.isSuccessful) {
                this.successMessage = response.result?.message || 'Conta criada com sucesso! Verifique seu e-mail para ativá-la.';
                this.clearFieldsAndFocus();
            } else {
                this.errorMessages.push(response.result?.message || 'Erro ao criar a conta.');
                this.clearFieldsAndFocus();
            }
        } catch (ex: any) {
            const errors = ex?.error?.result?.errors;
            this.errorMessages = errors.length 
                ? errors.map((e: any) => e.message) 
                : [ex?.error?.result?.message || 'Erro ao criar a conta. Tente novamente.'];
            this.clearFieldsAndFocus();
        } finally {
            this.loading = false;
        }
    }
}


