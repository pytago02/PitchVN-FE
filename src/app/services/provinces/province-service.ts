import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Ward {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    district_code: number;
}

export interface District {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    province_code: number;
    wards?: Ward[];
}

export interface Province {
    name: string;
    code: number;
    division_type: string;
    codename: string;
    phone_code: number;
    districts?: District[];
}

export interface SearchResult {
    name: string;
    code: number;
}

export interface VersionResponse {
    data_version: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProvinceService {
    private readonly baseApiUrl = '/api/provinces';

    constructor(private http: HttpClient) { }

    /**
     * Lấy danh sách toàn bộ các đơn vị hành chính.
     * @param version Phiên bản API (v1 hoặc v2).
     * @param depth 1: Chỉ lấy tỉnh/thành, 2: Lấy thêm quận/huyện, 3: Lấy thêm phường/xã.
     * @returns Danh sách các tỉnh/thành phố cùng với các đơn vị trực thuộc (nếu depth > 1).
     */
    showAllDivisions(version: 'v1' | 'v2' = 'v1', depth: number = 3): Observable<Province[]> {
        const params = new HttpParams().set('depth', depth.toString());
        return this.http.get<Province[]>(`${this.baseApiUrl}/${version}/`, { params });
    }

    /**
     * Lấy danh sách tất cả các tỉnh/thành phố trực thuộc trung ương.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Danh sách các tỉnh/thành phố.
     */
    getProvinces(version: 'v1' | 'v2' = 'v1'): Observable<Province[]> {
        return this.http.get<Province[]>(`${this.baseApiUrl}/${version}/p/`);
    }

    /**
     * Tìm kiếm tỉnh/thành phố theo tên.
     * @param q Từ khóa tìm kiếm (nhập tên đầy đủ hoặc một phần).
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Kết quả tìm kiếm tỉnh/thành phố.
     */
    searchProvinces(q: string, version: 'v1' | 'v2' = 'v1'): Observable<SearchResult[]> {
        const params = new HttpParams().set('q', q);
        return this.http.get<SearchResult[]>(`${this.baseApiUrl}/${version}/p/search/`, { params });
    }

    /**
     * Lấy thông tin chi tiết của một tỉnh/thành phố dựa vào mã code.
     * @param provinceCode Mã của tỉnh/thành phố.
     * @param version Phiên bản API (v1 hoặc v2).
     * @param depth 1: Chỉ lấy tỉnh/thành, 2: Lấy thêm quận/huyện, 3: Lấy thêm phường/xã.
     * @returns Thông tin chi tiết của tỉnh/thành phố.
     */
    getProvincesByCode(provinceCode: string | number, version: 'v1' | 'v2' = 'v1', depth: number = 1): Observable<Province> {
        const params = new HttpParams().set('depth', depth.toString());
        return this.http.get<Province>(`${this.baseApiUrl}/${version}/p/${provinceCode}`, { params });
    }

    /**
     * Lấy danh sách các quận/huyện thuộc về một tỉnh/thành phố cụ thể.
     * @param provinceCode Mã của tỉnh/thành phố.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Danh sách các quận/huyện trực thuộc.
     */
    getDistrictsOnProvince(provinceCode: string | number, version: 'v1' | 'v2' = 'v1'): Observable<District[]> {
        return this.getProvincesByCode(provinceCode, version, 2).pipe(
            map(province => province.districts || [])
        );
    }

    /**
     * Lấy danh sách tất cả các quận/huyện trên cả nước.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Danh sách các quận/huyện.
     */
    getDistricts(version: 'v1' | 'v2' = 'v1'): Observable<District[]> {
        return this.http.get<District[]>(`${this.baseApiUrl}/${version}/d/`);
    }

    /**
     * Tìm kiếm quận/huyện theo tên, có thể lọc theo tỉnh/thành phố.
     * @param q Từ khóa tìm kiếm.
     * @param provinceCode Mã tỉnh/thành phố để lọc (tùy chọn).
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Kết quả tìm kiếm quận/huyện.
     */
    searchDistricts(q: string, provinceCode?: number, version: 'v1' | 'v2' = 'v1'): Observable<SearchResult[]> {
        let params = new HttpParams().set('q', q);
        if (provinceCode !== undefined) {
            params = params.set('p', provinceCode.toString());
        }
        return this.http.get<SearchResult[]>(`${this.baseApiUrl}/${version}/d/search/`, { params });
    }

    /**
     * Lấy thông tin chi tiết của một quận/huyện dựa vào mã code.
     * @param districtCode Mã của quận/huyện.
     * @param version Phiên bản API (v1 hoặc v2).
     * @param depth 1: Chỉ lấy quận/huyện, 2: Lấy thêm phường/xã trực thuộc.
     * @returns Thông tin chi tiết của quận/huyện.
     */
    getDistrictsByCode(districtCode: string | number, version: 'v1' | 'v2' = 'v1', depth: number = 1): Observable<District> {
        const params = new HttpParams().set('depth', depth.toString());
        return this.http.get<District>(`${this.baseApiUrl}/${version}/d/${districtCode}`, { params });
    }

    /**
     * Lấy danh sách các phường/xã thuộc về một quận/huyện cụ thể.
     * @param districtCode Mã của quận/huyện.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Danh sách các phường/xã trực thuộc.
     */
    getWardsOnDistrict(districtCode: string | number, version: 'v1' | 'v2' = 'v1'): Observable<Ward[]> {
        return this.getDistrictsByCode(districtCode, version, 2).pipe(
            map(district => district.wards || [])
        );
    }

    /**
     * Lấy danh sách tất cả các phường/xã trên cả nước.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Danh sách các phường/xã.
     */
    getAllWards(version: 'v1' | 'v2' = 'v1'): Observable<Ward[]> {
        return this.http.get<Ward[]>(`${this.baseApiUrl}/${version}/w/`);
    }

    /**
     * Tìm kiếm phường/xã theo tên, có thể lọc theo quận/huyện hoặc tỉnh/thành phố.
     * @param q Từ khóa tìm kiếm.
     * @param districtCode Mã quận/huyện để lọc (tùy chọn).
     * @param provinceCode Mã tỉnh/thành phố để lọc (tùy chọn).
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Kết quả tìm kiếm phường/xã.
     */
    searchWards(q: string, districtCode?: number, provinceCode?: number, version: 'v1' | 'v2' = 'v1'): Observable<SearchResult[]> {
        let params = new HttpParams().set('q', q);
        if (districtCode !== undefined) {
            params = params.set('d', districtCode.toString());
        }
        if (provinceCode !== undefined) {
            params = params.set('p', provinceCode.toString());
        }
        return this.http.get<SearchResult[]>(`${this.baseApiUrl}/${version}/w/search/`, { params });
    }

    /**
     * Lấy thông tin chi tiết của một phường/xã dựa vào mã code.
     * @param wardCode Mã của phường/xã.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Thông tin chi tiết của phường/xã.
     */
    getWards(wardCode: string | number, version: 'v1' | 'v2' = 'v1'): Observable<Ward> {
        return this.http.get<Ward>(`${this.baseApiUrl}/${version}/w/${wardCode}`);
    }

    /**
     * Lấy thông tin phiên bản của dữ liệu API.
     * @param version Phiên bản API (v1 hoặc v2).
     * @returns Thông tin phiên bản dữ liệu.
     */
    getVersion(version: 'v1' | 'v2' = 'v1'): Observable<VersionResponse> {
        return this.http.get<VersionResponse>(`${this.baseApiUrl}/${version}/version`);
    }
}
