import { Component, inject, ViewChild, ElementRef, AfterViewInit, viewChild, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../services/auth.service';
import { APP_INFO } from '../../core/constants/app.info';
import { Login } from '../models/login.model';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule, MessageModule, FluidModule, DividerModule],
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
        .auth-divider-text {
            font-size: 0.8rem;
            color: #94a3b8;
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
        .auth-link-secondary {
            font-size: 0.8rem;
            font-weight: 500;
            color: #6366f1;
            text-decoration: none;
            cursor: pointer;
        }
        .auth-link-secondary:hover { text-decoration: underline; }
        .auth-remember-label {
            font-size: 0.875rem;
            color: #475569;
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
                         style="width:6rem;height:6rem;border-radius:1.2rem;margin-bottom:1.5rem;filter:drop-shadow(0 8px 24px rgba(0,0,0,0.25))">
                    <div style="font-size:2rem;font-weight:800;color:#fff;letter-spacing:-0.5px;margin-bottom:0.5rem;">{{ appInfo.name }}</div>
                    <div style="font-size:1.05rem;color:rgba(255,255,255,0.75);max-width:360px;line-height:1.6;">{{ appInfo.description }}</div>
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
                        <p class="auth-title">Bem-vindo!</p>
                        <p class="auth-subtitle">Entre com suas credenciais para continuar</p>
                    </div>

                    @for (error of errorMessages; track error) {
                        <p-message severity="error" [text]="error" styleClass="mb-3 w-full" />
                    }

                    <p-fluid>
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col">
                                <label for="email" class="auth-field-label">E-mail</label>
                                <input #emailInput pInputText id="email" type="email" placeholder="seu@email.com" [(ngModel)]="credentials.email" />
                            </div>

                            <div class="flex flex-col">
                                <label for="password" class="auth-field-label">Senha</label>
                                <p-password id="password" [(ngModel)]="credentials.password" placeholder="••••••••" [toggleMask]="true" [feedback]="false" (keydown.enter)="onLogin()"></p-password>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <p-checkbox [(ngModel)]="rememberMe" id="rememberme" binary></p-checkbox>
                                    <label for="rememberme" class="auth-remember-label">Lembrar-me</label>
                                </div>
                                <a routerLink="/secure/forgot-password" class="auth-link-secondary">Esqueceu a senha?</a>
                            </div>

                            <p-button label="Entrar" styleClass="w-full" [loading]="loading" (onClick)="onLogin()"></p-button>

                            <p-divider align="center">
                                <span class="auth-divider-text">ou continue com</span>
                            </p-divider>

                            <div #googleBtn id="google-signin-btn" style="width:100%;"></div>
                        </div>
                    </p-fluid>

                    <div class="text-center mt-5">
                        <span class="auth-footer-text">Não tem uma conta? </span>
                        <a routerLink="/secure/register" class="auth-link">Cadastre-se</a>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class LoginComponent implements AfterViewInit {
    protected readonly appInfo = APP_INFO;

    private authService = inject(AuthService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private platformId = inject(PLATFORM_ID);

    emailInput = viewChild<ElementRef<HTMLInputElement>>('emailInput');
    googleBtn = viewChild<ElementRef<HTMLDivElement>>('googleBtn');

    credentials: Login = { email: '', password: '' };
    rememberMe = false;
    loading = false;
    errorMessages: string[] = [];

    ngAfterViewInit() {
        this.focusEmail();
        if (isPlatformBrowser(this.platformId)) {
            this.initializeGoogleSignIn();
        }
    }

    private focusEmail() {
        setTimeout(() => this.emailInput()?.nativeElement?.focus());
    }

    private clearFieldsAndFocus() {
        this.credentials = { email: '', password: '' };
        this.focusEmail();
    }

    async onLogin() {
        if (!this.credentials.email || !this.credentials.password) {
            this.errorMessages.push('Preencha todos os campos.');
            this.clearFieldsAndFocus();
            return;
        }

        this.loading = true;
        this.errorMessages = [];

        try {
            const response = await this.authService.login(this.credentials, this.rememberMe);

            if (response.result?.isSuccessful) {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.appInfo.defaultRoute;
                await this.router.navigateByUrl(returnUrl);
            } else {
                this.errorMessages.push(response.result?.message || 'Credenciais inválidas.');
                this.clearFieldsAndFocus();
            }
        } catch (ex: any) {
            const errors = ex?.error?.result?.errors;
            if (errors?.length) {
                this.errorMessages = errors.map((e: any) => e.message);
            } else {
                this.errorMessages = [ex?.error?.result?.message || 'Falha na autenticação. Tente novamente.'];
            }
            this.clearFieldsAndFocus();
        } finally {
            this.loading = false;
        }
    }

    private initializeGoogleSignIn() {
        let attempts = 0;
        const maxAttempts = 50;
        const waitForGoogle = setInterval(() => {
            if (++attempts > maxAttempts) {
                clearInterval(waitForGoogle);
                return;
            }
            if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(waitForGoogle);
                google.accounts.id.initialize({
                    client_id: environment.google.clientId,
                    callback: (response: any) => this.onGoogleSignIn(response.credential)
                });
                this.renderGoogleButton();
            }
        }, 200);
    }

    private renderGoogleButton(renderAttempts = 0) {
        const btn = this.googleBtn()?.nativeElement;
        if (!btn) return;
        const width = btn.offsetWidth || btn.parentElement?.offsetWidth;
        if (width && width > 0) {
            google.accounts.id.renderButton(btn, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                width,
                text: 'signin_with',
                logo_alignment: 'left'
            });
        } else if (renderAttempts < 30) {
            requestAnimationFrame(() => this.renderGoogleButton(renderAttempts + 1));
        }
    }

    private async onGoogleSignIn(idToken: string) {
        this.errorMessages = [];
        try {
            const response = await this.authService.loginWithGoogle(idToken);
            if (response.result?.isSuccessful) {
                const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.appInfo.defaultRoute;
                await this.router.navigateByUrl(returnUrl);
            } else {
                this.errorMessages = [response.result?.message || 'Falha no login com Google.'];
            }
        } catch (ex: any) {
            this.errorMessages = [ex?.error?.result?.message || 'Falha no login com Google.'];
        }
    }
}
