import path from "../config/expressPath";

/**
 * Fire-and-forget: tell the server to bump today’s login count.
 * @throws on non-2xx or network error
 */
export async function incrementDailyLogins() {
	const resp = await fetch(`${path}/api/activity/login`, {
		method: "POST",
		credentials: "include",
	});

	if (!resp.ok) {
		const text = await resp.text();
		console.error(
			`[CTRL] incrementDailyLogins error: status=${resp.status}, body=${text}`
		);
		throw new Error(`Activity API error: ${resp.status} — ${text}`);
	}
}

/**
 * Fetches *all* activity records from the server.
 * @returns {Promise<Array<{id: string, date: string, logins: number}>>}
 */
export async function getAllActivity() {
	const resp = await fetch(`${path}/api/activity/getAll`, {
		method: "GET",
		credentials: "include",
	});

	if (!resp.ok) {
		const body = await resp.text();
		console.error("[CTRL] getAllActivity error:", resp.status, body);
		throw new Error(`Activity API error: ${resp.status}`);
	}

	const data = await resp.json();
	console.log("[CTRL] getAllActivity success:", data);
	return data;
}

/**
 * Fetches the number of currently logged-in users.
 * @returns {Promise<number>} the count of profiles with logged_in = true
 * @throws on network or API error
 */
export async function getOnlineCount() {
	const resp = await fetch(`${path}/api/activity/online`, {
		method: "GET",
		credentials: "include",
	});

	if (!resp.ok) {
		const text = await resp.text();
		console.error("[CTRL] getOnlineCount error:", resp.status, text);
		throw new Error(`Activity API error: ${resp.status}`);
	}

	const { onlineCount } = await resp.json();
	return onlineCount;
}
