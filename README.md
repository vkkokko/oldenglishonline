# Old English Online
![](https://img.shields.io/github/package-json/v/vkkokko/oldenglishonline)
![](https://img.shields.io/github/commit-activity/w/vkkokko/oldenglishonline)

# About
This is the file repository for Old English Online, an online learning platform for Old English. Uncompiled files are located in the *src* folder, while compiled files are located in the *docs* folder. Visit [oldenglish.info](https://oldenglish.info) to use the website.

#### Table Of Contents
[User Guide](#User-Guide)
* [How do I use this resource offline?](#How-do-I-use-this-resource-offline)

[Contributor's Guide](#Contributor's-Guide)
* [How do I submit a good bug report?](#How-do-I-submit-a-good-bug-report)
* [How do I submit a good feature request?](#How-do-I-submit-a-good-feature-request)

[Developer's Guide](#Developers-Guide)
* [How to install Old English Online locally](#installing-and-running)

# User Guide
### How do I use this resource offline?
If you want to use Old English Online while not connected to the internet, you need to download the files. 
1. Navigate to the project repository on Github. It's [here](https://github.com/vkkokko/oldenglishonline).
2. Click the green **Code** button and select **Download a Zip**.
3. Once the file is downloaded, unzip it and open the **Docs** folder.
4. To view the homepage, open *index.html*.

# Contributor's Guide
If you want to report a bug or suggest an enhancement, perform the following steps:
1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Navigate to the project repository on Github. It's [here](https://github.com/vkkokko/oldenglishonline).
3. Under the repository name, click **Issues**.
4. Click **New issue**.
5. Enter a title and description for your issue.
6. When you are finished, click **Submit** new issue

### How do I submit a good bug report?
* **Use a clear and descriptive title** to identify what the issue is about.
* **Include all relevant information**. Mention the exact page you encountered the issue on, whether you were using a desktop or mobile, what browser you were accessing the site on, and how you triggered the issue. For example, "Using Google Chrome on my laptop, I clicked the 'Check' button under the quiz on Weak Verbs II and nothing happened".
* **Include screenshots**. This is especially important if you are reporting a graphical glitch or typo.

### How do I submit a good feature request?
* **State what you want the feature to do**. For example, 'I would like it if you could review all the flashcards you've filled out in a session so you can see which ones you got right and which you got wrong'.
* **State where you would like the feature to go**. For example, 'I'd like there to be a button I could click on the flashcard modal which would bring up this information'.
* **State who you think the feature would benefit**. For example, is it aimed at first time learners or postgraduate scholars?

# Developer's Guide
## Installing and Running
If you want to run Old English Online locally on your machine so you can use it offline or develop a new feature, you need to install it. 

1. Create a Github account [here](https://github.com/) or just login if you already have one.
2. Download a git client, you can get the free GitKraken [here](https://www.gitkraken.com/).
3. Navigate to the project repository on Github. It's [here](https://github.com/vkkokko/oldenglishonline).
4. Click the **Clone or download** button and copy the URL.
5. In GitKraken, choose **Clone Repo**, choose **From URL** and paste the URL you copied from Github. This copies the repository to your machine. Take a note of where you save it as you will need to know the path to the project in step 9.
6. Download an development environment. We recommend Visual Studio Code which you can download [here](https://code.visualstudio.com/).
7. Install the most recent version of Node.js. You can download it [here](https://nodejs.org/en/download/).
8. Open the terminal in Visual Studio Code. To do this click **View** then **Terminal**. 
1. The folder you are in should be on the last line in the terminal. Check this path to make sure you're in the root folder of the project. If you are not, you can change which directory you're in by typing `cd C:\whatever_your_filepath_is`. My root folder is C:\Users\Victoria\Desktop\OldEnglishOnline so I would type `cd C:\Users\Victoria\Desktop\OldEnglishOnline`.
9. Once you are in the root folder, type `npm install` and press **Enter**. Everything you need is installed automatically. This may take 2-3 minutes.
5. When it is finished, type `npm run start`. This builds the project, starts the watch tasks that wait for file changes, and opens the project in your default browser. **Note:** Sometimes your browser is a little too fast to load the page and will instead load a white page with a GET request. Just refresh the page and the correct content will load.
6. If the page does not load, navigate to *localhost:3000* in your browser. 
7. Once the above steps are complete, you can make edits to the templates, scripts and styles in the `/src/` folder, and the project will automatically refresh in the browser to show your changes once they are saved.
1. Once you have made all your changes, save the file.
1. Commit your changes in GitKraken by selecting **Stage all changes**.
1. Push your work back up to your fork. If you're using GitKraken, you just need to click the **Push** button.
1. Submit a Pull Request so that we can review your changes.
1. An Administrator will then review and approve your changes.

# License

* Content [licensed](LICENSE.md) under Creative Commons: [![License: CC BY-SA 3.0](https://img.shields.io/badge/License-CC%20BY--SA%203.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/3.0/)
* Code [licensed](LICENSE.md) under MIT: [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
