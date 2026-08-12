export interface IMixedCategoryLeadsAPIResponse {
  http_status_code: number
  http_status_msg: string
  success: boolean
  data: IMixedCategoryLeadsData
  message: string
  language: string
  timestamp: string
}

export interface IMixedCategoryLeadsData {
  items?: IMixedCategoryLeadEntity[] | null
  total: number
  limit: number
}

export interface IMixedCategoryLeadEntity {
  _id: string
  reference_no: string
  user: string
  service_category: IMixedCategoryLeadServiceCategory
  child_category?: string | null
  manual_child_category?: string | null
  selected_options?: (string | null)[] | null
  preferred_start_date?: string | null
  preferred_time_of_day?: string | null
  start_date?: string | null
  start_time?: string | null
  end_date?: string | null
  end_time?: string | null
  note?: string | null
  address_1?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  pincode?: string | null
  cityOrPostalCode?: string | null
  desiredDate?: string | null
  timeSlot?: string | null
  additionalDetails?: string | null
  contact_details: IMixedCategoryLeadContactDetails
  status: string
  deletedAt?: string | null
  reason?: string | null
  dynamic_answers?: IMixedCategoryLeadDynamicAnswer[] | null
  computed_point?: number
  max_possible_point?: number
  point_score_percent?: number
  lead_stars?: number
  lead_stars_label?: string | null
  createdAt: string
  updatedAt: string
  __v?: number
  lead_status: string
  lead_status_label?: string | null
  quote_id?: string | null
  unlocked: boolean
  creditsToUnlock: number
  quotes_count: number
  document_verified?: boolean
}

export interface IMixedCategoryLeadServiceCategory {
  _id: string
  title: string
  description?: string | null
  image?: string | null
  parent_category?: IMixedCategoryLeadParentCategory | null
  company_credit?: number
  credit?: number
}

export interface IMixedCategoryLeadParentCategory {
  _id: string
  title: string
  description?: string | null
  image?: string | null
  credit?: number
  company_credit?: number
}

export interface IMixedCategoryLeadContactDetails {
  first_name: string
  last_name: string
  client_type: string
  phone: string
  email: string
}

export interface IMixedCategoryLeadDynamicAnswer {
  question_id: string
  key: string
  label: string
  value: string
  type: string
  _id: string
}
