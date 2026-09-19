import { beforeEach, expect, it } from "vitest";
import { getEnvironment, setEnvironment } from "./environment";
import { setStoredProjectId } from "./session";
beforeEach(() => {
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
			removeItem: (key: string) => values.delete(key),
		},
	});
});
it("defaults to sandbox and remembers environment separately for each project", () => {
	setStoredProjectId("project-a");
	expect(getEnvironment()).toBe("sandbox");
	setEnvironment("production");
	expect(getEnvironment()).toBe("production");
	setStoredProjectId("project-b");
	expect(getEnvironment()).toBe("sandbox");
	setStoredProjectId("project-a");
	expect(getEnvironment()).toBe("production");
});
