<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15XtxVeQzXNk4XrKTNq7MYIaifsf3upws

## Run Locally

**Prerequisites:**  Node.js 18+

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   VITE_TURSO_URL=your-turso-database-url
   VITE_TURSO_AUTH_TOKEN=your-turso-auth-token
   GEMINI_API_KEY=your-gemini-api-key
   ```
   
   See `.env.example` for a template.

3. **Run the app:**
   ```bash
   npm run dev
   ```

## Database Configuration

This app uses **TURSO** (SQLite) as the database. To set up your database:

1. Create a TURSO account at [turso.tech](https://turso.tech/)
2. Create a new database
3. Get your database URL and auth token from the TURSO dashboard
4. Add them to your `.env.local` file

### Database Schema

The app automatically creates the following tables:

- **ItemTemplates**: Stores item definitions (name, brand, model, etc.)
- **InventoryItems**: Stores individual inventory items with references to templates
- **Locations**: Stores location names

### CRUD Operations

All CRUD operations are handled through the `services/crud.ts` module:

- **Item Templates**: Create, read, update, delete item templates
- **Inventory Items**: Create, read, update, delete inventory items
- **Locations**: Create, read, update, delete locations

## Features

- ✅ Full CRUD operations with TURSO database
- ✅ Real-time inventory management
- ✅ Location tracking
- ✅ Item template management
- ✅ Excel export functionality
- ✅ Responsive UI with dark theme
