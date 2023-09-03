import { Component } from '@angular/core';
import { Supervisor } from 'src/app/model/supervisor';

@Component({
  selector: 'app-nav-bar-supervisor',
  templateUrl: './nav-bar-supervisor.component.html',
  styleUrls: ['./nav-bar-supervisor.component.css'],
})
export class NavBarSupervisorComponent {
  supervisor: Supervisor | null = null;

  ngOnInit(): void {
    this.supervisor = JSON.parse(
      localStorage.getItem('supervisor') || '{}',
    ) as Supervisor;
  }

  logOut() {
    localStorage.clear();
    window.location.reload();
  }
}
