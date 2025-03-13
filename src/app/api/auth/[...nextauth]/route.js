import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { noImage } from "@/constants";
import { storage } from "@/firebase";
import {
  createUser,
  getUserByEmail,
  getUserWithPassword,
} from "../../user/service";
import { UserSchema } from "../../user/model";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    credentials({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const user = await getUserWithPassword(credentials?.email);

        if (user?.ok === false) throw new Error("Wrong Email");

        const passwordMatch = await bcrypt.compare(
          credentials?.password,
          user.password
        );

        if (!passwordMatch) throw new Error("Wrong Password");
        const { password, _id, ...data } = user;
        return { id: _id.toString(), ...data };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.user = dbUser;
        }
      } else if (profile) {
        const dbUser = await getUserByEmail(profile.email);
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.user = dbUser;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      session.user.id = token.id;
      session.user = await getUserByEmail(session.user.email);
      session.user.id = session.user._id.toString();
      return session;
    },
    async signIn({ profile, credentials }) {
      try {
        if (profile) {
          await handleOAuthUser(profile);
        } else if (credentials) {
          await handleOAuthUser(credentials);
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/auth/complete`;
    },
  },
  session: {
    strategy: "jwt",
  },
});

async function handleOAuthUser(profile) {
  const existingUser = await getUserByEmail(profile.email);

  if (existingUser.ok && UserSchema.safeParse(existingUser).success) {
    return existingUser;
  }

  let image;
  if (existingUser.ok === false) {
    const picture = profile.picture || profile.avatar_url;
    image = picture ? await uploadOAuthImage(picture, profile.email) : noImage;
  } else {
    if (existingUser.image === noImage) {
      const picture = profile.picture || profile.avatar_url;
      image = picture
        ? await uploadOAuthImage(picture, profile.email)
        : noImage;
    } else {
      image = existingUser.image;
    }
  }

  const randomPassword = crypto.randomBytes(12).toString("hex");

  const userData = {
    firstName: profile.given_name || profile.name?.split(" ")[0] || "",
    lastName: profile.family_name || profile.name?.split(" ")[1] || "",
    email: profile.email,
    password: randomPassword,
    image: image || noImage,
    organization: "",
    position: "",
    isCompleted: false,
  };

  const response = await createUser(userData);
  const newUser = await response.json();
  return newUser;
}

const uploadOAuthImage = async (imageUrl, userEmail) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileName = `portfolio-users/${new Date().getTime()}_${
      userEmail.split("@")[0]
    }.jpg`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading file:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

export { handler as GET, handler as POST };
