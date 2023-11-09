import { baseURI } from '../constant';
export function getCookie(cname) {
	var results = document.cookie.match('(^|;) ?' + cname + '=([^;]*)(;|$)');
	return results ? decodeURIComponent(results[2]) : '';
}

export function setCookie(cname, cvalue, cday) {
	var exdays = cday ? cday : 100; //60;
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = 'expires=' + d.toGMTString();
	document.cookie = cname + '=' + encodeURIComponent(cvalue) + ';' + expires + ';path=/';
}

export function getBrowser() {
	let userAgent = window.navigator.userAgent;

	const test = regexp => {
		return regexp.test(userAgent);
	};

	if (test(/zalo/i)) {
		return 'Zalo Browser';
	} else if (test(/opr\//i) || !!window.opr) {
		return 'Opera';
	} else if (test(/edg/i)) {
		return 'Microsoft Edge';
	} else if (test(/chrome|chromium|crios/i)) {
		return 'Google Chrome';
	} else if (test(/firefox|fxios/i)) {
		return 'Mozilla Firefox';
	} else if (test(/safari/i)) {
		return 'Apple Safari';
	} else if (test(/trident/i)) {
		return 'Microsoft Internet Explorer';
	} else if (test(/ucbrowser/i)) {
		return 'UC Browser';
	} else if (test(/samsungbrowser/i)) {
		return 'Samsung Browser';
	} else {
		return 'Unknown browser';
	}
}

export function getOS() {
	let userAgent = window.navigator.userAgent,
		platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'],
		os = null;

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'Mac OS';
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		os = 'iOS';
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'Windows';
	} else if (/Android/.test(userAgent)) {
		os = 'Android';
	} else if (/Linux/.test(platform)) {
		os = 'Linux';
	}

	return os;
}


export async function getTerms(op) {
	const params = {
		organization_id: op.organization_id,
		extend_app_id: op.extend_app_id,
		extend_app_name: op.extend_app_name,
		extend_id: op.extend_uid,
		platform: op.platform,
		browser: op.browser,
		term_id: op.term_id,
	};

	const qs =
		'?' +
		Object.keys(params)
			.map((key) => `${key}=${encodeURIComponent(params[key])}`)
			.join('&');
	const term = await fetch(baseURI + '/cmp-terms' + qs)
	const dataResponse = await term.json();
	console.log('dataResponse', dataResponse)
	return dataResponse.data
}

export async function postConsents(op) {
	if (op.mode === 'simulate') return true;
	const params = {
		organization_id: op.organization_id,
		mapping_key: op.mapping_key,
		extend_app_id: op.extend_app_id,
		extend_app_name: op.extend_app_name,
		extend_uid: op.extend_uid,
		term_id: op.term_id,
		property_last_data: op.cmp_properties,
		last_platform: op.platform || 'Windows',
		last_browser: op.browser || 'Chrome',
	};

	const terms = await fetch(baseURI + '/cmp-consents', {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(params),
	})
		.then((res) => {
			if (res.status === 200) return res.json();
		})
		.then((res) => {
			if (res.statusCode == 200) {
				return res.data;
			}
		});

	return terms;
};


export const CMP_FORM_VALIDATES = {
	isAcceptAll: {
		required: 'Vui lòng đồng ý để sử dụng dịch vụ',
	},
};

export function termProp2checkProp(termProp) {
	const TERM_CHECK_PROPERTY = {};

	termProp?.map((prop) => {
		TERM_CHECK_PROPERTY[prop._id] = {
			property_id: prop._id,
			property_value: false,
			property_type: prop.type,
			property_name: prop.name,
			error_message: ''
		};
	});

	return TERM_CHECK_PROPERTY;
}

export function checkProp2cmpProp(checkProperty) {
	const cmpProperties = [];
	for (const property in checkProperty) {
		const tmp = checkProperty[property];
		const copy_tmp = {
			...tmp,
			property_value: tmp['property_value'] ? 1 : 0,
		};
		cmpProperties.push(copy_tmp);
	}
	return cmpProperties;
}
