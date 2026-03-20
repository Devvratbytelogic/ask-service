export interface IFaqItem {
  _id: string
  question: string
  type: string
  answer: string
  status: boolean
  deletedAt: string | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IFaqCategory {
  type: string
  faqs: IFaqItem[]
}

export interface IAllFaqsAPIResponse {
  http_status_code: number
  http_status_msg: string
  success: boolean
  data?: {
    list: IFaqCategory[]
  }
  message: string
  timestamp: string
}
