import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Video } from 'src/app/_model/video.model';
import { VideoService } from 'src/app/_services/video.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent {
  videos: Video[] = [];  
  successMessage: string = '';
  errorMessage: string = '';
  editingVideo: Video | null = null;

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
      this.videos = data.map((video: Video) => ({ // 
        ...video,
        safeUrl: this.getSafeUrl(video.videoId) 
      }));
      this.ref.detectChanges(); 
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
        this.videos.push(data); 
        this.successMessage = 'Video successfully added!';
        this.errorMessage = '';
        setTimeout(() => this.successMessage = '', 3000); 
        this.loadVideos(); 
      },
      error: (e) => {
        console.error(e);
        this.errorMessage = 'Failed to add video. Please try again!';
        this.successMessage = '';
        setTimeout(() => this.errorMessage = '', 3000); 
      }
    });
  }



  editVideo(video: Video): void {
    this.editingVideo = { ...video }; 
  }

  updateVideo(): void {
    if (this.editingVideo) {
      this.videoService.updateVideo(this.editingVideo.id, this.editingVideo).subscribe({
        next: (updatedVideo) => {
          const index = this.videos.findIndex(v => v.id === updatedVideo.id);
          if (index !== -1) {
            this.videos[index] = updatedVideo;
          }
          this.successMessage = 'Video updated successfully!';
          this.editingVideo = null;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error updating video', error);
          this.errorMessage = 'Failed to update video. Please try again!';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
    }
  }
  deleteVideo(id: number): void {
    this.videoService.deleteVideo(id).subscribe({
      next: () => {
        this.videos = this.videos.filter(video => video.id !== id);
        this.successMessage = 'Video successfully deleted!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error deleting video', error);
        this.errorMessage = 'Failed to delete video. Please try again!';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
