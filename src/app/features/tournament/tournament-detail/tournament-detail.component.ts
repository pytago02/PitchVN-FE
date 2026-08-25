import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MOCK_TOURNAMENTS, Tournament, TournamentStatus, TournamentTeam, TournamentMatch } from '../mock-tournament-data';
import { MOCK_TEAMS as MOCK_TEAMS_CHALLENGE } from '../../../features/challenge-finder/mock-challenge-data';
import { MOCK_PITCHES } from '../../../features/pitch-finder/mock-pitch-data';
import { TournamentService } from '../../../services/tournament/tournament.service';
import { SkeletonModule } from 'primeng/skeleton';

// Shared Components
import { TeamDetailPopupComponent } from '../../../shared/components/team-detail-popup/team-detail-popup.component';
import { PitchDetailPopupComponent } from '../../../shared/components/pitch-detail-popup/pitch-detail-popup.component';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';

export interface TeamStanding {
  teamId: string;
  name: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface GroupStanding {
  groupName: string;
  standings: TeamStanding[];
}

export interface BracketRound {
  roundName: string;
  matches: TournamentMatch[];
}

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TagModule,
    TabsModule,
    CardModule,
    TeamDetailPopupComponent,
    PitchDetailPopupComponent,
    SkeletonModule
  ],
  templateUrl: './tournament-detail.component.html',
  styleUrl: './tournament-detail.component.css'
})
export class TournamentDetailComponent implements OnInit {
  tournament = signal<Tournament | null>(null);
  isLoading = signal<boolean>(true);
  activeTab = signal<any>(0);

  constructor(private route: ActivatedRoute, private tournamentService: TournamentService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading.set(true);
      this.tournamentService.getById(id).subscribe({
        next: (data: any) => {
          let prizePool = 0;
          let entryFee = 0;
          try {
            if (data.prizePool) {
              const pp = typeof data.prizePool === 'string' ? JSON.parse(data.prizePool) : data.prizePool;
              prizePool = pp.champion || pp.total || 0;
            }
          } catch(e){}
          
          const mappedTournament: Tournament = {
            id: data.id || '',
            name: data.name || 'Unknown',
            thumbnail: data.coverImage || 'https://images.unsplash.com/photo-1518605368461-1ee11c5211b6?auto=format&fit=crop&q=80&w=800',
            status: data.status as TournamentStatus || 'upcoming',
            format: data.format || 'vong_bang',
            startDate: data.startDate ? new Date(data.startDate).toISOString() : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString() : '',
            location: data.location || '',
            description: data.description || '',
            registeredTeams: 0,
            maxTeams: data.maxTeams || 16,
            prize: prizePool + 'đ',
            fee: entryFee,
            organizer: {
              id: data.organizerId || 'org',
              name: 'Admin',
              avatar: 'https://i.pravatar.cc/150?u=admin'
            },
            minRank: 'C',
            teams: MOCK_TOURNAMENTS[0].teams,
            matches: MOCK_TOURNAMENTS[0].matches
          };
          this.tournament.set(mappedTournament);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }

  // Preview matches for Overview tab
  recentMatches = computed<TournamentMatch[]>(() => {
    const t = this.tournament();
    if (!t || !t.matches) return [];
    return t.matches
      .filter(m => m.status === 'finished' || m.status === 'live')
      .slice(0, 3);
  });

  nextMatches = computed<TournamentMatch[]>(() => {
    const t = this.tournament();
    if (!t || !t.matches) return [];
    return t.matches
      .filter(m => m.status === 'scheduled')
      .slice(0, 3);
  });

  matchesByRound = computed<{ roundName: string; matches: TournamentMatch[] }[]>(() => {
    const t = this.tournament();
    if (!t || !t.matches) return [];

    const roundsMap = new Map<string, TournamentMatch[]>();
    t.matches.forEach(match => {
      const roundName = match.round;
      if (!roundsMap.has(roundName)) {
        roundsMap.set(roundName, []);
      }
      roundsMap.get(roundName)!.push(match);
    });

    const result: { roundName: string; matches: TournamentMatch[] }[] = [];
    roundsMap.forEach((matches, roundName) => {
      result.push({ roundName, matches });
    });
    return result;
  });

  // Calculate standings dynamically based on match scores
  groupStandings = computed<GroupStanding[]>(() => {
    const t = this.tournament();
    if (!t || !t.teams || t.format === 'loai_truc_tiep') {
      return [];
    }

    // Initialize map with empty stats for each team
    const teamStatsMap = new Map<string, TeamStanding>();
    t.teams.forEach(team => {
      teamStatsMap.set(team.name, {
        teamId: team.id,
        name: team.name,
        logo: team.logo,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      });
    });

    // Scan through all finished/live matches in group stage
    if (t.matches) {
      t.matches.forEach(match => {
        if (match.stage === 'group' && (match.status === 'finished' || match.status === 'live')) {
          const statsA = teamStatsMap.get(match.teamA.name);
          const statsB = teamStatsMap.get(match.teamB.name);
          const scoreA = match.teamA.score ?? 0;
          const scoreB = match.teamB.score ?? 0;

          if (statsA && statsB) {
            statsA.played++;
            statsB.played++;
            statsA.goalsFor += scoreA;
            statsA.goalsAgainst += scoreB;
            statsA.goalDifference = statsA.goalsFor - statsA.goalsAgainst;

            statsB.goalsFor += scoreB;
            statsB.goalsAgainst += scoreA;
            statsB.goalDifference = statsB.goalsFor - statsB.goalsAgainst;

            if (scoreA > scoreB) {
              statsA.won++;
              statsA.points += 3;
              statsB.lost++;
            } else if (scoreA < scoreB) {
              statsB.won++;
              statsB.points += 3;
              statsA.lost++;
            } else {
              statsA.drawn++;
              statsA.points += 1;
              statsB.drawn++;
              statsB.points += 1;
            }
          }
        }
      });
    }

    const allStandings = Array.from(teamStatsMap.values());

    // If combination format, group teams into separate tables
    if (t.format === 'ket_hop') {
      const groupsMap = new Map<string, TeamStanding[]>();
      t.teams.forEach(team => {
        const groupName = `Bảng ${team.group || 'A'}`;
        const stats = teamStatsMap.get(team.name);
        if (stats) {
          if (!groupsMap.has(groupName)) {
            groupsMap.set(groupName, []);
          }
          groupsMap.get(groupName)!.push(stats);
        }
      });

      const result: GroupStanding[] = [];
      groupsMap.forEach((standings, groupName) => {
        standings.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name));
        result.push({ groupName, standings });
      });

      return result.sort((a, b) => a.groupName.localeCompare(b.groupName));
    } else {
      // Single league table format (vong_bang)
      allStandings.sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.name.localeCompare(b.name));
      return [{ groupName: 'Bảng xếp hạng', standings: allStandings }];
    }
  });

