let env = process.env;

export default {
    port: env.PORT || 3000,
    mongoUri: "mongodb://localhost:27017/us"  
};