import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video } from 'src/app/_model/video.model';
import { VideoService } from 'src/app/_services/video.service'; // Adjust path as necessary

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  videos: Video[] = [];  // Use the Video interface here

  constructor(
    private videoService: VideoService, 
    private ref: ChangeDetectorRef, 
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.videoService.getVideos().subscribe(data => {
      this.videos = data.map((video: Video) => ({ // Type each video as Video
        ...video,
        safeUrl: this.getSafeUrl(video.videoId) // Ensure URLs are sanitized
      }));
      this.ref.detectChanges(); // Trigger change detection manually
    });
  }

  getSafeUrl(videoId: string): SafeResourceUrl {
    const unsafeUrl = `https://www.youtube.com/embed/${videoId}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
  }

  addVideo(event: any): void {
    event.preventDefault();
    const title = event.target.title.value;
    const videoId = event.target.videoId.value;

    this.videoService.addVideo({ title, videoId }).subscribe({
      next: (data) => {
        console.log('Video added:', data);
        this.loadVideos(); // Refresh the list
      },
      error: (e) => console.error(e)
    });
  }
}
