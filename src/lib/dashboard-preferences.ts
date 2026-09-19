const REDUCED_MOTION_KEY = "ourpocket.preferences.reduced_motion";

function getReducedMotionPreference() {
	return window.localStorage.getItem(REDUCED_MOTION_KEY) === "true";
}

function applyReducedMotionPreference(enabled = getReducedMotionPreference()) {
	document.documentElement.dataset.reduceMotion = enabled ? "true" : "false";
}

function setReducedMotionPreference(enabled: boolean) {
	window.localStorage.setItem(REDUCED_MOTION_KEY, String(enabled));
	applyReducedMotionPreference(enabled);
}

export { applyReducedMotionPreference, getReducedMotionPreference, setReducedMotionPreference };
