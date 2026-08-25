const fs = require('fs');
const path = require('path');

const entities = [
    { name: 'User', endpoint: 'Users' },
    { name: 'PlayerProfile', endpoint: 'PlayerProfiles' },
    { name: 'Pitch', endpoint: 'Pitches' },
    { name: 'SubPitch', endpoint: 'SubPitches' },
    { name: 'TimeSlot', endpoint: 'TimeSlots' },
    { name: 'PitchBooking', endpoint: 'PitchBookings' },
    { name: 'Team', endpoint: 'Teams' },
    { name: 'TeamMember', endpoint: 'TeamMembers' },
    { name: 'Challenge', endpoint: 'Challenges' },
    { name: 'Post', endpoint: 'Posts' },
    { name: 'PostInteraction', endpoint: 'PostInteractions' },
    { name: 'ChatMessage', endpoint: 'ChatMessages' },
    { name: 'Tournament', endpoint: 'Tournaments' },
    { name: 'TournamentTeam', endpoint: 'TournamentTeams' },
    { name: 'TournamentMatch', endpoint: 'TournamentMatches' }
];

const servicesDir = path.join(__dirname, 'src', 'app', 'services');
const modelsDir = path.join(__dirname, 'src', 'app', 'models');

if (!fs.existsSync(servicesDir)) fs.mkdirSync(servicesDir, { recursive: true });
if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

entities.forEach(entity => {
    // 1. Create Model interface
    const modelCode = `export interface ${entity.name} {
  id?: string;
  [key: string]: any; // To be fully defined based on requirements
}
`;
    const modelFileName = `${entity.name.toLowerCase()}.model.ts`;
    fs.writeFileSync(path.join(modelsDir, modelFileName), modelCode);

    // 2. Create Service
    const serviceName = `${entity.name}Service`;
    const className = entity.name.toLowerCase();
    
    // Group them into subfolders (optional, but requested "cấu trúc thư mục rõ ràng")
    // Let's just put them in services/name/name.service.ts
    const entityServiceDir = path.join(servicesDir, className);
    if (!fs.existsSync(entityServiceDir)) fs.mkdirSync(entityServiceDir, { recursive: true });

    const serviceCode = `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ${entity.name} } from '../../models/${modelFileName.replace('.ts', '')}';

@Injectable({
  providedIn: 'root'
})
export class ${serviceName} {
  private baseUrl = \`\${environment.apiUrl}/${entity.endpoint}\`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<${entity.name}[]> {
    return this.http.get<${entity.name}[]>(this.baseUrl);
  }

  getById(id: string): Observable<${entity.name}> {
    return this.http.get<${entity.name}>(\`\${this.baseUrl}/\${id}\`);
  }

  create(data: Partial<${entity.name}>): Observable<${entity.name}> {
    return this.http.post<${entity.name}>(this.baseUrl, data);
  }

  update(id: string, data: Partial<${entity.name}>): Observable<void> {
    return this.http.put<void>(\`\${this.baseUrl}/\${id}\`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.baseUrl}/\${id}\`);
  }
}
`;
    const serviceFileName = `${className}.service.ts`;
    fs.writeFileSync(path.join(entityServiceDir, serviceFileName), serviceCode);
});

console.log('Angular services and models successfully generated!');
