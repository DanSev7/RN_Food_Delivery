import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

const ENDPOINT_ID = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const PLATFORM = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID;
const CATEGORY_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CATEGORY_COLLECTION_ID;
const MENU_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID;
const CUSTOMIZATION_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATION_COLLECTION_ID;
const MENU_CUSTOMIZATION_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATION_COLLECTION_ID;
const BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID;
// const PRODUCT_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_PRODUCT_COLLECTION_ID;

export const appwriteConfig = {
    endpoint: ENDPOINT_ID!,
    projectID: PROJECT_ID!,
    platform: PLATFORM!,
    databaseId: DATABASE_ID!,
    userCollectionId: USER_COLLECTION_ID!,
    categoryCollectionId: CATEGORY_COLLECTION_ID!,
    menuCollectionId: MENU_COLLECTION_ID!,
    customizationCollectionId: CUSTOMIZATION_COLLECTION_ID!,
    menuCustomizationCollectionId: MENU_CUSTOMIZATION_COLLECTION_ID!,
    bucketId: BUCKET_ID!,
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectID)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({email, password, name}: CreateUserPrams) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if(!newAccount) throw new Error('User not created');
        
        await signIn({email, password});

        // Construct avatar URL manually since getInitials() returns a URL object
        const avatarUrl = `${appwriteConfig.endpoint}/avatars/initials?name=${encodeURIComponent(name)}`;
        
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                name,
                email,
                avatar: avatarUrl
            }
        );

        return newUser;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // Check if there's an existing session and delete it
        try {
            const currentSession = await account.getSession('current');
            if (currentSession) {
                await account.deleteSession('current');
            }
        } catch (error) {
            // No active session, continue with sign in
        }
        
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error (error as string);
    }
}

export const signOut = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error (error as string);
    }
}


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw new Error('User not found');
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', currentAccount.$id)
            ]
        );
        if(!currentUser) throw new Error('User not found');
        
        return currentUser.documents[0];
    } catch (error: any) {
        // If there's no active session (guest user), return null instead of throwing
        if (error.code === 401 || error.message?.includes('missing scopes')) {
            console.log('No active session - user is a guest');
            return null;
        }
        console.log('Error fetching user:', error);
        return null;
    }
}

export const getMenu = async ({category, query}: GetMenuParams
) => {
    try {
        const queries: string[] = [];

        if(category) {
            queries.push(Query.equal('categoryies', category));
        }

        if(query) {
            queries.push(Query.search('name', query));
        }

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,    
        );
        if(!menus) throw new Error('Menu not found');
        
        return menus.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}

export const getCategories = async () => {
    try {
        
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoryCollectionId,
        );
        if(!categories) throw new Error('Categories not found');
        
        return categories.documents;
    } catch (error) {
        throw new Error(error as string);
    }
}
