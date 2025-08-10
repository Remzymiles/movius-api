export interface OAuthData {
  token: string
  scopes?: string[]
  authCode?: string
}

export interface OAuthResponseData {
  email: string
  first_name?: string
  last_name?: string
  middle_name?: string
  picture?: string
  sub?: string
  email_verified?: boolean
  locale?: string
  user?: any
  authToken?: string
  refreshToken?: string
}

export interface OAuthManagement {
  authenticate: (data: OAuthData) => Promise<OAuthResponseData>
}
