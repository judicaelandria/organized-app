export type FieldServiceGroupMemberType = {
  person_uid: string;
  sort_index: number;
  isOverseer: boolean;
  isAssistant: boolean;
};

export type FieldServiceGroupType = {
  group_id: string;
  group_data: {
    _deleted: boolean;
    updatedAt: string;
    name: string;
    sort_index: number;
    members: FieldServiceGroupMemberType[];
    midweek_meeting?: boolean;
    weekend_meeting?: boolean;
    language_group?: boolean;
  };
};

export type FieldServiceGroupExportType = {
  group_number: number;
  group_name: string;
  overseer?: string;
  overseerAssistant?: string;
  publishers: string[];
};
