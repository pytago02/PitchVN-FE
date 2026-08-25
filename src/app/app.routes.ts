import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/player-layout/player-layout.component').then(
        (m) => m.PlayerLayoutComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full'
      },
      {
        path: 'feed',
        loadComponent: () =>
          import('./features/feed/feed.component').then(
            (m) => m.FeedComponent
          ),
      },
      {
        path: 'post/:id',
        loadComponent: () =>
          import('./features/post-detail/post-detail.component').then(
            (m) => m.PostDetailComponent
          ),
      },
      {
        path: 'tim-san',
        loadComponent: () =>
          import('./features/pitch-finder/pitch-finder.component').then(
            (m) => m.PitchFinderComponent
          ),
      },
      {
        path: 'tim-keo',
        loadComponent: () =>
          import('./features/challenge-finder/challenge-finder.component').then(
            (m) => m.ChallengeFinderComponent
          ),
      },
      {
        path: 'giai-dau',
        loadComponent: () =>
          import('./features/tournament/tournament-list/tournament-list.component').then(
            (m) => m.TournamentListComponent
          ),
      },
      {
        path: 'giai-dau/:id',
        loadComponent: () =>
          import('./features/tournament/tournament-detail/tournament-detail.component').then(
            (m) => m.TournamentDetailComponent
          ),
      },
      {
        path: 'xep-hang',
        loadComponent: () =>
          import('./features/ranking/ranking.component').then(
            (m) => m.RankingComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'tin-nhan',
        loadComponent: () =>
          import('./features/chat/chat.component').then(
            (m) => m.ChatComponent
          ),
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'setup-profile',
    loadComponent: () =>
      import('./features/profile/setup-profile/setup-profile.component').then(
        (m) => m.SetupProfileComponent
      ),
  },
  {
    path: 'dev-test',
    loadComponent: () =>
      import('./features/dev-test/dev-test.component').then(
        (m) => m.DevTestComponent
      ),
  },
  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./pages/privacy-policy/privacy-policy').then(
        (m) => m.PrivacyPolicy
      ),
  },
];
