# Old English Online
![](https://img.shields.io/github/package-json/v/vklester/MA)
![](https://img.shields.io/github/commit-activity/w/vklester/MA)

# About
This is the repository for Old English Online. OEO is an online learning platform for teaching Old English. Visit [oldenglish.info](https://oldenglish.info) to use the site.

# Contributor's Guide
If you want to raise an issue for us to fix, perform the following steps:
1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Navigate to the project repository on Github. It's [here](https://github.com/vklester/MA).
3. Under the repository name, click **Issues**.
4. Click **New issue**.
5. If there are multiple issue types, click **Get started** next to the type of issue you'd like to open.
6. Type a title and description for your issue.
7. When you're finished, click **Submit** new issue

If you want to contribute direcly to Old English Online yourself, you can, but it will require you install a few things on your own computer. Just follow the steps below:
1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Navigate to the project repository on Github. It's [here](https://github.com/vklester/MA).
3. Click the **Fork** button in the top right-hand corner of the page to copy the repo.
4. Click the **Clone or download** button to clone the project to your own machine.
5. Make the changes you want to make to the page in the `/src/` folder, not the `/docs/` folder. We recommend you use a code editor to do this as it will make it easier to read and flag errors. You can download Visual Studio Code [here](https://code.visualstudio.com/).
6. Commit changes to your own branch. We recommend you use a git client to do this, you can get the free GitKraken [here](https://www.gitkraken.com/).
7. Push your work back up to your fork. If you're using GitKraken, you just need to click the **Push** button.
8. Submit a **Pull Request** so that we can review your changes.
9. An administrator will then review and approve your changes.

# Developing

## Installing
If you want to run Old English Online locally on your machine so you can use it offline, you will need to install it. 

1. Download an IDE. We recommend Visual Studio Code which you can download [here](https://code.visualstudio.com/).
2. Install the most recent version of Node.js. You can download it [here](https://nodejs.org/en/download/).
3. Open the terminal in Visual Studio Code and make sure you're in the root folder of the project. If not, you can change which directory you're in by typing `cd C:\whatever_your_filepath_is`. My root folder is C:\Users\jkoiviv\Desktop\MA so I'd type `cd C:\Users\jkoiviv\Desktop\MA`.
4. If you are in the root folder, type `npm install` and press **Enter**. Everything you need will be installed automatically.
5. When it is finished, type `npm run start` to build the project. It should open automatically in your default browser. If not, navigate to *localhost:3000* in your browser. 

## Running Development Watch task

Run `npm start` to start the watch task. This will build the project, start the watch tasks that wait for file changes, and open the project in your default browser.
From here, you can make edits to the templates, scripts and styles in the `/src/` folder, and the project will automatically refresh with your changes.

# Contributor's Guide
If you want to raise an issue for us to fix, perform the following steps:
1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Navigate to the project repository on Github. It's [here](https://github.com/vklester/MA).
3. Under the repository name, click **Issues**.
4. Click **New issue**.
5. If there are multiple issue types, click **Get started** next to the type of issue you'd like to open.
6. Type a title and description for your issue.
7. When you're finished, click **Submit** new issue


If you want to contribute direcly to Old English Online yourself, you can, but it will require you install a few things on your own computer. Just follow the steps below:
1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Navigate to the project repository on Github. It's [here](https://github.com/vklester/MA).
3. Click the **Fork** button in the top right-hand corner of the page to copy the repo.
4. Click the **Clone or download** button to clone the project to your own machine.
5. Make the changes you want to make to the page in the `/src/` folder, not the `/docs/` folder. We recommend you use a code editor to do this as it will make it easier to read and flag errors. You can download Visual Studio Code [here](https://code.visualstudio.com/).
6. Commit changes to your own branch. We recommend you use a git client to do this, you can get the free GitKraken [here](https://www.gitkraken.com/).
7. Push your work back up to your fork. If you're using GitKraken, you just need to click the **Push** button.
8. Submit a **Pull Request** so that we can review your changes.
9. An administrator will then review and approve your changes.

# License

* Content [licensed](LICENSE.md) under Creative Commons: [![License: CC BY-SA 3.0](https://img.shields.io/badge/License-CC%20BY--SA%203.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/3.0/)
* Code [licensed](LICENSE.md) under MIT: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)