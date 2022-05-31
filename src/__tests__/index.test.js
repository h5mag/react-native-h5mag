import H5mag from '../index';

H5mag.setApiKey('insert_api_key');

beforeEach(() => {
	fetch.resetMocks();
});

jest.mock("react-native-fs", () => { })
jest.mock("rn-fetch-blob", () => { })
jest.mock("react-native-zip-archive", () => { })

describe('single project with edition(s)', () => {
	let mockProjectAndEditionsData = {
		"custom_domains": [{
			"canonical": true,
			"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
		}],
		"domain": "testproject.h5mag.com",
		"editions": [
			{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1646611200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "Be yourself" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Welcome" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Huizen" }
		],
		"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
		"title": "testproject"
	};

	it('retrieves a project with editions succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify({ mockProjectAndEditionsData }));
		await H5mag.getProjectAndEditions('testproject').then(res => {
			expect(res).toEqual({ mockProjectAndEditionsData });
		});
	});

	it('retrieves a project with sorted editions succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify(mockProjectAndEditionsData));
		await H5mag.getProjectAndEditions('testproject', { sort: true }).then(res => {
			expect(res).toEqual({
				"custom_domains": [{
					"canonical": true,
					"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
				}],
				"domain": "testproject.h5mag.com",
				"editions": [
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Huizen" },
					{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1646611200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "Be yourself" },
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Welcome" }
				],
				"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
				"title": "testproject"
			});
		});
	});

	let mockProjectAndEditionsDataWithSameDates = {
		"custom_domains": [{
			"canonical": true,
			"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
		}],
		"domain": "testproject.h5mag.com",
		"editions": [
			{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1646611200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "Be yourself" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Welcome" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Huizen" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/super", "lang": "en", "num_articles": 8, "path": "/super", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/super/cover/2054/__screenshot.jpg", "tags": [], "title": "Super" }
		],
		"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
		"title": "testproject"
	};

	it('retrieves a project with sorted editions (some by title, because some have the same date) succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify(mockProjectAndEditionsDataWithSameDates));
		await H5mag.getProjectAndEditions('testproject', { sort: true }).then(res => {
			expect(res).toEqual({
				"custom_domains": [{
					"canonical": true,
					"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
				}],
				"domain": "testproject.h5mag.com",
				"editions": [
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Huizen" },
					{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1646611200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "Be yourself" },
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/super", "lang": "en", "num_articles": 8, "path": "/super", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/super/cover/2054/__screenshot.jpg", "tags": [], "title": "Super" },
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Welcome" }
				],
				"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
				"title": "testproject"
			});
		});
	});

	let mockProjectAndEditionsDataWithSameDatesAndDiacriticTitles = {
		"custom_domains": [{
			"canonical": true,
			"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
		}],
		"domain": "testproject.h5mag.com",
		"editions": [
			{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "äz" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Zà" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Bë" },
			{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/super", "lang": "en", "num_articles": 8, "path": "/super", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/super/cover/2054/__screenshot.jpg", "tags": [], "title": "Lò" }
		],
		"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
		"title": "testproject"
	};

	it('retrieves a project with sorted editions (some by title, because some have the same date, but title has diacritic chars) succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify(mockProjectAndEditionsDataWithSameDatesAndDiacriticTitles));
		await H5mag.getProjectAndEditions('testproject', { sort: true }).then(res => {
			expect(res).toEqual({
				"custom_domains": [{
					"canonical": true,
					"hostname": "testproject.localdev.h5dev.xyz", "redirect": null
				}],
				"domain": "testproject.h5mag.com",
				"editions": [
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/huizen", "lang": "en", "num_articles": 2, "path": "/huizen", "published": 1649462400, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "tags": [], "title": "Bë" },
					{ "custom_image_src": null, "description": "", "href": "https://testproject.localdev.h5dev.xyz/test", "lang": "en", "num_articles": 2, "path": "/test", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/test/cover/1654/__screenshot.jpg", "tags": [], "title": "äz" },
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/super", "lang": "en", "num_articles": 8, "path": "/super", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/super/cover/2054/__screenshot.jpg", "tags": [], "title": "Lò" },
					{ "custom_image_src": null, "description": null, "href": "https://testproject.localdev.h5dev.xyz/welcome", "lang": "en", "num_articles": 8, "path": "/welcome", "published": 1644451200, "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/welcome/cover/2054/__screenshot.jpg", "tags": [], "title": "Zà" }
				],
				"logo": "https://testproject.h5mag.com/system/resources/images/h5mag_logo.png",
				"title": "testproject"
			});
		});
	});
})

describe('project list', () => {
	let mockProjectsData = [
		{ "domain": "testproject", "latest_edition": { "href": "https://testproject.localdev.h5dev.xyz/huizen", "path": "huizen", "publication_date": "2022-04-09", "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "title": "Huizen" }, "name": "testproject" },
		{ "domain": "hallo", "latest_edition": null, "name": "hallo" },
		{ "domain": "epic", "latest_edition": { "href": "https://epic.localdev.h5dev.xyz/welcome", "path": "welcome", "published": 1649721600, "screenshot_src": "https://epic.localdev.h5dev.xyz/epic/welcome/cover/156/__screenshot.jpg", "title": "Pauw" }, "name": "epic" }
	];

	it('retrieves all projects succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify(mockProjectsData));
		await H5mag.getProjectsList().then(res => {
			expect(res).toEqual(mockProjectsData);
		});
	});

	it('retrieves only projects with at least one published edition succesfully', async () => {
		fetch.mockResponseOnce(JSON.stringify(mockProjectsData));
		await H5mag.getProjectsList({ filterByHasLatestEdition: true }).then(res => {
			expect(res).toEqual([
				{ "domain": "testproject", "latest_edition": { "href": "https://testproject.localdev.h5dev.xyz/huizen", "path": "huizen", "publication_date": "2022-04-09", "screenshot_src": "https://testproject.localdev.h5dev.xyz/testproject/huizen/cover/1647/__screenshot.jpg", "title": "Huizen" }, "name": "testproject" },
				{ "domain": "epic", "latest_edition": { "href": "https://epic.localdev.h5dev.xyz/welcome", "path": "welcome", "published": 1649721600, "screenshot_src": "https://epic.localdev.h5dev.xyz/epic/welcome/cover/156/__screenshot.jpg", "title": "Pauw" }, "name": "epic" }
			]);
		});
	});
})
