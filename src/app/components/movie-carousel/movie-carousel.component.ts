import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import Glide from "@glidejs/glide";
import { RequestsService } from "../../services/requests.service";
import { Video } from "../../modules/interfaces";
import { Router } from "@angular/router";
import { ModuleService } from "../../services/module.service";
@Component({
  selector: "app-movie-carousel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./movie-carousel.component.html",
  styleUrl: "./movie-carousel.component.scss",
})
export class MovieCarouselComponent implements OnInit {
  @Input({ required: true }) videos: Video[] = [];
  @ViewChild("glide") glideRef!: ElementRef;
  token: string | null = null;
  currentVideo: Video | null = null;

  constructor(private router: Router, private moduleService: ModuleService, private requestsService: RequestsService) {}

  ngOnInit(): void {
    this.requestsService.currentVideos$.subscribe(video => {
      this.currentVideo = video;
    });
  }

  ngAfterViewInit() {
    new Glide(this.glideRef.nativeElement, {
      type: "carousel",
      perView: 4,
      gap: 90,
      focusAt: "center",
      hoverpause: true,
      breakpoints: {
        1315: { perView: 3 },
        768: { perView: 3 },
        550: { perView: 2 },
        350: { perView: 1.75 },
      },
    }).mount();
  }

  handleClick(event: Event) {
    const target = event.target as HTMLElement;

    if (target.closest("[data-clickable]")) {
      const slide = target.closest(".glide__slide");

      if (slide) {
        const videoId = slide.getAttribute("data-video-id");
        this.updateRecentVideo(Number(videoId));
      }
    }
  }

  stringifyVideoDuration(duration: number) {
    return this.moduleService.convertDurationToString(duration);
  }

  updateRecentVideo(videoId: number | null) {
    if (!videoId) return;

    this.token = sessionStorage.getItem("token");
    if (this.token) {
      this.requestsService.getData(`api/videos/${videoId}`, this.token, data => {
        this.requestsService.emitCurrentVideos(data);
      });
      this.router.navigateByUrl("/player");
    }
  }
}
