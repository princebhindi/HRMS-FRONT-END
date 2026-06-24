import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-ep-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './ep-sidebar.html',
  styleUrl: './ep-sidebar.css',
})
export class EpSidebar {
  isCollapsed = false;

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
