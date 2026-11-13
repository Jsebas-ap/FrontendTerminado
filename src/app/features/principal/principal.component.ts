import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal',
  imports: [FormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
export class PrincipalComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  buscarLibro(): void {
    this.router.navigate(['/catalogo'], {
      queryParams: { titulo: this.searchTerm.trim() }
    });
  }
}
