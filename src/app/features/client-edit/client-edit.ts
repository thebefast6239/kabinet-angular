import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patientService';
import { Patient } from '../../models/patient';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

// for material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-client-edit',
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
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})
export class ClientEdit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private router = inject(Router);

  // Angular сам засунет сюда ID из ссылки /doctor/comment/:id
  id = input.required<string>();

  // Сигнал для текущего пациента
  patient = signal<Partial<Patient>>({
      name: '',
      surname: '',
      gender: 'male',
      birthdate: '',
      avatar: '',
      description: '',
      comment: ''
    });

  isReadonly = signal<boolean>(false);
  // Загружаем данные конкретного пациента
  ngOnInit() {
    this.isReadonly.set(this.route.snapshot.data['readonly'] ?? false);

    this.patientService.getById(this.id()).subscribe(data => {
      this.patient.set(data);
    });
  }

  savePatient() {
    const currentPatient = this.patient();

    if (currentPatient && currentPatient.id) {
      // Отправляем весь объект или только нужные поля.
      // Mokky.dev (и большинство REST API) при PATCH обновит только те поля, которые вы прислали.

      this.patientService.updatePatient(currentPatient.id, currentPatient)
        .subscribe({
          next: (response) => {
            console.log('Данные успешно обновлены:', response);
            alert('Изменения сохранены!');

            // Редирект в зависимости от роли или статуса
            const targetRoute = this.isReadonly() ? '/client' : '/doctor';
            this.router.navigate([targetRoute]);
          },
          error: (err) => {
            console.error('Ошибка сохранения:', err);
            alert('Не удалось сохранить данные.');
          }
        });
    }
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
