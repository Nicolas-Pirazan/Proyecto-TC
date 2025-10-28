
export interface IRegion {
  id: number;
  region: string;
}

export interface ICommune {
  id: number;
  commune: string;
}

export interface IGenre {
  id: number;
  genre: string;
}

export interface IMedia {
  id: number;
  media: string;
}

export type IKeysGenericOptions = 'region' | 'commune' | 'genre' | 'media';

export type IGenericOptions = {
  id: string;
  [key: string]: string;
};

export type IGenreOptions = {
  id: string;
  [key: number]: number;
};

export interface ILocation {
  consecutive: number;
  location_name: string;
  address: string;
}

export interface IRol {
  consecutive: number;
  name: string;
}

export interface IParamsProps {
  locations: ILocation[];
  genres: IGenericOptions[];
  media: IGenericOptions[];
}

export interface IRegisterCourseForm {
  name: string;
  description: string;
  value: number;
  number_of_classes: number;
  state: boolean;
  user_creation: string;
}

export interface IRegisterCourseFormProps {
  isSuccess: boolean;
}

export interface ICourse {
  consecutive: number;
  name: string;
  number_of_classes: number;
  description: string;
  value: number;
  state: boolean;
  user_creation: string;
}

