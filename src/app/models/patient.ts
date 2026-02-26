export interface Patient {
  id: number;
  name: string;
  surname: string;
  gender: 'male' | 'female'; // Чтобы не ошибиться в поле
  birthdate: string;         // В формате "2000-01-01"
  avatar: string;
  description: string;
  comment: string;
}
