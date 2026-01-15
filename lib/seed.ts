import { ID } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appWrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string; // extend as needed
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[]; // list of customization names
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

async function clearAll(collectionId: string): Promise<void> {
    const list = await databases.listDocuments(
        appwriteConfig.databaseId,
        collectionId
    );

    await Promise.all(
        list.documents.map((doc) =>
            databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
        )
    );
}

async function seed(): Promise<void> {
    try {
        console.log('🌱 Starting seed process...');
        
        // 1. Clear all collections (but not storage since we're using external URLs)
        console.log('🗑️  Clearing existing data...');
        await clearAll(appwriteConfig.categoryCollectionId);
        await clearAll(appwriteConfig.customizationCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.menuCustomizationCollectionId);

        // 2. Create Categories
        console.log('📁 Creating categories...');
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.categoryCollectionId,
                ID.unique(),
                cat
            );
            categoryMap[cat.name] = doc.$id;
        }
        console.log(`✅ Created ${data.categories.length} categories`);

        // 3. Create Customizations
        console.log('🎨 Creating customizations...');
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.customizationCollectionId,
                ID.unique(),
                {
                    name: cus.name,
                    price: cus.price,
                    type: cus.type,
                }
            );
            customizationMap[cus.name] = doc.$id;
        }
        console.log(`✅ Created ${data.customizations.length} customizations`);

        // 4. Create Menu Items (using external image URLs directly)
        console.log('🍔 Creating menu items...');
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            // Use the external image URL directly instead of uploading
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCollectionId,
                ID.unique(),
                {
                    name: item.name,
                    description: item.description,
                    image_url: item.image_url, // Use external URL directly
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protein: item.protein,
                    categories: categoryMap[item.category_name],
                }
            );

            menuMap[item.name] = doc.$id;

            // 5. Create menu_customizations
            for (const cusName of item.customizations) {
                await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCustomizationCollectionId,
                    ID.unique(),
                    {
                        menu: doc.$id,
                        customizations: customizationMap[cusName],
                    }
                );
            }
        }
        console.log(`✅ Created ${data.menu.length} menu items`);

        console.log("✅ Seeding complete!");
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}

export default seed;