import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { prisma } from '@propgroup/db';

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Check if account is active
        if (!user.isActive || user.bannedAt) {
          return done(null, false, { message: 'Account is inactive or banned' });
        }

        // Verify password
        if (!user.password) {
          return done(null, false, { message: 'Please sign in with Google' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configure Google Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL}/api/auth/google/callback`,
        scope: ['profile', 'email']
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googleId = profile.id;

        // Try to find user by Google ID
        let user = await prisma.user.findUnique({
          where: { googleId }
        });

        // If not found by Google ID, try by email
        if (!user) {
          user = await prisma.user.findUnique({
            where: { email }
          });

          // If user exists with email but no Google ID, link accounts
          if (user) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                provider: 'google',
                avatar: profile.photos?.[0]?.value,
                emailVerifiedAt: user.emailVerifiedAt || new Date(),
                lastLoginAt: new Date()
              }
            });
          }
        }

        // If still not found, create new user
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              provider: 'google',
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              avatar: profile.photos?.[0]?.value,
              emailVerifiedAt: new Date(),
              isActive: true,
              lastLoginAt: new Date()
            }
          });
        }

        // Check if account is active
        if (!user.isActive || user.bannedAt) {
          return done(null, false, { message: 'Account is inactive or banned' });
        }

        // Update last login if not already updated
        if (!user.lastLoginAt || new Date() - new Date(user.lastLoginAt) > 60000) {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
  );
} else {
  console.log('⚠️  Google OAuth not configured - skipping Google Strategy');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        bannedAt: true,
        emailVerifiedAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        investmentGoals: true,
        provider: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return done(new Error('User not found'));
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
