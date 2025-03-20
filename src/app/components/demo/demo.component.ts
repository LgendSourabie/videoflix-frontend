import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import Plyr from "plyr";
// declare var Hls: any;
import Hls from "hls.js";
@Component({
  selector: "app-demo",
  standalone: true,
  imports: [],
  templateUrl: "./demo.component.html",
  styleUrl: "./demo.component.scss",
})
export class DemoComponent implements OnDestroy, AfterViewInit {
  @ViewChild("videoElement", { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  player!: Plyr;
  hls!: any;
  source = "assets/videos/city_beauty_5pm2NpD_hls/master.m3u8";
  // source = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;

    const controls = `
<div class="plyr__controls">
    
    <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
    </button>
   
    <div class="plyr__progress">
        <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
        <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
        <span role="tooltip" class="plyr__tooltip">00:00</span>
    </div>
    <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
    <div class="plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
    <button type="button" class="plyr__control" aria-label="Mute" data-plyr="mute">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
    </button>
    <div class="plyr__volume">
        <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
    </div>
    <button type="button" class="plyr__control" data-plyr="captions">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-captions-on"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-captions-off"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Disable captions</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Enable captions</span>
    </button>
    <button type="button" class="plyr__control" data-plyr="fullscreen">
        <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-exit-fullscreen"></use></svg>
        <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-enter-fullscreen"></use></svg>
        <span class="label--pressed plyr__tooltip" role="tooltip">Exit fullscreen</span>
        <span class="label--not-pressed plyr__tooltip" role="tooltip">Enter fullscreen</span>
    </button>
</div>
`;
    this.player = new Plyr(video, {
      controls,
    });

    if (!Hls.isSupported()) {
      video.src = this.source;
    } else {
      this.hls = new Hls();
      this.hls.loadSource(this.source);
      this.hls.attachMedia(video);

      this.player.on("languagechange", () => {
        setTimeout(() => (this.hls.subtitleTrack = this.player.currentTrack), 50);
      });
    }
  }

  ngOnDestroy() {
    if (this.hls) {
      this.hls.destroy();
    }
    if (this.player) {
      this.player.destroy();
    }
  }
}
