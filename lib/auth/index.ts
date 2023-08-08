import { firestore } from '@/firebase/clientApp'
import { comparePass, getUserIdAndRole } from '@/utils'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { redirect } from 'next/navigation'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'fruit-mart',
      name: 'fruit-mart',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },

      // authorize is to verify the authenticity of the user trying to login
      async authorize(credentials: any) {
        if (!credentials || !credentials.email || !credentials.password)
          return null

        const password = credentials.password
        const email = credentials.email

        // get user from firestore where email=email
        const coll = collection(firestore, 'users')
        const q = query(coll, where('email', '==', email))
        const querySnapshot: any = await getDocs(q).then(async (doc) => {
          if (doc.empty) {
            return null
          } else {
            // check if password is correct
            const user = doc.docs[0].data()
            console.log('doc.docs[0].data(): ', doc.docs[0].data())
            console.log('doc.docs[0].id: ', doc.docs[0].id)
            const isPasswordCorrect = await comparePass(password, user.password)
            if (isPasswordCorrect) {
              return {
                id: doc.docs[0].id,
                name: user.username,
                email: user.email,
                role: user.role,
              }
            } else {
              return null
            }
          }
        })
        console.log('querySnapshot:', querySnapshot)
        return querySnapshot
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,

      // check if user exists in firestore
      // async profile(profile: any, tokens: any) {

      //   const coll = collection(firestore, "users");
      //   const q = query(coll, where("email", "==", profile.email));
      //   const querySnapshot: any = await getDocs(q).then(
      //     async (querySnapshot) => {
      //       if (querySnapshot.empty) {
      //         return null;
      //       } else {
      //         // check if password is correct
      //         const user = querySnapshot.docs[0].data();
      //         return user;
      //       }
      //     }
      //   );

      //   if (!querySnapshot) {
      //     // create user
      //     const newUser = {
      //       email: profile.email,
      //       name: profile.name,
      //       password: await hashPass(profile.email),
      //     };
      //     await addDoc(coll, newUser);
      //     return newUser;
      //   }

      //   return {
      //     id: querySnapshot.id,
      //     email: profile.email,
      //     name: profile.name,
      //     image: profile.picture,
      //   };
      // },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      console.log('session: ', session)
      console.log('token: ', token)
      const user = await getUserIdAndRole(session?.user?.email as string)
      console.log('getUserIdAndRole user: ', user)
      return {
        ...session,
        user: {
          id: user.id,
          name: user.username,
          role: user.role,
          email: user.email,
        },
      }
    },
    jwt: ({ token, user }) => {
      console.log('user: ', user)
      console.log('token: ', token)
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        }
      }
      return token
    },
  },
}

export const checkSessionServer = async () => {
  const session = await getServerSession()
  if (!session) return redirect('/login')
}

export const checkNotSessionServer = async () => {
  const session = await getServerSession()
  if (session) return redirect('/')
}

export const checkUserIsAdmin = async () => {
  const session = await getServerSession()
  if (!session || session.user.role !== 'admin') {
    console.log('You are not authorized to view this page')
    console.log('session: ', session)
    return redirect('/login')
  }
}