  // Organize bracket rounds from knockout matches
  bracketRounds = computed<BracketRound[]>(() => {
    const t = this.tournament();
    if (!t || !t.matches || t.format === 'vong_bang') {
      return [];
    }

    const knockoutMatches = t.matches.filter(m => m.stage === 'knockout');
    if (knockoutMatches.length === 0) {
      return [];
    }

    const roundsMap = new Map<string, TournamentMatch[]>();
    knockoutMatches.forEach(match => {
      let normalizedRound = match.round;
      if (match.round.startsWith('Tứ Kết')) normalizedRound = 'Tứ Kết';
      else if (match.round.startsWith('Bán Kết')) normalizedRound = 'Bán Kết';
      else if (match.round.startsWith('Vòng 1/8')) normalizedRound = 'Vòng 1/8';

      if (!roundsMap.has(normalizedRound)) {
        roundsMap.set(normalizedRound, []);
      }
      roundsMap.get(normalizedRound)!.push(match);
    });

    const definedOrder = ['Vòng 1/8', 'Tứ Kết', 'Bán Kết', 'Chung Kết'];
    const result: BracketRound[] = [];

    definedOrder.forEach(roundName => {
      if (roundsMap.has(roundName)) {
        result.push({
          roundName,
          matches: roundsMap.get(roundName)!
        });
      }
    });

    roundsMap.forEach((matches, roundName) => {
      if (!definedOrder.includes(roundName)) {
        result.push({ roundName, matches });
      }
    });

    return result;
  });

