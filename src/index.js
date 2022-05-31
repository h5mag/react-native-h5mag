import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import StaticServer from 'react-native-static-server';
import { WebView } from 'react-native-webview';
import { unzip } from 'react-native-zip-archive';

class H5magAPI {
	apiKey = "";

	setApiKey(apiKeyParam) {
		apiKey = apiKeyParam;
	}

	/**
	 * Retrieves one project.
	 * @param {string} projectDomain 
	 * @param {object} options {apiKey: string, sort: boolean}
	 * @returns JSON object of a project.
	 */
	async getProjectAndEditions(projectDomain, options = {}) {
		try {
			const response = await fetch('https://' + projectDomain + '.h5mag.com/api/1/project.json', {
				headers: { 'Authenticate': options?.apiKey ?? apiKey },
			});
			const projectRes = await response.json();

			if (options?.sort && projectRes)
				projectRes.editions.sort(function (a, b) {
					if (a.published === b.published) {
						let collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
						return collator.compare(a.title, b.title);
					}
					return b.published - a.published;
				});

			return projectRes;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Retrieves all projects.
	 * @param {object} options {apiKey: string, filterByHasLatestEdition: boolean} 
	 * @returns JSON array of all projects.
	 */
	async getProjectsList(options = {}) {
		try {
			const response = await fetch('https://api.h5mag.com/projects', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Version': '1',
					'Authenticate': options?.apiKey ?? apiKey,
				},
			});
			const projectsRes = await response.json();

			if (options?.filterByHasLatestEdition) {
				let result = projectsRes.filter(project => project.latest_edition !== null);
				return result;
			}

			return projectsRes;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Downloads the specified editon.
	 * @param {string} targetPath 
	 * @param {string} charset 
	 * @param {string} editionPath 
	 * @param {string} projectDomain
	 * @param {object} options {apiKey: string}
	 * @returns 'downloaded' if successful.
	 */
	downloadEdition(targetPath, charset, editionPath, projectDomain, options = {}) {
		return new Promise((resolve, reject) => {
			RNFS.mkdir(targetPath);

			// get a list of files and directories in the main bundle
			RNFS.readDir(targetPath).then((result) => {
				result.forEach((element) => {
					console.log(Platform.OS + ' ' + element.name, element.size);
				});

				if (result.length > 0) {
					resolve('downloaded');
				} else {
					try {
						console.log('Downloading...');
						const pathToZip = `${targetPath}/${editionPath.substring(1)}.zip`;

						RNFetchBlob.config({
							fileCache: true,
							path: pathToZip,
						}).fetch('GET', 'https://' + projectDomain + '.h5mag.com/api/1/editions' + editionPath + '.zip', {
							Authenticate: options?.apiKey ?? apiKey,
						}).progress((received, total) => {
							console.log(Platform.OS + ' progress ' + Math.floor((received / total) * 100) + '%');
						}).then((res) => {
							console.log(Platform.OS + ' The file saved to ', res.path());

							unzip(pathToZip, targetPath, charset).then((zippath) => {
								console.log(Platform.OS + ' unzip completed at ', zippath);
								resolve('downloaded');
							}).catch((err) => {
								reject(err);
								console.log(Platform.OS + ' ZIP ERROR: ', err);
							});
						}).catch((err) => {
							reject(err);
							console.log(Platform.OS + ' FB ERROR', err);
						});
					} catch (err) {
						reject(err);
					}
				}
			}).catch((err) => {
				reject(err.message, err.code);
				console.log(Platform.OS + ' ERROR:', err.message, err.code);
			});
		})
	};

	/**
	 * Deletes the specified folder and all files in it.
	 * @param {string} targetPath 
	 * @returns 'deleted' if successful.
	 */
	deleteEdition(targetPath) {
		return new Promise((resolve, reject) => {
			RNFS.exists(targetPath).then((exists) => {
				if (exists) {
					RNFS.unlink(targetPath).then(() => {
						console.log('Edition has been deleted');
						resolve("deleted");
					}).catch((err) => {
						reject(err);
					});
				} else {
					resolve("deleted");
				}
			});
		});
	}

	/**
	 * Starts a local server for offline edition reading.
	 * @param {string} osPath 
	 * @param {string} targetPath 
	 * @param {number} port (e.g. 8080)
	 * @returns 'success' if server started successfully.
	 */
	readEditionOffline(osPath, targetPath, port) {
		return new Promise((resolve, reject) => {
			// RNFS.mkdir(targetPath);

			let server = new StaticServer(port, osPath, { keepAlive: true, localOnly: true });

			// Start the server
			server.start().then(serverUrl => {
				console.log(Platform.OS + ' Serving at URL', serverUrl);
				console.log(Platform.OS + ' Serving at Path', osPath);

				// get a list of files and directories in the main bundle
				RNFS.readDir(targetPath).then(result => {
					result.forEach(element => {
						console.log(Platform.OS + ' ' + element.name, element.size);
					});

					if (result.length > 0) {
						resolve('success');
					} else {
						reject('Error: edition files not found');
					}
				}).catch(err => {
					console.log(Platform.OS + ' ERROR:', err.message, err.code);
					reject(err.message);
				});
			}).catch(err => {
				reject(err.message);
			});
		});
	}

	/**
	 * EditionReader component.
	 * @param {string} props - targetPath 
	 * @returns JSX component.
	 */
	EditionReader(props) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<WebView
					cacheEnabled={false}
					allowFileAccess={true}
					allowFileAccessFromFileURLs={true}
					allowUniversalAccessFromFileURLs={true}
					originWhitelist={['*']}
					source={{ uri: props.targetPath.includes('http') ? props.targetPath : 'file://' + props.targetPath }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					style={{ backgroundColor: 'black', flex: 1 }}
				/>
			</SafeAreaView>
		)
	}
}

let H5mag = (() => {
	let api = new H5magAPI();
	return api;
})();

export default H5mag;