# Authentication Setup Instructions

## Overview
The app now uses session-based authentication with a User model. Users can log in and change their own passwords.

## Initial Deployment Steps

### 1. Merge and Deploy
```powershell
git checkout main
git merge authentication
git push origin main
git push heroku main
```

### 2. Set Initial User Credentials on Heroku
Before the first deployment, set environment variables for the initial user:

```powershell
heroku config:set INITIAL_USERNAME=your_username --app afternoon-beach-22681
heroku config:set INITIAL_PASSWORD=your_temp_password --app afternoon-beach-22681
```

### 3. Database Migration
The Procfile will automatically:
- Run migrations to create the `users` table
- Run seeds to create the initial user

### 4. First Login
1. Go to https://afternoon-beach-22681-76d63abd9906.herokuapp.com/login
2. Log in with the credentials you set above
3. **IMMEDIATELY** click the user icon (top right) → "Change Password"
4. Change to a secure password

### 5. Cleanup (Optional)
After changing the password, you can remove the environment variables:
```powershell
heroku config:unset INITIAL_USERNAME --app afternoon-beach-22681
heroku config:unset INITIAL_PASSWORD --app afternoon-beach-22681
```

## How It Works

### For Users:
- **Login**: `/login` - Enter username and password
- **Change Password**: Click user icon → "Change Password"
- **Logout**: Click user icon → "Logout"

### Technical Details:
- **Authentication**: Session-based (cookies)
- **Password Storage**: Bcrypt hashing via `has_secure_password`
- **Password Requirements**: Minimum 8 characters
- **API Protection**: All `/api/*` routes except `/api/sessions` require authentication
- **Development Mode**: Auth is skipped in development for easier testing

### Routes:
- `POST /api/sessions` - Login
- `DELETE /api/sessions` - Logout
- `GET /api/sessions/current` - Get current user
- `PATCH /api/users/:id/password` - Change password

## Adding More Users (Future)

To add more users, use Rails console on Heroku:
```powershell
heroku run rails console --app afternoon-beach-22681
```

Then in the console:
```ruby
User.create!(username: 'newuser', password: 'temporary123')
```

The new user can then log in and change their password.

## Security Notes

- Passwords are hashed with bcrypt (never stored in plain text)
- Sessions use Rails encrypted cookies
- HTTPS is enforced on Heroku (secure cookies)
- Password changes require current password verification
- Minimum password length: 8 characters
- Users can only change their own passwords
