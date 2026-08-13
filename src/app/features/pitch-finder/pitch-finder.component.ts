import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Leaflet Real Map
import * as L from 'leaflet';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';

import {
  MOCK_PITCHES,
  ALL_FACILITIES,
  Pitch,
  SubPitch,
  TimeSlot,
  PitchFacility,
  PitchBooking,
  generateMockSlots,
  MOCK_PITCH_REVIEWS,
  PitchReview,
} from './mock-pitch-data';
import { PitchDetailPopupComponent } from '../../shared/components/pitch-detail-popup/pitch-detail-popup.component';

@Component({
  selector: 'app-pitch-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ToastModule, SharedModule, PitchDetailPopupComponent],
  providers: [MessageService],
  templateUrl: './pitch-finder.component.html',
  styleUrls: ['./pitch-finder.component.css'],
})
export class PitchFinderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('subpitchScroll') subpitchScrollRef?: ElementRef<HTMLElement>;
  @ViewChild('dateScroll') dateScrollRef?: ElementRef<HTMLElement>;

  // ── Data Sources ──────────────────────────────────────────
  allPitches: Pitch[] = MOCK_PITCHES;
  filteredPitches: Pitch[] = [];
  facilitiesList: PitchFacility[] = ALL_FACILITIES;

  // ── Filters State ─────────────────────────────────────────
  searchQuery = '';
  selectedRadius = 10; // km
  radiusOptions = [1, 3, 5, 10, 20];
  selectedType = 'all'; // 'all' | '5v5' | '7v7' | '11v11'
  selectedFacilities: string[] = [];
  sortBy = 'distance'; // 'distance' | 'rating' | 'price'
  showFilterDrawer = false;

  // ── View Mode ─────────────────────────────────────────────
  viewMode: 'list' | 'map' = 'list';

  // ── User Location ─────────────────────────────────────────
  userLocation = {
    name: 'Vị trí của bạn (Cầu Giấy, Hà Nội)',
    lat: 21.0333,
    lng: 105.7865,
  };

  // ── Leaflet Real Map Instance ─────────────────────────────
  private map?: L.Map;
  private radiusCircle?: L.Circle;
  private userMarker?: L.Marker;
  private pitchMarkers: L.Marker[] = [];

  // ── Active Selection ──────────────────────────────────────
  selectedPitch: Pitch | null = null;
  selectedSubPitch: SubPitch | null = null;
  activeMapMarkerPitch: Pitch | null = null;

  // ── Date & Slot Picker ────────────────────────────────────
  datesList: { label: string; dateStr: string; dayName: string; isToday: boolean }[] = [];
  selectedDateStr = '';
  timeSlots: TimeSlot[] = [];
  selectedSlot: TimeSlot | null = null;

  // ── Modals State ──────────────────────────────────────────
  showDetailModal = false;
  showScheduleModal = false;
  showBookingModal = false;
  showSuccessModal = false;

  // ── Booking Form State ────────────────────────────────────
  bookingName = 'Nguyễn Văn A';
  bookingPhone = '0988 888 888';
  bookingNote = '';
  paymentMethod: 'vietqr' | 'momo' | 'vnpay' | 'cash' = 'vietqr';
  isSubmittingBooking = false;
  completedBooking: PitchBooking | null = null;

  // ── Drag to Scroll State ──────────────────────────────────
  private isDragging = false;
  private startX = 0;
  private startScrollLeft = 0;

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.initDates();
    this.applyFilters();
  }

  ngAfterViewInit() {
    this.initLeafletMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  // ── Leaflet Real Map Initialization ───────────────────────
  private initLeafletMap() {
    const mapContainer = document.getElementById('pitch-leaflet-map');
    if (!mapContainer) return;

    // Create Map instance centered at user location with scroll zoom enabled
    this.map = L.map('pitch-leaflet-map', {
      center: [this.userLocation.lat, this.userLocation.lng],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    // Add User Location Marker (Pulse beacon)
    const userIcon = L.divIcon({
      className: 'user-leaflet-div-icon',
      html: `
        <div class="user-location-beacon-real">
          <div class="beacon-pulse"></div>
          <div class="beacon-dot"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    this.userMarker = L.marker([this.userLocation.lat, this.userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    })
      .addTo(this.map)
      .bindTooltip('Vị trí của bạn', { permanent: false, direction: 'top' });

    // Render Radius & Pitch Markers
    this.updateMapLayers();

    // Trigger invalidateSize to ensure full tile rendering
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 250);
  }

  updateMapLayers() {
    if (!this.map) return;

    // 1. Update Radius Circle
    if (this.radiusCircle) {
      this.map.removeLayer(this.radiusCircle);
    }

    this.radiusCircle = L.circle([this.userLocation.lat, this.userLocation.lng], {
      radius: this.selectedRadius * 1000, // convert km to meters
      color: '#85EA2D',
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#85EA2D',
      fillOpacity: 0.1,
    }).addTo(this.map);

    // 2. Clear old pitch markers
    this.pitchMarkers.forEach((m) => this.map?.removeLayer(m));
    this.pitchMarkers = [];

    // 3. Add Pitch Markers
    this.filteredPitches.forEach((pitch) => {
      const isSelected = this.activeMapMarkerPitch?.id === pitch.id;
      const formattedMinPrice = Math.round(pitch.minPrice / 1000) + 'k';

      const markerHtml = `
        <div class="map-pitch-marker-real ${isSelected ? 'active' : ''}" id="marker-${pitch.id}">
          <div class="marker-pill">
            <span class="marker-status-dot"></span>
            <span class="marker-price">${formattedMinPrice}</span>
          </div>
          <div class="marker-pin-tail"></div>
        </div>
      `;

      const pitchIcon = L.divIcon({
        className: 'pitch-leaflet-div-icon',
        html: markerHtml,
        iconSize: [60, 36],
        iconAnchor: [30, 36],
      });

      const marker = L.marker([pitch.lat, pitch.lng], { icon: pitchIcon })
        .addTo(this.map!)
        .on('click', () => {
          this.selectMapMarker(pitch);
        });

      this.pitchMarkers.push(marker);
    });
  }

  recenterMap() {
    if (!this.map) return;
    this.map.setView([this.userLocation.lat, this.userLocation.lng], 13);
  }

  // ── Dates Initialization ──────────────────────────────────
  private initDates() {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const list = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      list.push({
        label: i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : `${dd}/${mm}`,
        dayName: days[d.getDay()],
        dateStr,
        isToday: i === 0,
      });
    }

    this.datesList = list;
    this.selectedDateStr = list[0].dateStr;
  }

  // ── Filters & Search ──────────────────────────────────────
  applyFilters() {
    this.filteredPitches = this.allPitches.filter((pitch) => {
      // 1. Search text (name, address, district)
      const q = this.searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        pitch.name.toLowerCase().includes(q) ||
        pitch.address.toLowerCase().includes(q) ||
        pitch.district.toLowerCase().includes(q);

      // 2. Radius
      const matchesRadius = pitch.distanceKm <= this.selectedRadius;

      // 3. Sub pitch type (5v5 / 7v7 / 11v11)
      const matchesType =
        this.selectedType === 'all' ||
        pitch.subPitches.some((sp) => sp.type === this.selectedType);

      // 4. Facilities
      const matchesFacilities =
        this.selectedFacilities.length === 0 ||
        this.selectedFacilities.every((facId) => pitch.facilities.includes(facId));

      return matchesQuery && matchesRadius && matchesType && matchesFacilities;
    });

    // Sort
    if (this.sortBy === 'distance') {
      this.filteredPitches.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (this.sortBy === 'rating') {
      this.filteredPitches.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'price') {
      this.filteredPitches.sort((a, b) => a.minPrice - b.minPrice);
    }

    // Set first pitch as default map pin if none active
    if (!this.activeMapMarkerPitch && this.filteredPitches.length > 0) {
      this.activeMapMarkerPitch = this.filteredPitches[0];
    }

    // Update real map
    this.updateMapLayers();
  }

  setRadius(radius: number) {
    this.selectedRadius = radius;
    this.applyFilters();
  }

  onCustomRadiusChange(val: number) {
    if (val && val > 0) {
      this.selectedRadius = Number(val);
      this.applyFilters();
    }
  }

  setType(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  toggleFacility(facilityId: string) {
    const idx = this.selectedFacilities.indexOf(facilityId);
    if (idx >= 0) {
      this.selectedFacilities.splice(idx, 1);
    } else {
      this.selectedFacilities.push(facilityId);
    }
    this.applyFilters();
  }

  isFacilitySelected(facilityId: string): boolean {
    return this.selectedFacilities.includes(facilityId);
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedRadius = 10;
    this.selectedType = 'all';
    this.selectedFacilities = [];
    this.sortBy = 'distance';
    this.applyFilters();
  }

  // ── Pitch Detail & Schedule Modal ─────────────────────────
  openPitchDetail(pitch: Pitch) {
    this.selectedPitch = pitch;
    this.selectedSubPitch = pitch.subPitches[0] || null;
    this.showDetailModal = true;
  }

  closePitchDetail() {
    this.showDetailModal = false;
  }

  openSchedule(pitch: Pitch, subPitch?: SubPitch) {
    this.selectedPitch = pitch;
    this.selectedSubPitch = subPitch || pitch.subPitches[0];
    this.loadSlots();
    this.selectedSlot = null;
    this.showScheduleModal = true;
  }

  closeSchedule() {
    this.showScheduleModal = false;
  }

  selectSubPitch(sub: SubPitch) {
    this.selectedSubPitch = sub;
    this.loadSlots();
    this.selectedSlot = null;
  }

  selectDate(dateStr: string) {
    this.selectedDateStr = dateStr;
    this.loadSlots();
    this.selectedSlot = null;
  }

  loadSlots() {
    if (!this.selectedPitch || !this.selectedSubPitch) return;
    this.timeSlots = generateMockSlots(
      this.selectedPitch.id,
      this.selectedSubPitch.id,
      this.selectedSubPitch.name,
      this.selectedDateStr
    );
  }

  selectSlot(slot: TimeSlot) {
    if (slot.status !== 'available') return;
    this.selectedSlot = slot;
  }

  // ── Drag to Scroll Handlers (Nắm để cuộn) ──────────────────
  startDrag(e: MouseEvent, target: HTMLElement) {
    this.isDragging = true;
    this.startX = e.pageX - target.offsetLeft;
    this.startScrollLeft = target.scrollLeft;
  }

  onDrag(e: MouseEvent, target: HTMLElement) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - target.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Scroll speed multiplier
    target.scrollLeft = this.startScrollLeft - walk;
  }

  stopDrag() {
    this.isDragging = false;
  }

  // ── Booking Flow ──────────────────────────────────────────
  proceedToBooking() {
    if (!this.selectedSlot || !this.selectedPitch || !this.selectedSubPitch) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chưa chọn khung giờ',
        detail: 'Vui lòng chọn 1 khung giờ còn trống để đặt sân.',
      });
      return;
    }

    this.showScheduleModal = false;
    this.showDetailModal = false;
    this.showBookingModal = true;
  }

  closeBookingModal() {
    this.showBookingModal = false;
  }

  confirmBooking() {
    if (!this.bookingName.trim() || !this.bookingPhone.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Thiếu thông tin',
        detail: 'Vui lòng nhập họ tên và số điện thoại liên hệ.',
      });
      return;
    }

    this.isSubmittingBooking = true;

    setTimeout(() => {
      const code = 'PVN-' + Math.floor(100000 + Math.random() * 900000);

      this.completedBooking = {
        bookingCode: code,
        pitch: this.selectedPitch!,
        subPitch: this.selectedSubPitch!,
        date: this.selectedDateStr,
        slot: this.selectedSlot!,
        totalPrice: this.selectedSlot!.price,
        userName: this.bookingName,
        userPhone: this.bookingPhone,
        userNote: this.bookingNote,
        paymentMethod: this.paymentMethod,
        paymentStatus: this.paymentMethod === 'cash' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
      };

      // Mark slot as booked in realtime view
      if (this.selectedSlot) {
        this.selectedSlot.status = 'booked';
      }

      this.isSubmittingBooking = false;
      this.showBookingModal = false;
      this.showSuccessModal = true;

      this.messageService.add({
        severity: 'success',
        summary: 'Đặt sân thành công!',
        detail: `Mã đặt sân: ${code}. Chủ sân sẽ liên hệ sớm!`,
        life: 4000,
      });
    }, 800);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // ── Map Interactions & Google Maps Directions ───────────
  openGoogleMapsDirections(pitch: Pitch, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const origin = `${this.userLocation.lat},${this.userLocation.lng}`;
    const destination = `${pitch.lat},${pitch.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  }

  selectMapMarker(pitch: Pitch) {
    this.activeMapMarkerPitch = pitch;
    if (this.map) {
      this.map.panTo([pitch.lat, pitch.lng], { animate: true });
    }
    this.updateMapLayers();
  }

  formatPrice(val: number): string {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  }

  getFacilityName(id: string): string {
    const f = this.facilitiesList.find((item) => item.id === id);
    return f ? f.name : id;
  }

  getFacilityIcon(id: string): string {
    const f = this.facilitiesList.find((item) => item.id === id);
    return f ? f.icon : 'pi pi-check';
  }
}
