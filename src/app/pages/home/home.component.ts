import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { PlaylistService } from "../../services/playlist.service";
import fetchFromSpotify from "../../services/api"
import { SpotifyAuthService } from "src/app/services/spotify-auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router, 
    private playlistService: PlaylistService,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  isAuthenticated: boolean = false;

  genres: { name: string; playlist_id: string }[] = []
  selectedGenre: string = ""
  selectedPlaylistId: string = ""
  authLoading: boolean = false
  configLoading: boolean = false
  playlist: any

  playlistLoading: boolean = false
  playlistReady: boolean = false
  playlistError: string = ""

  private requestId = 0;

  ngOnInit(): void {
    try {
      const token = this.spotifyAuthService.getAccessToken();
  
      this.isAuthenticated = !!token;
      
    } catch (error) {
      console.error('Authentication check failed', error);
      this.isAuthenticated = false;
    }

    this.loadGenres();
  }

  loadGenres = async () => { // this is not loading anything from Spotify's API
    this.configLoading = true

    this.genres = [
      { name: "Rock Classics", playlist_id: "37i9dQZF1DWXRqgorJj26U" },
      { name: "Classic Hip Hop", playlist_id: "56un2laj6rmMUKhDlkUkAY" },
      { name: "Billboard Hot 100", playlist_id: "6UeSakyzhiEt4NB3UAd6NQ" },
      { name: "Greatest 90's Country", playlist_id: "0ZSp6ra6fFvGk4vyaqQea8" },
      { name: "Ultimate Millenial: Pop", playlist_id: "4KupkWcvdR4rfdd6qLjuHj" },
      { name: "Indie Mix", playlist_id: "37i9dQZF1EQqkOPvHGajmW" },
      { name: "Alternative Rock Mix", playlist_id: "37i9dQZF1EIefLxrHQP8p4" },
      { name: "K-Pop ON!", playlist_id: "37i9dQZF1DX9tPFwDMOaN1" },
      { name: "Emo Forever", playlist_id: "37i9dQZF1DX9wa6XirBPv8" },
    ]
    this.configLoading = false // why did you set it to true in the first place?
  }
  
  async setGenre(selectedPlaylistId: string) { 
    const genreObj = this.genres.find((g) => g.playlist_id === selectedPlaylistId);
    const currentRequestId = ++this.requestId;

    if(!genreObj) {
      this.playlistLoading = false;
      this.playlistReady = false;
      this.playlistError = "";
      this.playlistService.setPlaylist(null);
      return;
    }

    this.selectedGenre = genreObj.name;
    this.selectedPlaylistId = genreObj.playlist_id;

    this.playlistLoading = true;
    this.playlistReady = false;
    this.playlistError = "";

    this.playlistService.setPlaylist(null)

    try {
      const token = await this.spotifyAuthService.getValidAccessToken();

      if(currentRequestId !== this.requestId) return;

      if(!token) {
        this.isAuthenticated = false;
        return;
      }

      const playlist = await fetchFromSpotify({
        token: token,
        endpoint: "playlists/" + this.selectedPlaylistId,
        params: ''
      });

      if(currentRequestId !== this.requestId) return;

      this.playlistService.setPlaylist(playlist)
      this.playlistReady = true

    } catch (error) {
      if(currentRequestId !== this.requestId) return;

      this.playlistError = "Couldn't load the playlist. Please try again."
      console.error("Failed to retrieve playlist: ", error);

      if(!this.spotifyAuthService.getAccessToken()) {
        this.isAuthenticated = false;
      }
    } finally {
      if(currentRequestId === this.requestId) this.playlistLoading = false;
    }
  } 

  playGame() {
    if (!this.playlistReady) {
      return
    }
    this.router.navigate(["/gameplay"])
  }

  authorizeSpotify(): void {
    this.spotifyAuthService.authorize();
  }


  
}
