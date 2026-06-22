import { Component, effect, inject } from '@angular/core';
import { sharedConfig } from '@/shared/config/shared.config';
import { AuthService } from '@/secure/services/auth.service';
import { MessagesService } from '@/core/services/messages.service';

@Component({
    selector: 'app-root',
    imports: [...sharedConfig.imports],
    template: `
        <p-toast/>
        <p-confirm-dialog/>
        <router-outlet></router-outlet>
    `,
})
export class AppComponent {
    private authService = inject(AuthService);
    private messagesService = inject(MessagesService);

    constructor() {
        effect(() => {
            if (this.authService.sessionExpiredByTimer()) {
                this.messagesService.showWarn(
                    'Sua sessão expirou. Por favor, faça login novamente.',
                    'Sessão expirada'
                );
                this.authService.logout();
            }
        });
    }
}
