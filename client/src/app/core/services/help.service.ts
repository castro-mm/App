import { Injectable, signal } from '@angular/core';

export interface HelpStep {
    icon: string;
    iconColor: string;
    title: string;
    description: string;
}

export interface HelpTip {
    icon: string;
    text: string;
}

export interface HelpContent {
    title: string;
    subtitle: string;
    coverIcon: string;
    coverColor: string;
    intro: string;
    steps: HelpStep[];
    tips?: HelpTip[];
}

// Adicione aqui entradas específicas de rotas do seu domínio
// Exemplo:
// const HELP_MAP: Record<string, HelpContent> = {
//     '/features/minha-entidade': {
//         title: 'Minha Entidade',
//         subtitle: 'Descrição da tela',
//         coverIcon: 'pi pi-list',
//         coverColor: '#6366f1',
//         intro: 'Descrição geral da funcionalidade.',
//         steps: [
//             { icon: 'pi pi-plus-circle', iconColor: '#10b981', title: 'Novo', description: 'Clique em Novo para criar.' },
//         ],
//     },
// };
const HELP_MAP: Record<string, HelpContent> = {};

const DEFAULT_HELP: HelpContent = {
    title: 'Ajuda',
    subtitle: 'Bem-vindo ao sistema',
    coverIcon: 'pi pi-question-circle',
    coverColor: '#6366f1',
    intro: 'Use o menu lateral para navegar entre as telas do sistema. Cada tela possui sua própria documentação de ajuda.',
    steps: [
        {
            icon: 'pi pi-bars',
            iconColor: '#6366f1',
            title: 'Menu de navegação',
            description: 'Use o menu lateral esquerdo para acessar as diferentes seções do sistema.',
        },
        {
            icon: 'pi pi-question-circle',
            iconColor: '#0ea5e9',
            title: 'Ajuda contextual',
            description: 'Este botão "?" exibe a documentação específica da tela em que você se encontra.',
        },
        {
            icon: 'pi pi-file-pdf',
            iconColor: '#ef4444',
            title: 'Manual do usuário',
            description: 'Acesse o seu perfil no topo da tela e clique em "Manual do Usuário" para baixar o manual completo em PDF.',
        },
    ],
};

@Injectable({ providedIn: 'root' })
export class HelpService {
    helpVisivel = signal(false);

    getHelpForRoute(url: string): HelpContent {
        const cleanUrl = url.split('?')[0].split('#')[0];
        return HELP_MAP[cleanUrl] ?? DEFAULT_HELP;
    }
}
