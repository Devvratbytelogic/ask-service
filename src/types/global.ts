export interface IGlobalSettingsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IGlobalSettingsAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IGlobalSettingsAPIResponseData {
  _id: string;
  email: string;
  google_analytics_id: string;
  google_tag_manager: string;
  marketplace_name: string;
  meta_description: string;
  meta_keywords: string;
  meta_title: string;
  og_tag: string;
  phone: string;
  schema_markup: string;
  search_console: string;
  instagram_link: string;
  facebook_link: string;
  x_link: string;
  address: string;
  quote_limit: number;
  quote_expired: number;
  logo: string;
  icon_image: string;
  instagram_logo: string;
  facebook_logo: string;
  x_logo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  platformDescription: string;
  platformName: string;
  linkedin_link: string;
  linkedin_logo: string;
  footer_logo: string;
  home_youtube_link?: string;
}
