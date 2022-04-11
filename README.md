# AT-AT (Attack Tree Analysis Tool)

AT-AT (Attack Tree Analysis Tool) is a application that allows users to develop and analyze attack trees. The overall goal is to automatically generate a set of possible attack scenarios that can be used to provide guidance for how to improve the design of the system to which the attack tree belongs to.

## Features

- Simplified DSL syntax to specify attack trees and a JSON format for parsed attack trees
- Parser to convert inputted attack trees into JSON (with syntax checker)
- Generates (i.e., visualizes) inputted attack trees
- Determines all attack scenarios on the inputted attack tree
- Lists all the possible attack scenarios and their severity for the inputted attack tree
- Provides recommendations to mitigate attacks in an attack scenario based on the metrics and keywords found in the scenario path
- Highlights a user-selected attack scenario on the tree
- Allows multiple trees to be modeled and analyzed at the same time by switching between tabs in the application
- Generates an HTML report of the attack tree analysis which includes all attack scenarios and recommendations

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run make`

Complies the app as an executable for distribution to the `out` folder. It correctly bundles React in production mode and optimizes the app for the best performance.The app is minified and the filenames include the hashes.

