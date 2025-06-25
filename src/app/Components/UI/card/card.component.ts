import { Component, HostListener, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CharacterListComponent {
  private http = inject(HttpClient);
  private apiUrl = 'https://rickandmortyapi.com/api/character';
  private router = inject(Router);
  private currentPage = signal(1);
  isLoading = signal(false);
  hasMoreData = signal(true); 
  characters = signal<any[]>([]);
  searchQuery = signal<string>('');
  selectedFilter = signal<string>('All');
  selectedGenders = signal<string[]>([]);

  constructor() {
    this.loadCharacters();
  }

  private loadCharacters() {
    if (this.isLoading() || !this.hasMoreData()) return; 

    this.isLoading.set(true);

    const queryParams = new URLSearchParams();
    queryParams.set('page', this.currentPage().toString());

    const search = this.searchQuery();
    if (search) {
      queryParams.set('name', search);
    }

    const filter = this.selectedFilter();
    if (filter !== 'All') {
      queryParams.set('status', filter.toLowerCase());
    }

    const genders = this.selectedGenders();
    if (genders.length > 0) {
      queryParams.set('gender', genders.join(','));
    }

    this.http
      .get<any>(`${this.apiUrl}?${queryParams.toString()}`)
      .pipe(
        map((response) =>
          response.results.map((character: any) => ({
            id: character.id,
            name: character.name,
            status: character.status,
            species: character.species,
            gender: character.gender,
            location: character.location.name,
            image: character.image,
          }))
        ),
        catchError((error) => {
          console.error('Erro ao carregar personagens:', error);
          this.hasMoreData.set(false);
          return of([]);
        })
      )
      .subscribe((newCharacters) => {
        if (newCharacters.length === 0) {
          this.hasMoreData.set(false); 
        } else {
          if (this.currentPage() === 1) {
            this.characters.set(newCharacters);
          } else {
            this.characters.set([...this.characters(), ...newCharacters]);
          }
          this.currentPage.set(this.currentPage() + 1);
        }
        this.isLoading.set(false);
      });
  }

  handleGenderChange(event: Event, gender: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.onGenderChange(gender, isChecked);
  }

  onGenderChange(gender: string, isChecked: boolean) {
    const selectedGenders = this.selectedGenders();

    if (isChecked) {
      this.selectedGenders.set([...selectedGenders, gender]);
    } else {
      this.selectedGenders.set(selectedGenders.filter((g) => g !== gender));
    }

    this.currentPage.set(1);
    this.hasMoreData.set(true); 
    this.characters.set([]);
    this.loadCharacters();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query || '');
    this.currentPage.set(1);
    this.hasMoreData.set(true); 
    this.characters.set([]);
    this.loadCharacters();
  }

  onFilterChange(filter: string) {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
    this.hasMoreData.set(true); 
    this.characters.set([]);
    this.loadCharacters();
  }
   viewDetails(id: number) {
    this.router.navigate(['/character', id]); 
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      this.loadCharacters();
    }
  }
}
