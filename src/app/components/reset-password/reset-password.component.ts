import { Component, OnInit, ViewChild } from "@angular/core";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { FormsModule, NgForm } from "@angular/forms";
import { FooterComponent } from "../../shared/footer/footer.component";
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";
import { ActivatedRoute } from "@angular/router";
import { RequestsService } from "../../services/requests.service";
import { ApiService } from "../../services/api.service";
import { ModuleService } from "../../services/module.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [WrapperComponent, FormsModule, FooterComponent, NavBarComponent],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.scss",
})
export class ResetPasswordComponent implements OnInit {
  password!: string;
  confirmPassword!: string;
  icon: string = "visibility.svg";
  type: string = "password";
  icon_confirm: string = "visibility.svg";
  type_confirm: string = "password";
  uid: string | null = null;
  token: string | null = null;
  resetMessage: string = "";
  resetError: string = "";
  errorMessage: string | null = null;
  errorType: string | null = null;

  @ViewChild("form") formInput!: NgForm;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private requestsService: RequestsService, private moduleService: ModuleService) {}
  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get("uid");
    this.token = this.route.snapshot.paramMap.get("token");

    this.requestsService.errorMessage$.subscribe(message => {
      this.errorMessage = message["message"][0];
      this.errorType = message["type"][0];
    });
  }

  resetForm() {
    this.password = "";
    this.confirmPassword = "";
  }

  onNewPasswordRequest() {
    if (this.formInput.valid) {
      this.requestsService
        .postData(
          "new-password/",
          {
            uid: this.uid,
            token: this.token,
            new_password: this.password,
            confirm_new_password: this.confirmPassword,
          },
          this.apiService.getUnAuthHeaders(),
          () => {
            this.requestsService.goToPage("/login");
            this.moduleService.successToast("Your password has been reset, You can sign in now.");
          }
        )
        .then(() => {
          this.requestsService.errorMessage$.subscribe(error => {
            if (!error.message) {
              this.resetForm();
            }
          });
        });
    }
  }

  showPassword() {
    if (this.password && this.type === "password") {
      this.type = "text";
      this.icon = "visibility_off.svg";
    } else if (this.password && this.type === "text") {
      this.type = "password";
      this.icon = "visibility.svg";
    }
  }
  showConfirmPassword() {
    if (this.confirmPassword && this.type_confirm === "password") {
      this.type_confirm = "text";
      this.icon_confirm = "visibility_off.svg";
    } else if (this.confirmPassword && this.type_confirm === "text") {
      this.type_confirm = "password";
      this.icon_confirm = "visibility.svg";
    }
  }
}
