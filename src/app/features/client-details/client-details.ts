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
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-client-details',
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
    MatIconModule,
    MatListModule,
    MatDividerModule
  ],
  templateUrl: './client-details.html',
  styleUrl: './client-details.scss',
})
export class ClientDetails {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private router = inject(Router);

  // Angular сам засунет сюда ID из ссылки /doctor/comment/:id
  id = input.required<string>();

  // Сигнал для текущего пациента
  patient = signal<Patient | null>(null);

  isReadonly = signal<boolean>(false);
  // Загружаем данные конкретного пациента
  ngOnInit() {
    this.isReadonly.set(this.route.snapshot.data['readonly'] ?? false);

    this.patientService.getById(this.id()).subscribe(data => {
      this.patient.set(data);
    });
  }

  save() {
    const currentPatient = this.patient();
    if (currentPatient) {
      this.patientService.updateComment(currentPatient.id.toString(), currentPatient.comment)
        .subscribe(() => {
          alert('Сохранено!');
          this.router.navigate(['/doctor']); // автовозврат назад
        });
    }
  }
}
