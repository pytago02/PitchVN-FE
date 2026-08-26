import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare const FB: any;

export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
}

export interface FacebookLoginResult {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FacebookAuthResponse;
}

@Injectable({
  providedIn: 'root'
})
export class FacebookSdkService {
  private sdkLoaded = false;
  private sdkLoadPromise: Promise<void> | null = null;

  /** Load Facebook JS SDK một lần duy nhất. */
  loadSdk(): Promise<void> {
    if (this.sdkLoaded) return Promise.resolve();
    if (this.sdkLoadPromise) return this.sdkLoadPromise;

    this.sdkLoadPromise = new Promise<void>((resolve, reject) => {
      (window as any).fbAsyncInit = () => {
        FB.init({
          appId: environment.facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v21.0'
        });
        this.sdkLoaded = true;
        resolve();
      };

      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = 'https://connect.facebook.net/vi_VN/sdk.js';
        script.async = true;
        script.defer = true;
        script.onerror = () => reject(new Error('Khong the tai Facebook SDK'));
        document.head.appendChild(script);
      } else {
        if (typeof FB !== 'undefined') {
          this.sdkLoaded = true;
          resolve();
        }
      }
    });

    return this.sdkLoadPromise;
  }

  /** Mo cua so dang nhap Facebook. */
  login(scope: string = 'public_profile,email'): Promise<FacebookLoginResult> {
    return this.loadSdk().then(() => {
      return new Promise<FacebookLoginResult>((resolve) => {
        FB.login((response: FacebookLoginResult) => resolve(response), { scope });
      });
    });
  }

  /** Kiem tra trang thai dang nhap hien tai. */
  getLoginStatus(): Promise<FacebookLoginResult> {
    return this.loadSdk().then(() => {
      return new Promise<FacebookLoginResult>((resolve) => {
        FB.getLoginStatus((response: FacebookLoginResult) => resolve(response));
      });
    });
  }

  /** Dang xuat khoi Facebook session. */
  logout(): Promise<void> {
    return this.loadSdk().then(() => {
      return new Promise<void>((resolve) => { FB.logout(() => resolve()); });
    });
  }
}
