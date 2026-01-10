const ENDPOINT_ID = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;

export const appwriteConfig = {
    endpoint: ENDPOINT_ID,
    projectID: PROJECT_ID,
    platform: PLATFORM,
}