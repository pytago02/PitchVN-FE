import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Leaflet Real Map
import * as L from 'leaflet';

// PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, SharedModule } from 'primeng/api';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';

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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProvinceService } from '../../services/provinces/province-service';

@Component({
  selector: 'app-pitch-finder',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ToastModule, SharedModule, PitchDetailPopupComponent, HttpClientModule, Select, DatePickerModule, MultiSelectModule],
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
  showFilterDrawer = false;

  selectedRadius = 10; // km
  radiusOptions = [3, 5, 10, 15];

  selectedType: 'all' | '5v5' | '7v7' | '11v11' = 'all';
  selectedFacilities: string[] = [];
  sortBy: 'distance' | 'rating' | 'price' = 'distance';

  // Province/Location Filters
  apiVersion: 'v1' | 'v2' = 'v1';
  isLoadingProvinces = false;
  provinces: any[] = [];
  districts: any[] = [];
  wards: any[] = [];
  selectedProvince: any = null;
  selectedDistrict: any = null;
  selectedWards: any[] = [];

  // Date/Time Filters
  filterDate: Date | null = null;
  filterTimeFrom: Date | null = null;
  filterTimeTo: Date | null = null;
  today: Date = new Date();

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

  // ── Custom Time Booking ───────────────────────────────────
  bookingStartTime: string = '08:00'; // HH:mm
  bookingDurationHours: number = 1.5; // hours, min 1
  readonly durationOptions = [1, 1.5, 2, 2.5, 3, 4];
  readonly startTimeOptions: string[] = (() => {
    const times: string[] = [];
    for (let h = 6; h <= 22; h++) {
      times.push(`${String(h).padStart(2, '0')}:00`);
      if (h < 22) times.push(`${String(h).padStart(2, '0')}:30`);
    }
    return times;
  })();

  get bookingEndTime(): string {
    const [hStr, mStr] = this.bookingStartTime.split(':');
    const totalMins = parseInt(hStr) * 60 + parseInt(mStr) + Math.round(this.bookingDurationHours * 60);
    const endH = Math.floor(totalMins / 60);
    const endM = totalMins % 60;
    return `${String(Math.min(endH, 23)).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  get bookingTotalPrice(): number {
    if (!this.selectedSubPitch) return 0;
    const isGolden = this.isGoldenHourTime(this.bookingStartTime);
    const pricePerHour = isGolden
      ? Math.round(this.selectedSubPitch.basePrice * 1.3)
      : this.selectedSubPitch.basePrice;
    return Math.round(pricePerHour * this.bookingDurationHours);
  }

  isGoldenHourTime(time: string): boolean {
    const [h] = time.split(':').map(Number);
    return h >= 17 && h <= 20;
  }

  // ── Drag to Scroll State ──────────────────────────────────
  private isDragging = false;
  private startX = 0;
  private startScrollLeft = 0;

  constructor(private messageService: MessageService, private http: HttpClient, private ngZone: NgZone, private cdr: ChangeDetectorRef, private provinceService: ProvinceService) { }

  ngOnInit() {
    this.initDates();
    this.fetchProvinces();
    this.applyFilters();
    this.fetchUserLocation();
  }

  setViewMode(mode: 'list' | 'map') {
    this.viewMode = mode;
    if (mode === 'map' && this.map) {
      setTimeout(() => {
        this.map!.invalidateSize();
        if (this.activeMapMarkerPitch) {
          this.map!.panTo([this.activeMapMarkerPitch.lat, this.activeMapMarkerPitch.lng]);
        } else {
          this.recenterMap();
        }
      }, 50);
    }
  }

  fetchProvinces() {
    this.isLoadingProvinces = true;
    this.provinceService.showAllDivisions(this.apiVersion, 3).subscribe({
      next: (data) => {
        this.provinces = data;
        this.isLoadingProvinces = false;
      },
      error: (err) => {
        console.error('Lỗi khi fetch tỉnh thành:', err);
        this.isLoadingProvinces = false;
      }
    });
  }

  onProvinceChange() {
    this.selectedDistrict = null;
    this.selectedWards = [];
    this.districts = this.selectedProvince?.districts || [];
    this.wards = [];
    this.applyFilters();
  }

  onDistrictChange() {
    this.selectedWards = [];
    this.wards = this.selectedDistrict?.wards || [];
    this.applyFilters();
  }

  onWardsChange() {
    this.applyFilters();
  }

  getWardsLabel(): string {
    if (!this.selectedWards || this.selectedWards.length === 0) return 'Chọn Xã / Phường';
    if (this.selectedWards.length === 1) return this.selectedWards[0].name;
    return `Đã chọn ${this.selectedWards.length}`;
  }

  normalizeName(name: string): string {
    if (!name) return '';
    return name.toLowerCase()
      .replace(/^(tỉnh|thành phố|thành phố|quận|huyện|thị xã|xã|phường|thị trấn)\s+/i, '')
      .trim();
  }

  fetchUserLocation() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation.lat = position.coords.latitude;
          this.userLocation.lng = position.coords.longitude;
          this.userLocation.name = 'Vị trí hiện tại của bạn';

          // Tạm tính khoảng cách đường chim bay trước
          this.allPitches.forEach(pitch => {
            pitch.distanceKm = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, pitch.lat, pitch.lng);
          });

          this.applyFilters();

          if (this.map && this.userMarker) {
            this.userMarker.setLatLng([this.userLocation.lat, this.userLocation.lng]);
            this.recenterMap();
          }

          // Lấy khoảng cách đường đi thực tế
          this.fetchDrivingDistances();
        },
        (error) => {
          console.warn('Không thể lấy vị trí hiện tại:', error);
        }
      );
    }
  }

  fetchDrivingDistances() {
    this.allPitches.forEach((pitch) => {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${this.userLocation.lng},${this.userLocation.lat};${pitch.lng},${pitch.lat}?overview=false`;

      this.http.get<any>(osrmUrl).subscribe({
        next: (data) => {
          if (data && data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            // Convert to km and round to 1 decimal place
            pitch.distanceKm = Math.round((route.distance / 1000) * 10) / 10;
            this.applyFilters();
          }
        },
        error: (err) => {
          console.warn(`Lỗi lấy khoảng cách đường đi cho sân ${pitch.name}:`, err);
        }
      });
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10; // Distance in km rounded to 1 decimal place
  }

  deg2rad(deg: number) {
    return deg * (Math.PI / 180);
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
          this.ngZone.run(() => {
            this.selectMapMarker(pitch);
          });
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
    this.filteredPitches = this.allPitches.filter((p) => {
      // 1. Search text (name, address, district)
      const q = this.searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q);

      // 2. Radius (chỉ áp dụng khi KHÔNG chọn bộ lọc khu vực)
      const matchesRadius = this.selectedProvince ? true : p.distanceKm <= this.selectedRadius;

      // 3. Sub pitch type (5v5 / 7v7 / 11v11)
      const matchesType =
        this.selectedType === 'all' ||
        p.subPitches.some((sp) => sp.type === this.selectedType);

      // 4. Facilities filter
      if (this.selectedFacilities.length > 0) {
        const hasAllFacilities = this.selectedFacilities.every((fac) => p.facilities.includes(fac));
        if (!hasAllFacilities) return false;
      }

      // 5. Area Filter (Province / District)
      if (this.selectedProvince) {
        const provName = this.normalizeName(this.selectedProvince.name);
        if (!this.normalizeName(p.city).includes(provName) && !provName.includes(this.normalizeName(p.city))) {
          return false;
        }
      }

      if (this.selectedDistrict && !Array.isArray(this.selectedDistrict)) {
        const distName = this.normalizeName(this.selectedDistrict.name);
        if (!this.normalizeName(p.district).includes(distName) && !distName.includes(this.normalizeName(p.district))) {
          return false;
        }
      }

      // 6. Date / Time Filter
      if (this.filterDate || this.filterTimeFrom || this.filterTimeTo) {
        let hasMatchingSlot = false;
        // Simple logic for mock data: check if availableSlotsCount > 0 if no slots match exactly,
        // but let's assume all mock pitches are somewhat matching for demonstration unless strictly filtering.
        // Actually since we don't have full slot dates in mock pitches, we just pass them if they are available
        hasMatchingSlot = p.availableSlotsCount > 0;
        if (!hasMatchingSlot) return false;
      }

      return matchesQuery && matchesRadius && matchesType;
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
    // Xoá bộ lọc khu vực khi chọn bán kính
    this.selectedProvince = null;
    this.selectedDistrict = null;
    this.selectedWards = [];
    this.districts = [];
    this.wards = [];
    this.applyFilters();
  }

  onCustomRadiusChange(val: number) {
    if (val && val > 0) {
      this.selectedRadius = Number(val);
      // Xoá bộ lọc khu vực khi nhập bán kính
      this.selectedProvince = null;
      this.selectedDistrict = null;
      this.selectedWards = [];
      this.districts = [];
      this.wards = [];
      this.applyFilters();
    }
  }

  setType(type: 'all' | '5v5' | '7v7' | '11v11') {
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

  onStartTimeChange(time: string) {
    this.bookingStartTime = time;
  }

  onDurationChange(hours: number) {
    this.bookingDurationHours = hours;
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
    if (!this.selectedPitch || !this.selectedSubPitch) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Chưa chọn sân',
        detail: 'Vui lòng chọn sân con và khung giờ.',
      });
      return;
    }

    if (this.bookingDurationHours < 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Thời gian tối thiểu',
        detail: 'Vui lòng đặt tối thiểu 1 giờ.',
      });
      return;
    }

    // Build synthetic slot from custom time
    this.selectedSlot = {
      id: 'custom_' + Date.now(),
      pitchId: this.selectedPitch.id,
      subPitchId: this.selectedSubPitch.id,
      subPitchName: this.selectedSubPitch.name,
      date: this.selectedDateStr,
      startTime: this.bookingStartTime,
      endTime: this.bookingEndTime,
      price: this.bookingTotalPrice,
      status: 'available',
      isGoldenHour: this.isGoldenHourTime(this.bookingStartTime),
    };

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
    // Force active state first
    this.activeMapMarkerPitch = null;
    this.cdr.detectChanges();
    this.activeMapMarkerPitch = pitch;
    this.cdr.detectChanges();

    if (this.map) {
      this.map.invalidateSize();
      const isMobile = window.innerWidth <= 767;
      // On mobile, popup is at the bottom, so we offset the pan slightly up
      // to keep the marker in the visible center
      const latOffset = isMobile ? -0.005 : 0; 
      this.map.panTo([pitch.lat + latOffset, pitch.lng], { animate: true });
    }

    // Cập nhật class 'active' thủ công để không hủy đi toàn bộ marker đang được click
    document.querySelectorAll('.map-pitch-marker-real').forEach(el => el.classList.remove('active'));
    const activeMarkerEl = document.getElementById('marker-' + pitch.id);
    if (activeMarkerEl) {
      activeMarkerEl.classList.add('active');
    }

    // Explicitly trigger change detection since Leaflet events might be outside zone
    // or missed by Angular in some cases.
    this.cdr.detectChanges();

    // Scroll list card into view
    setTimeout(() => {
      const cardEl = document.getElementById('pitch-card-' + pitch.id);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
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
