import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleDriveConfig {
    type = process.env.GOOGLE_DRIVE_TYPE;
    project_id = process.env.GOOGLE_DRIVE_PROJECT_ID;
    private_key_id = process.env.GOOGLE_DRIVE_PRIVATE_KEY_ID;
    private_key = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
    client_secret = process.env.CLIENT_SECRET;
    client_email = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
    redirectUrl = process.env.REDIRECT_URI
    client_id = process.env.GOOGLE_DRIVE_CLIENT_ID;
    auth_uri = process.env.GOOGLE_DRIVE_AUTH_URI;
    token_uri = process.env.GOOGLE_DRIVE_TOKEN_URI;
    auth_provider_x509_cert_url = process.env.GOOGLE_DRIVE_AUTH_PROVIDER_CERT_URL;
    client_x509_cert_url =  process.env.GOOGLE_DRIVE_CLIENT_CERT_URL;
    universe_domain?: "googleapis.com";
}

// "type": "service_account",
//   "project_id": "hethongcongngheweb",
//   "private_key_id": "2469db9ca05a169f4d66758c02f8557977b46b64",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC339xjSBtraGT+\nJaqghdaU7ujlVTHkSuEGK1DmIJqkzADDYJavJejqnOwD3JmO59XxSvunwrha/Umw\nTRhJG8W0QWrvj0tSxfqjE5u+0CQXJdLwm5aosWDzWHnCYzndy8UnhRpIBySUwbAZ\nMEn8ubrMu+sxlvV/dppKvUmplWyVM1YtipcmLdLwi+E0bRd88w0XGX8CxYXHkskE\nYB/R0av0eaUXcrp8rroHlIjxYsUXH0IZ4yjhc+2tSVb/9MEjAVdYo9LyW/RvudXz\nI+i+2xCBOm/vY0VAkh3bawUorELDj2lusyj8h+GFZmH75jxgbTXBVRPhZjlM1wub\nIMhtTgLxAgMBAAECggEABPD0n2G5hD48HIz5lAe/YlA18lfC7U4f1EZyDZp0XW0I\nBjgVxI4sagWeiA9eZws5jMWa6Va1FT43mTpxJncjGHrQ5gV/8jD/e8YT9OGWCV3g\nWHaYlV7y6ocxpR99LMXZk1F4iSqmo9gSpJKkzQWsDJgY3sPI7sx1TVXfNrnyaY35\nyobxzqJD6c49bCboaiKShPLlPhM8DioQxc/I7QCxfGmPkFDUVV4QkpZxSthSTnK/\n3eFderxzjaVi2pGF1KmTDDftry7qqsrCv0qmEpZj0fx+k60KQ8ykBjO1jR9fOgEg\nlKXMLTw4fqRwWNSc+bMmnm8rkcP2whCuO6iygDmqawKBgQDZkiLBQMlsDAn+fK+Q\nP6e9p7BccLY09pUlcrSNghybSS042Zf1nVVENaRvB8TfcOAMYBTTAf2MN4i7QsNO\nUelnNr8A2dztM2nkMg0vR0Mvr7MKdZWqoaaeM9nzm4ila3mkO8gvIIMSMV/rBth1\nc8pwGotF+/KT/4Km6jAGUAF4RwKBgQDYWhTPx5VO37yZ9Rstf60jXUcLguW/nkR2\nNf1ApqNuEhWNt1dRvo/PBgvuNwDjYaE1S4rWQgZ8SeMhhgwz+Iw+ExIdKC4iSlNa\nxJetS6C79sR8cRz0NYAg+f/RpHS/Fcx5IvhsRpsBD4XTAKPKankzpqxw/15+H7Iz\n8mLRJWP/BwKBgQDMyUY5TDfKoVJO3SGKzr+ePdY8TELUezxLMTpM76jpaOlN11G2\n984oE62gbFmcTuwz+cPgEMGMV0E1sVOPxn3AjsEdlfLiuT/0cEAEvji5C9GkCKVF\nJD5mLjv5le36dbzbHwH/icSVPTAhUiIv+zsSZYmt58WeFCPv5AIsDuYzRQKBgCEZ\n7zM3Gw39R1La4HSeozPU8qi9Nz+RDHJ1ojDBDiIqHCgZk/+Kw1/uUeb5fWZMqqiH\nzU8ovOtJNroLU1SkQ3i/3Dafzicq7gPmLjqyZn47rCZJ/B8VDGx/M3e0zLPrtuQV\nyKJwTwjjghsdbvHqRm7zolCLkb6ERPSTsjDDosADAoGBAKHWt8JoK2BjrpaYb45A\nL6afSJu66NJTlaLQo62QKLvoZDD21j/rj8IRn0hVUYROG+oUA7fONM06mRtGAB2w\nomUU8sUF95ylw2f0zEZe3rts2Ml/xFSixkwCZ8FWwp4WO+L+TVT4iJKKxyoY07XT\ngXy+RssYmaMq4jWa7rtB2tVL\n-----END PRIVATE KEY-----\n",
//   "client_email": "nemo-541@hethongcongngheweb.iam.gserviceaccount.com",
//   "client_id": "104404901671864799951",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/nemo-541%40hethongcongngheweb.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
