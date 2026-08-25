export interface PlayerProfile {
  id?: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  preferredPosition?: string[] | string;
  preferredFoot?: string;
  [key: string]: any; // To be fully defined based on requirements
}
