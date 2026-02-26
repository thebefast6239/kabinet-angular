import { Routes } from '@angular/router';
import { DoctorDashboard } from './features/doctor-dashboard/doctor-dashboard';
import { ClientDetails } from './features/client-details/client-details';
import { ClientAdmin } from './features/client-admin/client-admin';
import { ClientEdit } from './features/client-edit/client-edit';
import { ClientAdd } from './features/client-add/client-add';

export const routes: Routes = [
  { path: 'doctor', component: DoctorDashboard, title: 'KABINET | Кабинет врача' },
  { path: 'doctor/view/:id', component: ClientDetails, title: 'KABINET | Просмотр пациента' },
  { path: 'doctor/comment/:id', component: ClientDetails, data: { readonly: false }, title: 'KABINET | Редактировать заметку' },

  { path: 'client', component: ClientAdmin, title: 'KABINET | Админ-панель' },
  { path: 'client/view/:id', component: ClientDetails, data: { readonly: true }, title: 'KABINET | Просмотр клиента' },
  { path: 'client/edit/:id', component: ClientEdit, data: { readonly: true }, title: 'KABINET | Редактировать клиента' },
  { path: 'client/add', component: ClientAdd, data: { readonly: true }, title: 'KABINET | Добавить клиента'  },

  { path: '', redirectTo: 'doctor', pathMatch: 'full' }
];
