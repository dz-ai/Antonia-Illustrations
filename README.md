[Website Link](https://mysite.antoniaillustrations.online/)  
# Antonia Illustrations Project

## Description
The site can be visited in two modes:
1. **Visitor:** The content is available to view, but the user cannot edit it.
2. **Admin:** The user can edit the content as desired.

To enter the site as an Admin, use the registration link [Registration Page](https://mysite.antoniaillustrations.online/register)
- **Email:** antoniatest@gmail.com (Note: This is not a real email)
- **Password:** luzi1978AIL

Feel free to explore and interact with the site.

## Core Features
The core feature of the application is to upload images with associated categories and descriptions.
- User can delete images or replace them with new ones.
- User can add and remove categories as they wish.

The image upload system uses the ImageKit.io service, providing fast image loading times.

Additionally, there is an "About Me" page where users can edit both a photo and text.

**Note:** The site is designed for a single user.

## Frontend
The frontend is built with React and TypeScript, utilizing MobX for state management due to its convenient observability principles.

## Backend
The backend is a Node.js server with the Express library, connected to a MongoDB database using Mongoose.  
The server also serves static files to the browser.  
The application is deployed on Render.com.  
Images are uploaded to ImageKit.io, while image categories and descriptions are saved on the Node.js server in a JSON file and backed up in the database.  
An ID reference is saved to facilitate correlation between the server and the ImageKit.io service.  

## Deployment  
This application has been deployed on an AWS EC2 instance.
