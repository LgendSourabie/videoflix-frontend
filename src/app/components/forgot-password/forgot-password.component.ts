import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { RequestsService } from "../../services/requests.service";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [FormsModule, FooterComponent, NavBarComponent, WrapperComponent],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.scss",
})
export class ForgotPasswordComponent implements OnInit {
  email: string | null = null;
  errorMessage: string | null = null;
  errorType: string | null = null;
  showForm: boolean = false;

  constructor(private requestsService: RequestsService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.requestsService.errorMessage$.subscribe(message => {
      this.errorMessage = message["message"][0];
      this.errorType = message["type"][0];
    });
  }

  sendEmailResetPassword() {
    this.requestsService.postData("reset-password/", { email: this.email }, this.apiService.getUnAuthHeaders(), () => {
      this.email = "";
      this.showForm = true;
    });
  }
}
