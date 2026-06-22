import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../secure/services/auth.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-menu',
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `
        <ul class="layout-menu">
            @for (item of model; track $index) {
                <ng-container>
                    @if (!item.separator) {
                        <li app-menuitem [item]="item" [index]="$index" [root]="true"></li>
                    } @else {
                        <li class="menu-separator"></li>
                    }
                </ng-container>
            }
        </ul> 
    `
})
export class AppMenu {
    private authService = inject(AuthService);
    private router = inject(Router);

    model: MenuItem[] = [];   

    ngOnInit() {
        this.model = [
            {
                label: 'Exemplo',
                items: [
                    { label: 'Exemplos', icon: 'pi pi-fw pi-list', routerLink: ['/features/exemplo'] },
                ]
            },
            {
                // Adicione aqui os itens de menu do seu domínio
                // Exemplo:
                // label: 'Minha Solução',
                // items: [
                //     { label: 'Minha Entidade', icon: 'pi pi-fw pi-list', routerLink: ['/features/minha-entidade'] },
                // ]
                label: 'Menu',
                items: []
            }
        ];

        // Menu de Administração visível apenas para Admin
        if (this.authService.isAdmin()) {
            this.model.push({
                label: 'Administração',
                items: [
                    {
                        label: 'Usuários',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/features/usuarios'],
                        routerLinkActiveOptions: { exact: true },
                    },
                    {
                        label: 'Perfis',
                        icon: 'pi pi-fw pi-id-card',
                        routerLink: ['/features/perfil'],
                        routerLinkActiveOptions: { exact: true },
                    }
                ]
            });
        }

        // Sincroniza o breadcrumb com a rota activa a cada navegação.
        // NavigationEnd dispara ANTES do componente da rota ser inicializado,
        // garantindo que o localStorage já está correto quando BreadcrumbComponent lê.
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.syncBreadcrumbFromUrl(e.urlAfterRedirects);
            });

        // Sincroniza imediatamente com a URL atual para cobrir o caso de login redirect:
        // ao entrar pela primeira vez, o NavigationEnd já disparou antes do AppMenu ser
        // inicializado, então o breadcrumb ficaria vazio sem esta chamada direta.
        this.syncBreadcrumbFromUrl(this.router.url);
    }

    private syncBreadcrumbFromUrl(url: string): void {
        // Remove query string e fragment antes de comparar
        const cleanUrl = url.split('?')[0].split('#')[0];
        const matched = this.findItemByUrl(cleanUrl, this.model);
        if (!matched) return;
        const path = this.findMenuPath(matched, this.model);
        const items = path ? path.map(p => ({ label: p.label, routerLink: p.routerLink, icon: p.icon })) : [];
        localStorage.setItem('breadcrumb', JSON.stringify(items));
    }

    // Retorna o item de menu cujo routerLink seja o prefixo mais longo que corresponde à URL.
    // O match mais longo vence para suportar sub-rotas (ex.: /registro-da-conta/edit/5).
    private findItemByUrl(url: string, items: MenuItem[]): MenuItem | null {
        let bestMatch: MenuItem | null = null;
        let bestMatchLength = 0;

        const search = (menuItems: MenuItem[]) => {
            for (const item of menuItems) {
                if (item.routerLink) {
                    const link = Array.isArray(item.routerLink) ? item.routerLink.join('/') : String(item.routerLink);
                    const normalized = '/' + link.replace(/^\/+/, '');
                    if ((url === normalized || url.startsWith(normalized + '/')) && normalized.length > bestMatchLength) {
                        bestMatch = item;
                        bestMatchLength = normalized.length;
                    }
                }
                if (item.items) search(item.items);
            }
        };

        search(items);
        return bestMatch;
    }

    private findMenuPath(item: MenuItem, items: MenuItem[], path: MenuItem[] = []): MenuItem[] | null {
        for (let menuItem of items) {
            if (menuItem === item) {
                return [...path, menuItem];
            }
            if (menuItem.items) {
                const foundPath = this.findMenuPath(item, menuItem.items, [...path, menuItem]);
                if (foundPath) {
                    return foundPath;
                }
            }
        }
        return null;
    }
}
