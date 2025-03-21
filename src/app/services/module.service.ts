import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ModuleService {
  constructor(private toastr: ToastrService) {}

  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable();

  emitEmail(email: string) {
    this.emailSubject.next(email);
  }

  convertDurationToString(seconds: number) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    } else {
      return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }
  }

  /**
   * success message when form submitted
   */
  successToast(message: string) {
    this.toastr.success(message);
  }

  /**
   * error message when form not submitted
   */
  errorToast(message: string) {
    this.toastr.error(message);
  }
}
