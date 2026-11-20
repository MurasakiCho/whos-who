import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {

  private clientId = 'b1c44d214d3f4459a9375729746c8691';
  private redirectUri = 'http://127.0.0.1:4200/callback';
  private scopes = 'playlist-read-private';

  generateCodeVerifier(): string {
    const possible = 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const values = window.crypto.getRandomValues(new Uint8Array(64));

    return Array.from(values)
      .map(value => possible[value % possible.length])
      .join('');
  }

  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    const digest = await window.crypto.subtle.digest(
      'SHA-256',
      data
    );

    const base64 = btoa(
      String.fromCharCode(...new Uint8Array(digest))
    );

    return base64
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  async generatePKCEPair() {
    const verifier = this.generateCodeVerifier();
    const challenge = await this.generateCodeChallenge(verifier);

    return { verifier, challenge };
  }

  saveCodeVerifier(verifier: string): void {
    sessionStorage.setItem('code_verifier', verifier);
  }

  getCodeVerifier(): string | null {
    return sessionStorage.getItem('code_verifier');
  }

  async authorize(): Promise<void> {
    const { verifier, challenge } = await this.generatePKCEPair();

    this.saveCodeVerifier(verifier);

    //Generates random state value
    const state = Array.from(
      window.crypto.getRandomValues(new Uint8Array(16))
    ).map(byte => byte.toString(16).padStart(2, '0')).join('');

    sessionStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state: state
    });

    window.location.assign(
      `https://accounts.spotify.com/authorize?${params.toString()}`
    );
  }

  async exchangeCodeforToken(code: string, verifier: string): Promise<any> {
    const body = new URLSearchParams({
      client_id: this.clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      code_verifier: verifier
    });

    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      }
    )

    if(!response.ok) {
      throw new Error(`Spotify token exchange failed: ${response.status}`);
    }

    return response.json();
  }
}
