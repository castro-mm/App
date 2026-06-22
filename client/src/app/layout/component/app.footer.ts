import { Component } from '@angular/core';
import { APP_INFO } from '@/core/constants/app.info';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <span style="display:inline-flex; align-items:center; gap:0.4rem;">
            <img src="assets/branding/icon-color.svg" alt="" style="height:1.4rem; display:block; flex-shrink:0;">
            <span class="font-bold" style="color:var(--primary-color);">{{ appInfo.name }}</span>
        </span>
    </div>`
})
export class AppFooter {
    protected readonly appInfo = APP_INFO;
}
