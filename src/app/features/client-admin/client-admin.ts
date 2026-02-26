import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../services/patientService';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-client-admin',
  imports:[
    MatIcon,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    DatePipe,
    RouterLink,
    MatRippleModule,
    MatDivider,
  ],
  templateUrl: './client-admin.html',
  styleUrl: './client-admin.scss',
})
export class ClientAdmin {
  private patientService = inject(PatientService);
  allPatients = this.patientService.patients;

  // Сигналы и RxJS для поиска
  searchQuery = signal('');
  genderFilter = signal<string>('all');
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Ссылка на сигнал из сервиса
  filteredPatients = signal<any[]>([]);

  constructor() {
      // Настраиваем логику поиска
      this.searchSubscription = this.searchSubject.pipe(
        debounceTime(600), // Ждем 0.6 сек после ввода
        distinctUntilChanged() // Не шлем запрос, если текст не изменился
      ).subscribe(query => {
        this.applySearch(query);
      });
    }

  async ngOnInit() {
    // Ждем загрузки всех пациентов
    await this.patientService.loadAll();
    // По умолчанию показываем всех
    this.filteredPatients.set(this.allPatients());
  }

  // Вызывается при каждом нажатии клавиши в HTML
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.searchSubject.next(value);
  }

  // Метод, который реально дергает сервис
  applySearch(query: string) {
    const q = query.toLowerCase().trim();
    this.searchQuery.set(q);
    this.filterData();
  }

  // Выносим фильтрацию в отдельный метод, чтобы вызывать её и при поиске, и при клике на пол
  filterData() {
    const q = this.searchQuery().toLowerCase();
    const gender = this.genderFilter();

    const filtered = this.allPatients().filter(p => {
      // Проверка по имени/фамилии
      const matchesSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.surname?.toLowerCase().includes(q);

      // Проверка по полу
      const matchesGender = gender === 'all' || p.gender === gender;

      return matchesSearch && matchesGender;
    });

    this.filteredPatients.set(filtered);
  }

  // Метод для переключения пола
  setGenderFilter(val: string) {
    this.genderFilter.set(val);
    this.filterData();
  }

  // Очистка поиска
  clearSearch() {
    this.searchQuery.set('');
    this.filteredPatients.set(this.allPatients());
  }

  ngOnDestroy() {
    this.searchSubscription?.unsubscribe();
  }

  // метод для УДАЛЕНИЯ пациента
  delete(id: number) {
    if (confirm('Точно удалить этого пациента?')) {
      this.patientService.deletePatient(id).subscribe(async () => {
        // 1. Обновляем основной список в сервисе
        await this.patientService.loadAll();

        // 2. ВАЖНО: Сразу запускаем фильтрацию заново,
        // чтобы filteredPatients подхватил изменения
        this.applySearch(this.searchQuery());
      });
    }
  }
}
