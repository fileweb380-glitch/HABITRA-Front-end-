
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

  
resendVerification: async (email) => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error(
        "No active Firebase session. Please sign in to your Firebase account first."
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (currentUser.email?.toLowerCase() !== cleanEmail) {
      throw new Error(
        "The signed-in Firebase account does not match this email address."
      );
    }

    await reload(currentUser);

    if (auth.currentUser.emailVerified) {
      throw new Error("This email address is already verified.");
    }

    await sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/verify-email?email=${encodeURIComponent(cleanEmail)}`,
      handleCodeInApp: false
    });

    console.log("Verification email successfully requested.");

    return {
      success: true,
      message: "Verification email sent successfully."
    };

  } catch (error) {
    console.error("VERIFICATION EMAIL ERROR:", {
      code: error.code,
      message: error.message
    });

    throw error;
  }
},


  // FIREBASE LOGOUT
  logoutFirebase: async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
  }
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
