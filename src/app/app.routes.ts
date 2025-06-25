import { Routes } from '@angular/router';
import { CharacterListComponent } from './Components/UI/card/card.component'; // Ajuste o caminho
import { CharacterDetailComponent } from './Components/UI/card-detail/card-detail.component';

export const routes: Routes = [
    { path: '', component: CharacterListComponent, pathMatch: 'full'},
    { path: 'character/:id', component: CharacterDetailComponent },
];

