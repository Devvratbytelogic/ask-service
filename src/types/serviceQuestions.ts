export interface IAllServiceQuestionsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllServiceQuestionsData;
    message: string;
    timestamp: string;
  }
  export interface IAllServiceQuestionsData {
    list?: (ListEntity)[] | null;
  }
  export interface ListEntity {
    _id: string;
    label: string;
    key: string;
    type: string;
    options?: (OptionsEntity | null)[] | null;
    is_multiple: boolean;
    is_required: boolean;
    placeholder?: string | null;
    service_id: string;
    step: number;
    order: number;
    status: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  export interface OptionsEntity {
    label: string;
    value: string;
    _id: string;
  }

/** Single dynamic answer sent in create service request */
export interface IDynamicAnswerPayload {
  question_id: string;
  key: string;
  label: string;
  type: string;
  value: string;
}

/** Payload for POST /user/service-request */
export interface ICreateServiceRequestPayload {
  service_category: string;
  // child_category: string;
  // manual_child_category: string;
  note: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  dynamic_answers: IDynamicAnswerPayload[];
  contact_details: {
    first_name: string;
    last_name: string;
    client_type: string;
    phone: string;
    email: string;
  };
}
