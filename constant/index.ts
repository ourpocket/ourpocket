const ENV = import.meta.env;

const ENVIRONMENT_MODE = {
  DEV: ENV.MODE === "development",
  PROD: ENV.MODE === "production",
};

const OUR_POCKET_API_URL = "";
const OUR_POCKET_JWT_KEY = "ourpocket_token";

export { ENV, ENVIRONMENT_MODE, OUR_POCKET_API_URL, OUR_POCKET_JWT_KEY };
