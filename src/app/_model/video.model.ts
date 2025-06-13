import { SafeResourceUrl } from "@angular/platform-browser";

export interface Video {
    id: number;
    title: string;
    videoId: string;
    safeUrl?: SafeResourceUrl;  
}