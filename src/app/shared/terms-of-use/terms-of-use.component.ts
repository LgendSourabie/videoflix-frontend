import { Component } from "@angular/core";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { RouterLink } from "@angular/router";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-terms-of-use",
  standalone: true,
  imports: [NavBarComponent, RouterLink],
  templateUrl: "./terms-of-use.component.html",
  styleUrl: "./terms-of-use.component.scss",
})
export class TermsOfUseComponent {
  isAuthenticated: boolean = false;

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
  }
}
