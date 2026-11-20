import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { PlaylistService } from "../../services/playlist.service";
import fetchFromSpotify from "../../services/api"

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private playlistService: PlaylistService) {}

  genres: { name: string; playlist_id: string }[] = []
  selectedGenre: string = ""
  selectedPlaylistId: string = ""
  authLoading: boolean = false
  configLoading: boolean = false
  token: string = "BQDfR42dcQLyvZg2eDHlSNYH7lwf84qBoFbaIzUKBnYAkqCjkKXsFaUkX9tORYZPUkfZ8yENSRgnUEYxAu7S-5RewETIkXMgnpUDFp5Z4j1pbbAA8Q8"
  playlist: any

  playlistLoading: boolean = false
  playlistReady: boolean = false
  playlistError: string = ""

  private requestId = 0;

  ngOnInit(): void {
    this.loadGenres(this.token)
  }

  loadGenres = async (t: any) => { // this is not loading anything from Spotify's API
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
    const genreObj = this.genres.find((g) => g.playlist_id === selectedPlaylistId)
    const currentRequestId = ++this.requestId;

    if(!genreObj) return;

    this.selectedGenre = genreObj.name
    this.selectedPlaylistId = genreObj.playlist_id

    this.playlistLoading = true
    this.playlistReady = false
    this.playlistError = ""

    this.playlistService.setPlaylist(null)

    try {
      const playlist = await fetchFromSpotify({
        token: this.token,
        endpoint: "playlists/" + this.selectedPlaylistId,
        params: ''
      })

      if(currentRequestId !== this.requestId) return;

      this.playlistService.setPlaylist(playlist)
      this.playlistReady = true

    } catch (error) {
      if(currentRequestId !== this.requestId) return;

      this.playlistError = "Couldn't load the playlist. Please try again."
      console.error("Failed to retrieve playlist: ", error);
    } finally {
      if(currentRequestId === this.requestId) this.playlistLoading = false
    }
  } 

  playGame() {
    if (!this.playlistReady) {
      return
    }
    this.router.navigate(["/gameplay"])
  }

}
