import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PatientService } from '../../services/patientService';
import { Patient } from '../../models/patient';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-add',
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    provideNativeDateAdapter(), // КРИТИЧНО: без этого календарь не откроется
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' } // Чтобы был формат ДД.ММ.ГГГГ
  ],
  templateUrl: './client-add.html',
  styleUrl: './client-add.scss',
})
export class ClientAdd {
  private patientService = inject(PatientService);
  private router = inject(Router);

  // Используем Partial, так как ID еще нет
  patient = signal<Partial<Patient>>({
    name: '',
    surname: '',
    gender: 'male',
    birthdate: '',
    avatar: '',
    description: '',
    comment: ''
  });

  createPatient() {
    const newPatient = this.patient();
    this.patientService.create(newPatient).subscribe({
      next: () => {
        alert('Пациент успешно добавлен!');
        this.router.navigate(['/client']);
      },
      error: (err) => {
        console.error('Ошибка:', err);
        alert('Не удалось добавить пациента.');
      }
    });
  }

  generateRandomAvatar() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Генерируем случайную длину от 1 до 9
    const length = Math.floor(Math.random() * 9) + 1;

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${result}`;

    // Обновляем сигнал пациента
    this.patient.update(p => ({ ...p, avatar: newUrl }));
  }
}
