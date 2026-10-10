import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-network',
  imports: [FormsModule],
  templateUrl: './network.html',
  styleUrl: './network.css',
})
export class Network {
  searchVal = signal('');
  items = signal([
    { name: 'Test Jane', role: 'Angular Developer' },
    { name: 'Abby Die', role: 'Angular Developer' },
  ]);
  filteredItems = computed(() => {
    const query = this.searchVal().toLowerCase().trim();

    if (!query) return this.items();
    return this.items().filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  });
  filters = signal([
    { value: 'topDevs', label: 'Weeks Top Developer', checked: false },
    { value: 'seniorDevs', label: 'Senior Developers', checked: false },
    { value: 'angDevs', label: 'Angular Developers', checked: false },
  ]);
  showFilters = signal(false);
  toggleFilters() {
    this.showFilters.update((open) => !open);

    console.log(this.showFilters());
  }

  applyFilters() {
    const activeFilters = this.filters()
      .filter((f) => f.checked)
      .map((f) => f.value);
    console.log('Selected filters:', activeFilters);
    // Add your filtering logic for your data array here
  }

  sendNetworkRequest() {
    console.log('hehe');
  }
}
