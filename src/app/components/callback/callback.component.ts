import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthService } from '../../services/spotify-auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private spotifyAuthService: SpotifyAuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const code = this.route.snapshot.queryParamMap.get('code');
    const state = this.route.snapshot.queryParamMap.get('state');
    const error = this.route.snapshot.queryParamMap.get('error');

    const savedState = sessionStorage.getItem('spotify_auth_state');

    if(error) {
      console.error('Spotify authorizaiton failed:', error);
      sessionStorage.removeItem('spotify_auth_state');
      this.spotifyAuthService.clearCodeVerifier();
      return;
    }

    if(!state || state !== savedState) {
      console.error('State mismatch. Possible CSRF attack.');
      sessionStorage.removeItem('spotify_auth_state');
      this.spotifyAuthService.clearCodeVerifier();
      return;
    }

    sessionStorage.removeItem('spotify_auth_state');

    const verifier = this.spotifyAuthService.getCodeVerifier();

    if(!verifier || !code) {
      console.error('Missing code verifier or authorization code.');
      this.spotifyAuthService.clearCodeVerifier();
      return;
    }

    try {
      const tokens = await this.spotifyAuthService.exchangeCodeforToken(code, verifier);

      this.spotifyAuthService.saveTokens(tokens);
      this.spotifyAuthService.clearCodeVerifier();
      
      this.router.navigate(['/home']);

    } catch (error) {
      console.error('Token exchange failed:', error);
      this.spotifyAuthService.clearCodeVerifier();
    }
  }
}
