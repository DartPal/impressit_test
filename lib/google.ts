import { google } from 'googleapis'

const hasGoogleConfig =
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  !!process.env.GOOGLE_REFRESH_TOKEN

export const isGoogleEnabled = hasGoogleConfig

export function getOAuthClient() {
  if (!hasGoogleConfig) {
    return null
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

  return oauth2Client
}
