const AUTH_TOKEN_KEY = "ourpocket.auth_token";
const PROJECT_ID_KEY = "ourpocket.project_id";

function getAuthToken() {
	return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function setAuthToken(token: string) {
	window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearAuthToken() {
	window.localStorage.removeItem(AUTH_TOKEN_KEY);
	window.localStorage.removeItem(PROJECT_ID_KEY);
}

function getStoredProjectId() {
	return window.localStorage.getItem(PROJECT_ID_KEY);
}

function setStoredProjectId(projectId: string) {
	window.localStorage.setItem(PROJECT_ID_KEY, projectId);
}

export { clearAuthToken, getAuthToken, getStoredProjectId, setAuthToken, setStoredProjectId };
