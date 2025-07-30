This is a tool that includes utility functions for editing NexHealth forms. You can use it here: [https://etonio99.github.io/Form-Edits/](https://etonio99.github.io/Form-Edits/).

## Usage

This tool is able to edit one page/panel of a form at a time. To start, open a form in NexHealth and click the wrench icon in the top-right corner of the page you want to edit. Then, copy the entire JSON data for that page. In this Form Editor tool, paste the JSON data into the textarea in the top-right corner.

From there, the form will automatically load and display on the left side of the page. Once the form is displayed, you can click on the gear icon in the top-right corner of any component to run utility functions.

## Run Locally

This project is built using NextJS. To start up a local development server:
1. run `npm install` to install dependencies
2. run `npm run dev` to start a server on localhost:3000.

## Creating New Context Menu Options

All of the context menu options are found in `/src/lib/context-menu-options.tsx`. To create a new option, add a key to the `contextMenuOptions` array with the name of the option. The available options for customizing the option are icon?:
* `action` - Function that runs when this option is clicked
* `actionUpdatesFormData` - If the data the above function returns should replace the form data
* `subOptions` - An array of string:function pairs that will appear as sub-options when the main option is hovered
* `applyTo` - Used to display the option on specific component types
* `metaType` - Used to display the option on specific meta component types
* `universal` - Moves the option to the bottom section of the context menu
* `style` - String of TailwindCSS classes that will be applied to this option in the context menu
* `modal` - Object containing data to display a modal when this option is selected
