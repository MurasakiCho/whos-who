import { Injectable } from '@angular/core';

/*interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
}*/

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private playlist: any;

  setPlaylist(playlist: any) {
    this.playlist = playlist;
  }

  getPlaylist() {
    return this.playlist;
  }
}
