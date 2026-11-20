import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    const savedState = sessionStorage.getItem('spotify_auth_state');

    if(error) {
      console.error('Spotify authorizaiton failed:', error);
      return;
    }

    if(!state || state !== savedState) {
      console.error('State mismatch. Possible CSRF attack.');
      sessionStorage.removeItem('spotify_auth_state');
      return;
    }

    sessionStorage.removeItem('spotify_auth_state');

    const verifier = this.spotifyAuthService.getCodeVerifier();

    if(!code || !verifier) {
      console.error('Missing authorization code or code verifier.');
      return;
    }

    this.spotifyAuthService.exchangeCodeforToken(code, verifier)
      .then(token => {
        console.log('Successfully authenticated!', token);
      })
      .catch(error => {
        console.error('Token exchanged failed:', error);
      })
  }

}
