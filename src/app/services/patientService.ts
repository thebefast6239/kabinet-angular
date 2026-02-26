import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Patient } from '../models/patient';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private url = 'https://e53379293a31b6cf.mokky.dev/patients';

  patients = signal<Patient[]>([]);

  // get all
  async loadAll(query: string = '') {
    try {
      let finalUrl = this.url;

      if (query.trim()) {
        // Оставляем только один параметр name, так как Mokky не умеет в OR между разными полями через URL
        // Чтобы искало по фамилии ТОЖЕ через API, тебе пришлось бы делать два запроса.
        const searchTerm = `*${query.trim()}*`;
        finalUrl = `${this.url}?name=${encodeURIComponent(searchTerm)}`;
      }

      const data = await firstValueFrom(this.http.get<Patient[]>(finalUrl));
      this.patients.set(data);
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    }
  }

  // get by ID
  getById(id: string) {
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  // patch (update)
  updateComment(id: string, comment: string) {
    return this.http.patch(`${this.url}/${id}`, { comment });
  }

  updatePatient(id: string | number, patientData: any) {
    return this.http.patch(`${this.url}/${id}`, patientData);
  }

  // delete
  deletePatient(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // create
  create(patient: Partial<Patient>) {
    return this.http.post<Patient>(this.url, patient);
  }
}
