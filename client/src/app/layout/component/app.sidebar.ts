import { Component, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenu } from './app.menu';
import { AuthService } from '../../secure/services/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu, CommonModule],
    template: `
        <div class="layout-sidebar">
            <app-menu></app-menu>
            <div class="layout-sidebar-profile">
                @if (authService.userPhoto()) {
                    <img [src]="authService.userPhoto()" alt="Foto" class="layout-sidebar-profile-avatar" />
                } @else {
                    <div class="layout-sidebar-profile-avatar-placeholder">
                        <i class="pi pi-user"></i>
                    </div>
                }
                <div class="layout-sidebar-profile-info">
                    <div class="layout-sidebar-profile-name">{{ authService.userName() }}</div>
                    <div class="layout-sidebar-profile-role">{{ authService.userRole() }}</div>
                </div>
            </div>
        </div>
    `
})
export class AppSidebar {
    authService = inject(AuthService);

    constructor(public el: ElementRef) {}
}
