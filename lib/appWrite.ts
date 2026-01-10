const ENDPOINT_ID = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID;
export const appwriteConfig = {
    endpoint: ENDPOINT_ID,
    projectID: PROJECT_ID,
    platform: PLATFORM,
    databaseId: DATABASE_ID,
    userCollectionId: USER_COLLECTION_ID,
}