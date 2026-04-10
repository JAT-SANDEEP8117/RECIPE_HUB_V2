# MongoDB Atlas Setup Guide

To connect **RecipeHub** to your own database, follow these steps:

## 1. Create an Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2. Create a free account and a new project.
3. Deploy a **Free Cluster (M0)**.

## 2. Create a Database User
1. In the Atlas dashboard, go to **Database Access**.
2. Click **Add New Database User**.
3. Choose **Password** authentication.
4. Set a username and a strong password.
5. In **Database User Privileges**, select **Read and write to any database**.

## 3. Configure Network Access
1. Go to **Network Access**.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (0.0.0.0/0) for development purposes, or add your specific IP.
4. Click **Confirm**.

## 4. Get Your Connection String
1. Go to **Database** (under Deployment).
2. Click **Connect** on your cluster.
3. Select **Drivers**.
4. Copy the connection string. It looks like this:
   `mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

## 5. Add the String to RecipeHub
1. Create a file named `.env` in the `server` directory.
2. Add the following line, replacing the placeholders with your actual username and password:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxx.mongodb.net/recipehub?retryWrites=true&w=majority
   JWT_SECRET=your_very_secret_key_here
   ```

## 6. Restart the Server
Once the `.env` file is saved, restart the server to establish the connection.
