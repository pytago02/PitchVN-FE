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
    ],
  },
  {
    path: 'dev-test',
    loadComponent: () =>
      import('./features/dev-test/dev-test.component').then(
        (m) => m.DevTestComponent
      ),
  },
];
