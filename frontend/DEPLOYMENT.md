# Deployment & Setup Guide

## Local Development

### Prerequisites
- Node.js 18+ (20+ recommended)
- pnpm (recommended) or npm/yarn

### Quick Start
```bash
# Clone/download the project
cd office-productivity-monitor

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

The app will hot-reload on file changes.

## Environment Variables

Currently, the app runs with all mock data. To prepare for production:

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001/ws
```

## Building for Production

```bash
# Build optimized bundle
pnpm build

# Test production build locally
pnpm start
```

The build output is in `.next/` directory.

## Deployment to Vercel

### Method 1: Git Integration (Recommended)
1. Push code to GitHub/GitLab
2. Visit [vercel.com](https://vercel.com)
3. Import project
4. Vercel auto-detects Next.js
5. Deploy with one click

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
pnpm install -g vercel

# Deploy
vercel deploy

# Production deployment
vercel deploy --prod
```

### Method 3: Docker

```dockerfile
# Use official Node.js runtime
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build Next.js
RUN pnpm build

# Expose port
EXPOSE 3000

# Start production server
CMD ["pnpm", "start"]
```

Build and run:
```bash
docker build -t office-monitor:latest .
docker run -p 3000:3000 office-monitor:latest
```

## Database Setup (Future)

### PostgreSQL with Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Create tables with SQL:

```sql
-- Buildings
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Offices
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  status TEXT NOT NULL,
  total_desks INT NOT NULL,
  occupied INT NOT NULL,
  employees INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Employees
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL,
  office_id UUID REFERENCES offices(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Desks
CREATE TABLE desks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  status TEXT NOT NULL,
  office_id UUID REFERENCES offices(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  office_id UUID REFERENCES offices(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

4. Set environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

5. Create Supabase client in `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## Authentication Setup (Future)

### Auth.js (NextAuth)

1. Install package:
```bash
pnpm add next-auth
```

2. Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Add logic to verify credentials against database
        return { id: '1', email: credentials?.email, name: 'User' };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
```

## Real-time Updates (Future)

### WebSocket Setup with Socket.io

1. Install package:
```bash
pnpm add socket.io-client
```

2. Create socket connection in `lib/socket.ts`:
```typescript
import { io } from 'socket.io-client';

export const socket = io(
  process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
  { reconnection: true }
);
```

3. Use in components:
```typescript
useEffect(() => {
  socket.on('occupancy-update', (data) => {
    // Update state with new occupancy data
  });
}, []);
```

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/images/office.jpg"
  alt="Office"
  width={1200}
  height={800}
  priority
/>
```

### Code Splitting
The app already uses dynamic imports for components:
```typescript
const OfficeList = dynamic(() => import('@/components/office-list'));
```

### API Route Caching
```typescript
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
```

## Monitoring & Logging

### Vercel Analytics
Enable in dashboard - no code changes needed.

### Error Tracking (Sentry)

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Install SDK:
```bash
pnpm add @sentry/nextjs
```

3. Create `sentry.config.js`:
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

## Security Checklist

- [ ] Set up HTTPS (automatic on Vercel)
- [ ] Configure CORS policies
- [ ] Add rate limiting on API routes
- [ ] Implement input validation
- [ ] Use environment variables for secrets
- [ ] Enable CSRF protection
- [ ] Implement authentication
- [ ] Add authorization checks
- [ ] Regular dependency updates
- [ ] Security headers (CSP, X-Frame-Options, etc.)

## Performance Targets

- **Lighthouse Score:** 90+
- **Time to Interactive:** < 2s
- **First Contentful Paint:** < 1s
- **Core Web Vitals:** All green
- **Bundle Size:** < 500KB (gzipped)

## Monitoring URLs

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Analytics:** https://vercel.com/analytics
- **GitHub:** https://github.com/[username]/office-monitor

## Support & Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Vercel Support:** https://vercel.com/help

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -p 3001
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Failures
```bash
# Clean build
pnpm build --verbose

# Check for TypeScript errors
pnpm tsc --noEmit
```

---

**Ready to deploy!** 🚀
