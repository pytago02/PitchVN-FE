import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import * as L from 'leaflet';
import { Pitch, SubPitch, PitchFacility, ALL_FACILITIES, PitchReview, MOCK_PITCH_REVIEWS } from '../../../features/pitch-finder/mock-pitch-data';
import { MasterData, MasterDataService } from '../../../services/master-data/master-data.service';

@Component({
  selector: 'app-pitch-detail-popup',
  standalone: true,
  imports: [CommonModule, DialogModule],
  templateUrl: './pitch-detail-popup.component.html',
  styleUrls: ['./pitch-detail-popup.component.css']
})
export class PitchDetailPopupComponent implements OnChanges, AfterViewInit {
  @Input() visible: boolean = false;
  @Input() pitch: Pitch | null = null;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onBookSchedule = new EventEmitter<{ pitch: Pitch, subPitch?: SubPitch }>();

  private map: L.Map | undefined;
  // User Location (Mocked Cầu Giấy, HN)
  userLocation = {
    lat: 21.0333,
    lng: 105.7865,
  };
  
  allFacilities: PitchFacility[] = ALL_FACILITIES;
  currentReviews: PitchReview[] = [];
  routeDistanceStr: string | null = null;
  routeDurationStr: string | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private masterDataService: MasterDataService,
  ) {}

  ngOnInit() {
    this.masterDataService.getFacilities().subscribe({
      next: (facilities: MasterData[]) => {
        if (facilities.length > 0) {
          this.allFacilities = facilities.map(facility => ({
            id: facility.id,
            name: facility.name,
            icon: ALL_FACILITIES.find(item => item.id === facility.code)?.icon ?? 'pi pi-check-circle',
          }));
        }
      },
    });
  }

  getFacilityInfo(facilityId: string): PitchFacility | undefined {
    return this.allFacilities.find(f => f.id === facilityId);
  }

  getFacilityName(id: string): string {
    const f = this.getFacilityInfo(id);
    return f ? f.name : id;
  }

  getFacilityIcon(id: string): string {
    const f = this.getFacilityInfo(id);
    return f ? f.icon : 'pi pi-check';
  }

  formatPrice(val: number): string {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pitch'] && this.pitch) {
      this.currentReviews = MOCK_PITCH_REVIEWS[this.pitch.id] || MOCK_PITCH_REVIEWS['pitch_1'];
    }

    if (changes['visible'] && this.visible) {
      setTimeout(() => {
        this.initOrUpdateMap();
      }, 100);
    }
  }

  ngAfterViewInit() {
    if (this.visible) {
      this.initOrUpdateMap();
    }
  }

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  openSchedule(subPitch?: SubPitch) {
    if (!this.pitch) return;
    this.closeModal();
    this.onBookSchedule.emit({ pitch: this.pitch, subPitch: subPitch });
  }

  openGoogleMapsDirections() {
    if (!this.pitch) return;
    const dest = `${this.pitch.lat},${this.pitch.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, '_blank');
  }

  private initOrUpdateMap() {
    const mapElement = document.getElementById('pitch-popup-map');
    if (!mapElement || !this.pitch) return;

    const lat = this.pitch.lat;
    const lng = this.pitch.lng;

    if (!this.map) {
      this.map = L.map('pitch-popup-map', {
        zoomControl: false,
        attributionControl: false
      }).setView([lat, lng], 15);

      const isDark = document.body.classList.contains('dark');
      const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
      }).addTo(this.map);
    } else {
      this.map.setView([lat, lng], 15);
      this.map.invalidateSize();
    }

    // Add pin marker
    const markerHtml = `
      <svg viewBox="0 0 24 24" width="36" height="36" style="filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.5)); transform: translateY(-4px);">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
              fill="var(--brand-primary)" stroke="#fff" stroke-width="2"/>
        <circle cx="12" cy="9" r="3" fill="#000" />
      </svg>
    `;
    const icon = L.divIcon({
      className: 'custom-pitch-pin',
      html: markerHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });

    L.marker([lat, lng], { icon }).addTo(this.map);

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.addUserMarkerAndFitBounds(lat, lng);
        },
        (error) => {
          this.addUserMarkerAndFitBounds(lat, lng);
        },
        { timeout: 5000 }
      );
    } else {
      this.addUserMarkerAndFitBounds(lat, lng);
    }
  }

  private addUserMarkerAndFitBounds(pitchLat: number, pitchLng: number) {
    if (!this.map) return;
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `<div class="pulse-ring"></div><div class="pulse-dot"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(this.map);
    
    // Fetch real route from OSRM
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${this.userLocation.lng},${this.userLocation.lat};${pitchLng},${pitchLat}?overview=full&geometries=geojson`;
    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const geometry = route.geometry;
          const latLngs = geometry.coordinates.map((coord: any[]) => [coord[1], coord[0]]);
          
          L.polyline(latLngs, {
            color: 'var(--brand-primary)',
            weight: 4,
            opacity: 0.8
          }).addTo(this.map!);

          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.round(route.duration / 60);
          this.routeDistanceStr = `${distKm} km`;
          this.routeDurationStr = `${durMin} phút`;
          this.cdr.detectChanges();
        } else {
          // Fallback to straight line
          L.polyline(
            [[this.userLocation.lat, this.userLocation.lng], [pitchLat, pitchLng]], 
            { color: 'var(--brand-primary)', weight: 3, dashArray: '8, 8', opacity: 0.8 }
          ).addTo(this.map!);
        }
      })
      .catch(err => {
        console.error('OSRM route error:', err);
        // Fallback to straight line
        L.polyline(
          [[this.userLocation.lat, this.userLocation.lng], [pitchLat, pitchLng]], 
          { color: 'var(--brand-primary)', weight: 3, dashArray: '8, 8', opacity: 0.8 }
        ).addTo(this.map!);
      });

    const bounds = L.latLngBounds(
      [this.userLocation.lat, this.userLocation.lng],
      [pitchLat, pitchLng]
    );
    this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }
}
