import { Video } from "./../modules/interfaces";
import { Injectable, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RequestsService {
  private videoSubject = new BehaviorSubject<Video[] | []>([]);
  videos$ = this.videoSubject.asObservable();

  private recentVideoSubject = new BehaviorSubject<Video[] | []>([]);
  recentVideos$ = this.recentVideoSubject.asObservable();

  private categorizedVideoSubject = new BehaviorSubject<
    { action: Video[]; horror: Video[]; drama: Video[]; documentary: Video[]; technic: Video[] } | { action: []; horror: []; drama: []; documentary: []; technic: [] }
  >({ action: [], horror: [], drama: [], documentary: [], technic: [] });
  categorizedVideos$ = this.categorizedVideoSubject.asObservable();

  private currentVideoSubject = new BehaviorSubject<Video | null>(null);
  currentVideos$ = this.currentVideoSubject.asObservable();

  private responseSubject = new BehaviorSubject<{ message: string | null }>({
    message: null,
  });
  response$ = this.responseSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private isErrorSubject = new BehaviorSubject<boolean>(false);
  isError$ = this.isErrorSubject.asObservable();

  private errorMessageSubject = new BehaviorSubject<any>({
    type: [null],
    message: [null],
  });

  errorMessage$ = this.errorMessageSubject.asObservable();

  private apiService = inject(ApiService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  emitVideos(data: Video[] | []) {
    this.videoSubject.next(data);
  }

  emitCurrentVideos(data: Video | null) {
    this.currentVideoSubject.next(data);
  }

  emitRecentVideos(data: Video[] | []) {
    this.recentVideoSubject.next(data);
  }

  emitCategorizedVideos(
    data: { action: Video[]; horror: Video[]; drama: Video[]; documentary: Video[]; technic: Video[] } | { action: []; horror: []; drama: []; documentary: []; technic: [] }
  ) {
    this.categorizedVideoSubject.next(data);
  }

  emitIsLoading(bool: boolean) {
    this.isLoadingSubject.next(bool);
  }

  emitResponse(response: { message: string | null }) {
    this.responseSubject.next(response);
  }

  resetResponse() {
    this.responseSubject.next({ message: null });
  }

  emitIsError(bool: boolean) {
    this.isErrorSubject.next(bool);
  }

  emitErrorMessage(message: any) {
    try {
      this.errorMessageSubject.next(message);
    } catch (error) {
      console.log("Typeerror");
    }
  }

  /**
   *
   * @param endpoint: string - API endpoint for fetching video data
   * @param token : string - token of the authenticated user
   */
  getData(endpoint: string, token: string, callback: (arg: any) => void) {
    this.emitIsLoading(true);
    this.apiService.getData(endpoint, token).subscribe({
      next: response => {
        callback(response.body);
      },
      error: error => {
        this.emitErrorMessage(error.message);
      },
      complete: () => {
        this.resetLoading(5000);
      },
    });
  }

  /**
   * Generic method for handling all post requests
   * @param data - payload for the post request
   */
  async postData(endpoint: string, data: any, header: HttpHeaders, callback: () => void) {
    this.apiService.postData(endpoint, data, header).subscribe({
      next: response => {
        this.emitResponse(response);
        if (response.token) {
          if (endpoint === "login/") {
            this.getData("api/videos/", response.token, data => this.emitVideos(data));
            this.getData("api/videos/categorized_videos/", response.token, data => this.emitCategorizedVideos(data));
            this.getData("api/videos/recent_videos/", response.token, data => this.emitRecentVideos(data));
            sessionStorage.setItem("token", response.token);
          }
        }
      },
      complete: () => {
        callback();
        this.resetLoading(2500);
      },
      error: error => {
        if (error.status === 400 || error.status === 404) {
          this.emitErrorMessage(error.error);
          this.resetLoading(0);
          return error.error;
        } else {
          this.emitErrorMessage(error.message);
          this.resetLoading(0);
          return error.message;
        }
      },
    });
  }

  resetLoading(timestamp: number) {
    setTimeout(() => {
      this.emitIsLoading(false);
    }, timestamp);
  }

  resetErrorState() {
    this.emitIsError(false);
    this.emitErrorMessage({
      type: [null],
      message: [null],
    });
  }

  goToPage(pageRoute: string) {
    const returnUrl = this.route.snapshot.queryParams["returnUrl"] || pageRoute;
    this.router.navigate([returnUrl]);
  }
}
