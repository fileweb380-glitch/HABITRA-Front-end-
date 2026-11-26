
import apiClient from '../../lib/apiClient';
import {
  createUserWithEmailAndPassword,
    updateProfile,
      deleteUser,
        signOut
        } from 'firebase/auth';

        import { auth } from '../../lib/firebase';

        export const authService = {
          register: async (name, email, password, timezone) => {
              const cleanEmail = email.trim().toLowerCase();

                  let credential = null;

                      try {
                            // Create the Firebase account.
                                  credential = await createUserWithEmailAndPassword(
                                          auth,
                                                  cleanEmail,
                                                          password
                                                                );

                                                                      await updateProfile(credential.user, {
                                                                              displayName: name
                                                                                    });

                                                                                          // Create the MongoDB account and send verification email.
                                                                                                const res = await apiClient.post('/auth/register', {
                                                                                                        name,
                                                                                                                email: cleanEmail,
                                                                                                                        password,
                                                                                                                                timezone
                                                                                                                                      });

                                                                                                                                            // Registration does not create a HABITRA session.
                                                                                                                                                  await signOut(auth);

                                                                                                                                                        return res.data;
                                                                                                                                                            } catch (error) {
                                                                                                                                                                  // Roll back Firebase account if MongoDB registration failed.
                                                                                                                                                                        if (credential?.user && auth.currentUser) {
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

                                                                                                                                                                                                                                                                          login: async (email, password) => {
                                                                                                                                                                                                                                                                              const res = await apiClient.post('/auth/login', {
                                                                                                                                                                                                                                                                                    email,
                                                                                                                                                                                                                                                                                          password
                                                                                                                                                                                                                                                                                              });

                                                                                                                                                                                                                                                                                                  return res.data;
                                                                                                                                                                                                                                                                                                    },

                                                                                                                                                                                                                                                                                                      getMe: async () => {
                                                                                                                                                                                                                                                                                                          const res = await apiClient.get('/auth/me');
                                                                                                                                                                                                                                                                                                              return res.data;
                                                                                                                                                                                                                                                                                                                },

                                                                                                                                                                                                                                                                                                                  verifyFirebaseEmail: async (email) => {
                                                                                                                                                                                                                                                                                                                      const res = await apiClient.post('/auth/verify-email/firebase', {
                                                                                                                                                                                                                                                                                                                            email
                                                                                                                                                                                                                                                                                                                                });

                                                                                                                                                                                                                                                                                                                                    return res.data;
                                                                                                                                                                                                                                                                                                                                      },

                                                                                                                                                                                                                                                                                                                                        resendVerification: async (email) => {
                                                                                                                                                                                                                                                                                                                                            const res = await apiClient.post('/auth/resend-verification', {
                                                                                                                                                                                                                                                                                                                                                  email
                                                                                                                                                                                                                                                                                                                                                      });

                                                                                                                                                                                                                                                                                                                                                          return res.data;
                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                            };
                                                                                                                                                                                                                                                                                                                                                            