import { Routes } from "@angular/router";

export default [
    {
        path: 'exemplo',
        loadComponent: () => import('./exemplo/exemplo.component').then(m => m.ExemploComponent),
    },
    // Adicione aqui as rotas das features do seu domínio
    // Exemplo:
    // {
    //     path: 'minha-entidade',
    //     loadComponent: () => import('./minha-entidade/minha-entidade.component').then(m => m.MinhaEntidadeComponent),
    // },
] as Routes;
