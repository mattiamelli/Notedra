export interface AcademicSubject {
  subject_id: string;
  code: string;
  name: string;
  short: string;
}

export interface AcademicTopic {
  subject_id: string;
  topic_id: string;
  name: string;
  order: number;
}

export interface AcademicIndex {
  subjects: AcademicSubject[];
  topics: AcademicTopic[];
}
