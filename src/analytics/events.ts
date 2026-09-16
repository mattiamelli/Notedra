export type SourceSurface='dashboard'|'product_tour'|'practice_catalog'|'practice_attempt'|'mistake_book'|'study_path'|'exam_setup'|'course'|'topic'|'direct_navigation';
export type ActivityType='practice'|'study_path'|'course'|'topic'|'quick_exam'|'full_mock'|'draft'|'exam'|'adaptive'|'resume'|'cold_start';
export type DurationBucket='under_5m'|'5_to_15m'|'15_to_30m'|'30_to_60m'|'over_60m'|'unknown';
export type CompletionStatus='completed';
export type StudyMethodId='flexible'|'pomodoro'|'52-17'|'time-blocking'|'active-recall'|'interleaving';
export type StudyMethodRecommendationReason='new-learner'|'practice-short'|'deep-focus'|'complex-work'|'retrieval'|'multi-topic'|'flexible-fallback';

export interface AnalyticsEventMap {
 product_tour_started:{source_surface:'dashboard'|'account_settings'};
 product_tour_completed:{source_surface:'product_tour'};
 product_tour_skipped:{source_surface:'product_tour'};
 first_practice_started:{course_id:string;topic_id:string;activity_type:'practice';source_surface:SourceSurface};
 first_practice_completed:{course_id:string;topic_id:string;activity_type:'practice';completion_status:CompletionStatus;source_surface:'practice_attempt'};
 practice_started:{course_id:string;topic_id:string;activity_type:'practice';source_surface:SourceSurface};
 practice_completed:{course_id:string;topic_id:string;activity_type:'practice';completion_status:CompletionStatus;source_surface:'practice_attempt'};
 study_method_recommended:{method_id:StudyMethodId;reason_code:StudyMethodRecommendationReason;duration_bucket:DurationBucket;course_id:string;source_surface:'study_path'};
 study_method_selected:{method_id:StudyMethodId;source_surface:'study_path';selection_source?:'manual'|'recommended';recommended_method_id?:StudyMethodId};
 study_path_generated:{course_id:string;topic_id?:string;activity_type:'study_path';duration_bucket:DurationBucket;source_surface:'study_path';method_id:StudyMethodId};
 study_path_activity_opened:{course_id:string;topic_id:string;activity_type:ActivityType;source_surface:'study_path'};
 exam_started:{course_id:string;activity_type:'quick_exam'|'full_mock';duration_bucket:DurationBucket;source_surface:'exam_setup'};
 exam_completed:{course_id:string;activity_type:'quick_exam'|'full_mock';duration_bucket:DurationBucket;completion_status:CompletionStatus;source_surface:'exam'};
 next_action_shown:{activity_type:ActivityType;source_surface:'dashboard'};
 next_action_opened:{activity_type:ActivityType;source_surface:'dashboard'};
 course_opened:{course_id:string;activity_type:'course';source_surface:'course'|'direct_navigation'};
 topic_opened:{course_id:string;topic_id:string;activity_type:'topic';source_surface:'topic'|'course'|'direct_navigation'};
}

type Definition={required:readonly string[];optional?:readonly string[]};
export const analyticsEventRegistry={
 product_tour_started:{required:['source_surface']},product_tour_completed:{required:['source_surface']},product_tour_skipped:{required:['source_surface']},
 first_practice_started:{required:['course_id','topic_id','activity_type','source_surface']},first_practice_completed:{required:['course_id','topic_id','activity_type','completion_status','source_surface']},
 practice_started:{required:['course_id','topic_id','activity_type','source_surface']},practice_completed:{required:['course_id','topic_id','activity_type','completion_status','source_surface']},
 study_method_recommended:{required:['method_id','reason_code','duration_bucket','course_id','source_surface']},study_method_selected:{required:['method_id','source_surface'],optional:['selection_source','recommended_method_id']},study_path_generated:{required:['course_id','activity_type','duration_bucket','source_surface','method_id'],optional:['topic_id']},study_path_activity_opened:{required:['course_id','topic_id','activity_type','source_surface']},
 exam_started:{required:['course_id','activity_type','duration_bucket','source_surface']},exam_completed:{required:['course_id','activity_type','duration_bucket','completion_status','source_surface']},
 next_action_shown:{required:['activity_type','source_surface']},next_action_opened:{required:['activity_type','source_surface']},
 course_opened:{required:['course_id','activity_type','source_surface']},topic_opened:{required:['course_id','topic_id','activity_type','source_surface']},
} as const satisfies Record<keyof AnalyticsEventMap,Definition>;

export const durationBucket=(minutes:number):DurationBucket=>!Number.isFinite(minutes)||minutes<0?'unknown':minutes<5?'under_5m':minutes<=15?'5_to_15m':minutes<=30?'15_to_30m':minutes<=60?'30_to_60m':'over_60m';
