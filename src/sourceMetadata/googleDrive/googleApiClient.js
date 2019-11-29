import { promises as fs } from 'fs'
import { google } from 'googleapis'
import readline from 'readline'

const OAuth2 = google.auth.OAuth2

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
const TOKEN_PATH = 'token.json'

export async function googleApiClient(action) {
  let credentials
  try {
    const credentialsFile = await fs.readFile('credentials.json', {
      encoding: 'utf8',
    })
    credentials = JSON.parse(credentialsFile)
  } catch (error) {
    console.log('Error loading client secret file')
    throw error
  }
  return await authorize(credentials, action)
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new OAuth2(client_id, client_secret, redirect_uris[0])

  // Check if we have previously stored a token.
  let token
  try {
    token = await fs.readFile(TOKEN_PATH, 'utf8')
  } catch {
    return getAccessToken(oAuth2Client, callback)
  }
  oAuth2Client.setCredentials(JSON.parse(token))
  return await callback(oAuth2Client)
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {Function} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, async (err, token) => {
      if (err) return console.error('Error retrieving access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      try {
        await fs.writeFile(TOKEN_PATH, JSON.stringify(token))
        console.log('Token stored to', TOKEN_PATH)
      } catch (err) {
        console.error(err)
      }
      return await callback(oAuth2Client)
    })
  })
}
