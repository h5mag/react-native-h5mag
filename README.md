## **React-native-h5mag**
Welcome to the react-native-h5mag framework readme.

With the react-native-h5mag framework, you can easily access H5mag public API. It is a flexible framework that developers can use in new and existing React Native projects.

React-native-h5mag supports both iOS and Android and has been tested on the following OS versions:

| OS | Versions |
| ------ | ------ |
| iOS | 12.4, 15.0, 15.4 |
| Android | 7.0 - 12.0 |

## **List Of Contents**
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [getProjectAndEditions()](#getprojectandeditions)
  - [getProjectsList()](#getprojectslist)
  - [downloadEdition()](#downloadedition)
  - [deleteEdition()](#deleteedition)
  - [readEditionOffline()](#readeditionoffline)
- [Components](#components)
- [Building react-native-h5mag](#building-react-native-h5mag)

## **Installation**
You need NPM to install the H5mag framework. For installation use this command:

`npm i @h5mag/react-native-h5mag`

## **Usage**
In order to use the API, you will need to set the API key first. Here is an example:

```js
// App.js
import H5mag from 'react-native-h5mag';

H5mag.setApiKey('h5_public_Fn30x...Wvay2g');
```

## **API**
After setting the API key you can use the functions below.

#### getProjectAndEditions
`async getProjectAndEditions() : Promise<any>`

Retrieves one project.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| projectDomain | string | Your project domain (e.g. name of your project) |
| options | object | Extra options -- See options table below|

Options object:
| Parameter | Type | Description |
| ------ | ------ | ------ |
| apiKey | string | Manually set/override API key |
| sort | boolean | Sort editions by date |

**Example:**

```js
const getProjectData = async () => {
	try {
		await getProjectAndEditions(projectDomain, { sort: true }).then((result) => {
			// Do something with the project data...
		});
	} catch (error) {
		console.error(error);
	}
};
```

---

#### getProjectsList
`async getProjectsList() : Promise<any>`

Retrieves all projects.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| options | object | Extra options -- See options table below|

Options object:
| Parameter | Type | Description |
| ------ | ------ | ------ |
| apiKey | string | Manually set/override API key |
| filterByHasLatestEdition | boolean | Only retrieves projects with at least one published edition |

**Example:**

```js
const getProjectsData = async () => {
	try {
		const response = await getProjectsList({ filterByHasLatestEdition: true });
                // Do something with the projects data...
	} catch (error) {
		console.error(error);
	}
};
```

---

#### downloadEdition
`downloadEdition() : Promise<any>`

Downloads the specified editon.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| targetPath | string | Path to folder location of edition |
| charset | string | Character set to use (e.g. UTF-8) |
| editionPath | string | Path of edition (e.g. /editionName) |
| projectDomain | string | Domain name of project (e.g. testproject) |
| options | object | Extra options -- See options table below|

Options object:
| Parameter | Type | Description |
| ------ | ------ | ------ |
| apiKey | string | Manually set/override API key |

**Example:**

```js
// You could get the **editionPath** and **projectDomain** through props.

const targetPath = (Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath) + '/' + projectDomain + edition.path;
const charset = 'UTF-8';

const startEditionDownload = () => {
	downloadEdition(targetPath, charset, editionPath, projectDomain).then((result) => {
		if (result === 'downloaded') {
			// Do something after the edition has been downloaded....
		}
	}).catch((err) => {
		console.log(err);
	});
};
```

---

#### deleteEdition
`deleteEdition() : Promise<any>`

Deletes the specified folder and all files in it.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| targetPath | string | Path to folder location of edition |

**Example:**

```js
deleteEdition(targetPath).then((result) => {
	if (result === 'deleted') {
		// Do something after the deletion...
	}
});
```

---

#### readEditionOffline
`readEditionOffline() : Promise<any>`

Starts a local server for offline edition reading.

| Parameter | Type | Description |
| ------ | ------ | ------ |
| osPath | string | Path of the root app folder |
| targetPath | string | Path to folder location of edition |

**Example:**

```js
const osPath = Platform.OS === 'android' ? DocumentDirectoryPath : MainBundlePath;

readEditionOffline(osPath, targetPath).then((result) => {
	if (result === 'success') {
                // Server is ready!
		// Update a state...
	}
});

if (readyToReadEdition) {
	return (<EditionReader targetPath={targetPath} />);
}
```

---

## **Components**

#### EditionReader
`<EditionReader targetPath={...} />`

The EditionReader component uses a Webview wrapped inside a SafeAreaView to load the selected edition.

## **Building react-native-h5mag**
Ensure you have npm installed

1) `mpm install -g bob`
2) `npm pack`

## **License**
MIT