  getStatusLabel(status: TournamentStatus): string {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'ongoing': return 'Đang diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return '';
    }
  }

  getStatusSeverity(status: TournamentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case 'upcoming': return 'info';
      case 'ongoing': return 'success';
      case 'completed': return 'secondary';
      default: return 'info';
    }
  }

  // Popup detail states and triggers
  selectedTeam = signal<any | null>(null);
  teamPopupVisible = signal<boolean>(false);

  selectedPitch = signal<any | null>(null);
  pitchPopupVisible = signal<boolean>(false);

  openTeamDetail(teamName: string, teamRank?: string, teamLogo?: string, teamElo?: number) {
    let found = MOCK_TEAMS_CHALLENGE.find(t => t.name.toLowerCase() === teamName.toLowerCase());
    
    if (!found) {
      found = {
        id: 'team_generated_' + Math.random().toString(36).substr(2, 9),
        name: teamName,
        logo: teamLogo || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + teamName,
        captainName: 'Nguyễn Hồng Minh',
        captainPhone: '0912 345 678',
        district: 'Quận 7',
        city: 'TP.HCM',
        homePitch: 'Sân bóng Phú Mỹ Hưng',
        mainKitColor: 'Đỏ',
        subKitColor: 'Trắng',
        rank: (teamRank || 'C') as any,
        eloScore: teamElo || 1200,
        totalMatches: 24,
        wins: 14,
        draws: 4,
        losses: 6,
        winRate: 58,
        goalsFor: 48,
        goalsAgainst: 32,
        recentForm: ['W', 'W', 'L', 'W', 'D'],
        fairPlayRating: 4.8,
        membersCount: 15,
        description: 'Đội bóng văn phòng giao lưu vui vẻ, lối chơi cống hiến, fair-play.',
        members: [
          { id: 'mem1', name: 'Nguyễn Hồng Minh', avatar: 'https://i.pravatar.cc/150?img=33', role: 'captain', roleTitle: 'Đội trưởng', jerseyNumber: 10, position: 'MF', elo: teamElo || 1200 },
          { id: 'mem2', name: 'Trần Văn Tú', avatar: 'https://i.pravatar.cc/150?img=34', role: 'vice_captain', roleTitle: 'Đội phó', jerseyNumber: 7, position: 'FW', elo: (teamElo || 1200) - 20 },
        ]
      };
    }
    
    this.selectedTeam.set(found);
    this.teamPopupVisible.set(true);
  }

  openPitchDetail(pitchName: string) {
    let found = MOCK_PITCHES.find(p => p.name.toLowerCase().includes(pitchName.toLowerCase()) || pitchName.toLowerCase().includes(p.name.toLowerCase()));
    
    if (!found) {
      found = {
        id: 'pitch_generated_' + Math.random().toString(36).substr(2, 9),
        name: pitchName,
        address: pitchName + ', TP.HCM',
        district: 'Tân Bình',
        city: 'TP.HCM',
        phone: '0912 345 678',
        lat: 10.7968,
        lng: 106.6575,
        distanceKm: 2.5,
        rating: 4.8,
        reviewCount: 45,
        minPrice: 300000,
        maxPrice: 600000,
        images: [
          'https://images.unsplash.com/photo-1529900245563-202c4b8e7c10?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60'
        ],
        coverImage: 'https://images.unsplash.com/photo-1529900245563-202c4b8e7c10?w=800&auto=format&fit=crop&q=60',
        openHours: '06:00 - 23:00',
        description: 'Cụm sân cỏ nhân tạo tiêu chuẩn chất lượng cao, hệ thống chiếu sáng đèn LED hiện đại, bãi gửi xe thông thoáng.',
        facilities: ['parking_car', 'lighting', 'canteen', 'bib_rent'],
        availableSlotsCount: 4,
        isVerified: true,
        subPitches: [
          { id: 'sub_1', name: 'Sân 7A', type: '7v7', typeLabel: 'Sân 7', surface: 'Cỏ nhân tạo 5 sao', hasCover: false, basePrice: 500000 },
          { id: 'sub_2', name: 'Sân 5A', type: '5v5', typeLabel: 'Sân 5', surface: 'Cỏ nhân tạo tiêu chuẩn', hasCover: false, basePrice: 350000 }
        ]
      };
    }
    
    this.selectedPitch.set(found);
    this.pitchPopupVisible.set(true);
  }
}
