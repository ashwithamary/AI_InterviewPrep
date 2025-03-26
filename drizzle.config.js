/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
        url:'postgresql://neondb_owner:npg_bVsTW3wmQJ8f@ep-flat-thunder-a5g1twiq-pooler.us-east-2.aws.neon.tech/AI-Interview-Prep?sslmode=require',
    }
};