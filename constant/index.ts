const ENV = import.meta.env;

const ENVIRONMENT_MODE = {
    DEV: ENV.MODE === 'development',
    PROD: ENV.MODE === 'production',
};



export { ENV , ENVIRONMENT_MODE }
