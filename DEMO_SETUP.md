# Demo Setup Instructions

## Authentication System

The application now has authentication implemented. Here's how to test it:

### Demo User Access

1. **Create Demo User**: Go to `/auth` and click "Sign In as Demo User" 
   - This will attempt to sign in with: `demo@example.com` / `demo123`
   - If the demo user doesn't exist, create it first by signing up with these credentials

2. **Manual Demo User Creation**:
   - Go to `/auth` and click "Sign Up"
   - Use email: `demo@example.com`
   - Use password: `demo123`
   - Display name: `Demo User`

3. **Demo User Features**:
   - Has access to ALL brands (Ofev, Jardiance, Pradaxa)
   - Shows "Demo User" in the header
   - Can switch between all brands freely

### Regular Users

Regular users need to be granted access to specific brands through the `user_brand_access` table.

### Current Status

✅ Authentication system implemented
✅ User profiles and brand access control
✅ Demo user system with full brand access
✅ Protected routes
✅ Auto-confirm emails enabled for testing

### Next Steps

1. Create the demo user account (see instructions above)
2. Test authentication flow
3. Fix remaining brand data issues (colors, guidelines)
4. Update brand-specific RLS policies

### Known Issues

- Brand colors may need HSL format fixes
- Some brand guidelines are incomplete
- Hard-coded "Ofev" references need to be dynamic