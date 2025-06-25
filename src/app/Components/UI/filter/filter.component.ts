import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  @Output() filterChanged = new EventEmitter<string>();

  options = ['All', 'Alive', 'Dead', 'unknown'];
  selectedFilter: string = 'All';

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterChanged.emit(filter);
  }
}
