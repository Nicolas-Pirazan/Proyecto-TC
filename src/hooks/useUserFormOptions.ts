import { useCreateCourse, useGetComunasByIdRegion, useGetParams, useGetRegions, useGetRoles } from '@/api/params';
import { IOptionSelect } from '@/types/forms';
import { IGenericOptions, IKeysGenericOptions, ILocation, IRol } from '@/types/params';

const mapLocations = (communes: ILocation[] | undefined): IOptionSelect[] => {
  const opciones = communes?.map(({ consecutive: consecutive, location_name: location_name }) => ({ id: consecutive, label: location_name }));
  return opciones || [];
};

const mapRoles = (comunas: IRol[] | undefined): IOptionSelect[] => {
  const opciones = comunas?.map(({ consecutive: consecutive, name: name }) => ({ id: consecutive, label: name }));
  return opciones || [];
};

type IOptions = {
  options: IGenericOptions[] | undefined;
  label: IKeysGenericOptions;
};

const mapOptions = ({ options, label }: IOptions): IOptionSelect[] => {
  const opciones = options?.map(option => {
    return { id: Number(option.id), label: option[label] };
  });
  return opciones || [];
};

export const useUserFormOptions = ({ idRegion }: { idRegion: number }) => {
  const { data: parameters } = useGetParams();
  const { data: regions } = useGetRegions();
  const { data: commune } = useGetComunasByIdRegion(idRegion);
  const { data: roles } = useGetRoles();

  const genres = parameters?.entity?.genres ?? [];
  const media = parameters?.entity?.media ?? [];
  const locations = parameters?.entity?.locations ?? [];

  return {
    comunasOpciones: mapOptions({ options: commune?.entity, label: 'commune' }),
    generosOpciones: mapOptions({ options: parameters?.entity.genres, label: 'genre' }),
    mediosOpciones: mapOptions({ options: parameters?.entity.media, label: 'media' }),
    regionesOpciones: mapOptions({ options: regions?.entity, label: 'region' }),
    sedesOpciones: mapLocations(parameters?.entity.locations),
    rolesOpciones: mapRoles(roles?.entity),
  };
};

export const useCourseFormOptions = () => {
 const {data: course} = useCreateCourse();
  return {
    
  };
};
