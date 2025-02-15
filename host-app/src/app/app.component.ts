import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { log } from 'node:console';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,RouterModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'host-app';
  role:string='';
  username:string='';
  activeMenu: string | null = null;
  currentUrl: string = '';
  isDropdownOpen: boolean = false; 
  searchQuery: string = '';
  filteredItems: any[] = [];
  allowedClaimsRoles: string[] = ['Insitz Plus Admin', 'Customer Leadership', 'BPaaS Leadership', 'BPaaS Manager', 'BPaas Leads', 'BPaas Claims Analyst']; 
  allowedEnrollmentRoles: string[] = ['Insitz Plus Admin', 'Customer Leadership', 'BPaaS Leadership', 'BPaaS Manager', 'BPaas Leads', 'BPaas Enrollment Analyst']; 
  allowedCallCenterRoles: string[] = ['Insitz Plus Admin', 'Customer Leadership', 'BPaaS Leadership', 'BPaaS Manager']; 
  constructor(private router: Router) {
  }
  ngOnInit() {
    if (!localStorage.getItem('role')) {
      localStorage.setItem('role', 'Insitz Plus Admin');
    }
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', 'Steve');
    }
    this.role = localStorage.getItem('role') || '';
    this.username = localStorage.getItem('username') || '';
    console.log('Role: ', this.role);
    console.log('Username: ', this.username);
    
    this.currentUrl = this.router.url; // Set initial URL

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url; // Update on route change
      }
    });
  }
  getInitials(name: string): string {
    const names = name.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
    return initials;
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.profile-dropdown')) {
      this.isDropdownOpen = false;
    }
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(['/']); // Redirect to login page after logout
  }
  

  toggleMenu(menuName: string) {
    if (this.activeMenu === menuName) {
      this.activeMenu = null; // Close if the same menu is clicked again
    } else {
      this.activeMenu = menuName; // Open the clicked menu and close others
    }
  }
  canAccessClaims(): boolean {
    return this.allowedClaimsRoles.includes(this.role.trim()); // Trim to remove spaces
  }
  canAccessEnrollment(): boolean {
    return this.allowedEnrollmentRoles.includes(this.role.trim()); // Trim to remove spaces
  }
  canAccessCallCenter(): boolean {
    return this.allowedCallCenterRoles.includes(this.role.trim()); // Trim to remove spaces
  }

  menuItems = [
    {
      name: 'claims',
      label: 'Claims', 
      submenus: [
        { label: 'Production Report', link: '/businessOperation/claims/productionReport'},
        { label: 'Pending Claims-New', link: '/businessOperation/claims/pendingClaimsNew'},
        { label: 'Pending Claims-Adjusted', link: '/businessOperation/claims/pendingClaimsAdjusted'},
        { label: 'Finalized Claims', link: '/businessOperation/claims/finalizedClaims'}
      ]
    },
    {
      name: 'enrollment',
      label: 'Enrollment',
      submenus: [
        { label: 'Enrollment Aging', link: '/businessOperation/enrollment/enrollmentAging'},
        { label: 'ID Card Aging', link: '/businessOperation/enrollment/idCardAging'},
        { label: 'ID Card Status', link: '/businessOperation/enrollment/idCardStatus'},
        { label: 'TAT-Enrollments', link: '/businessOperation/enrollment/tatEnrollments'}
      ]
    },
    {
      name: 'callCenter',
      label: 'Call Center',
      submenus: [
        { label: 'Overall SLA', link: '/businessOperation/callCenter/overallSLA'},
        { label: 'Team Details', link: '../teamDetails'}
      ]
    }
  ];

  filterMenu() {
    if (!this.searchQuery.trim()) {
      this.filteredItems = [];
      return;
    }
  
    this.filteredItems = [];
  
    this.menuItems.forEach(menu => {
      // Check if parent menu matches search
      if (menu.label.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        this.filteredItems.push({ label: menu.label, link: '' });
      }
  
      // Check if any submenu matches search
      menu.submenus.forEach(sub => {
        if (sub.label.toLowerCase().includes(this.searchQuery.toLowerCase())) {
          this.filteredItems.push({ label: sub.label, link: sub.link });
        }
      });
    });
  }
  
  clearSearch() {
    this.searchQuery = '';
    this.filteredItems = [];
  }
}