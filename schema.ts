/** * Generated TypeScript types for Directus Schema * Generated on: 2025-09-17T11:02:13.265Z */
export interface City {
  id: number;
  name: string;
  gps: string;
  district: string;
  region: string;
  zip: number;
}

export interface Dj {
  id: string;
  status: string;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  user_updated: string | DirectusUser;
  date_updated: 'datetime';
  name: string;
  email: string;
  bio: string;
  slug: string;
  follow_count: number;
  user: string | DirectusUser;
  photo: string | DirectusFile;
  genres: number[] | DjGenre[];
  sounds: string[] | Sound[];
  follows: number[] | UserDjFollow[];
  city: number | City;
}

export interface DjGenre {
  id: number;
  dj_id: string | Dj;
  genre_id: number | Genre;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Sound {
  id: string;
  status: string;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  user_updated: string | DirectusUser;
  date_updated: 'datetime';
  name: string;
  description: string;
  type: string;
  duration: number;
  dj: string | Dj;
  genres: number[] | SoundGenre[];
  likes: number[] | UserSoundLike[];
  photo: string | DirectusFile;
  like_count: number;
  url: string;
}

export interface SoundGenre {
  id: number;
  sound_id: string | Sound;
  genre_id: number | Genre;
}

export interface UserDjFollow {
  id: number;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  dj: string | Dj;
}

export interface UserSoundLike {
  id: number;
  user_created: string | DirectusUser;
  date_created: 'datetime';
  sound: string | Sound;
}

export interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string;
  modified_on: string;
  charset: string;
  filesize: number;
  width: number;
  height: number;
  duration: number;
  embed: string;
  description: string;
  location: string;
  tags: string;
  metadata: string;
  created_on: string;
  focal_point_x: string;
  focal_point_y: string;
  tus_id: string;
  tus_data: string;
}

export interface DirectusUser {
  id: string;
  djs: string[] | Dj[];
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string;
  title: string;
  description: string;
  tags: string;
  avatar: string;
  language: string;
  tfa_secret: boolean;
  status: string;
  role: string;
  token: string;
  last_access: string;
  last_page: string;
  provider: string;
  external_identifier: string;
  auth_data: string;
  email_notifications: boolean;
  appearance: string;
  theme_dark: string;
  theme_light: string;
  theme_light_overrides: string;
  theme_dark_overrides: string;
  policies: string;
}

export interface DirectusFolder {
  id: string;
  name: string;
  parent: string;
}

export interface DirectusRole {
  id: string;
  name: string;
  icon: string;
  description: string;
  admin_access: boolean;
  app_access: boolean;
  children: string;
  users: string;
  parent: string;
  policies: string;
}

export interface ApiCollections {
  city: City[];
  dj: Dj[];
  dj_genre: DjGenre[];
  genre: Genre[];
  sound: Sound[];
  sound_genre: SoundGenre[];
  user_dj_follow: UserDjFollow[];
  user_sound_like: UserSoundLike[];
  directus_files: DirectusFile[];
  directus_users: DirectusUser[];
}

