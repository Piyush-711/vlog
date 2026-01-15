# Vlog Platform

## Environment Setup

This project requires a connection to Supabase.

### Local Development
Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment (e.g., Vercel, Netlify)
You must verify that these environment variables are set in your deployment project settings. The application will not work without them.

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build for production
