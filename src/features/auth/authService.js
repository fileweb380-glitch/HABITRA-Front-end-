
import apiClient from '../../lib/apiClient';

import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  sendEmailVerification,
  reload,
  signOut
} from 'firebase/auth';

import { auth } from '../../lib/firebase';

export const authService = {
  // REGISTER
  register: async (name, email, password, timezone) => {
    const cleanEmail = email.trim().toLowerCase();

    let credential = null;
    let mongoAccountCreated = false;

    try {
      // 1. Create Firebase account
      credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      // 2. Save user's display name in Firebase
      await updateProfile(credential.user, {
        displayName: name
      });

      // 3. Create corresponding MongoDB account
      const res = await apiClient.post('/auth/register', {
        name,
        email: cleanEmail,
        password,
        timezone
      });

      mongoAccountCreated = true;

      // 4. Send verification email directly through Firebase
      let verificationEmailSent = false;
      let verificationError = null;

      try {
        await sendEmailVerification(credential.user, {
          url: `${window.location.origin}/verify-email?email=${encodeURIComponent(cleanEmail)}`,
          handleCodeInApp: false
        });

        verificationEmailSent = true;

        console.log('Firebase verification email sent.');
      } catch (error) {
        verificationError = error;

        console.error(
          'Firebase verification email failed:',
          error.code,
          error.message
        );
      }

      // Keep Firebase user signed in so the verification
      // page can resend the verification email if necessary.

      return {
        ...res.data,
        verificationEmailSent,
        verificationError: verificationError?.message || null
      };

    } catch (error) {
      // Only delete the Firebase account if MongoDB
      // registration itself failed.

      if (
        credential?.user &&
        auth.currentUser &&
        !mongoAccountCreated
      ) {
        try {
          await deleteUser(auth.currentUser);
        } catch (cleanupError) {
          console.error(
            'Firebase account cleanup failed:',
            cleanupError.message
          );
        }
      }

      throw error;
    }
  },

  // LOGIN
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password
    });

    return res.data;
  },

  // GET CURRENT USER
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // VERIFY FIREBASE EMAIL IN BACKEND
  verifyFirebaseEmail: async (email) => {
    const res = await apiClient.post('/auth/verify-email/firebase', {
      email: email.trim().toLowerCase()
    });

    return res.data;
  },

  // RESEND FIREBASE VERIFICATION EMAIL
  resendVerification: async (email) => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error(
        'Your Firebase session has expired. Please register again or sign in after verification.'
      );
    }

    if (currentUser.email?.toLowerCase() !== email.trim().toLowerCase()) {
      throw new Error(
        'The signed-in Firebase account does not match this email address.'
      );
    }

    await reload(currentUser);

    if (currentUser.emailVerified) {
      throw new Error('This email address is already verified.');
    }

    await sendEmailVerification(currentUser, {
      url: `${window.location.origin}/verify-email?email=${encodeURIComponent(email.trim().toLowerCase())}`,
      handleCodeInApp: false
    });

    return {
      success: true,
      message: 'A new verification email has been sent.'
    };
  },

  // FIREBASE LOGOUT
  logoutFirebase: async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          