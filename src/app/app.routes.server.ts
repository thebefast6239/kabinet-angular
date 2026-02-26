import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Маршрут для доктора
  {
    path: 'doctor/:id',
    renderMode: RenderMode.Server
  },
  // Маршрут для админки
  {
    path: 'client/view/:id',
    renderMode: RenderMode.Server
  },
  // Все остальные (статичные) страницы
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
