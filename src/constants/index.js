export const navLinks = [
  {
    id: 1,
    name: "Projects",
    href: "/#projects",
  },
  {
    id: 2,
    name: "About",
    href: "/#about",
  },
  {
    id: 3,
    name: "Work",
    href: "/#work",
  },
  {
    id: 4,
    name: "Contact",
    href: "/#contact",
  },
];

export const developer = "Oleksandr";
export const emailCopy = "oleksandr.shrol.2005@gmail.com";
export const noImage = "/assets/no-image.webp";
export const noImage2 = "/assets/no-image2.jpg";
export const resume = process.env.NEXT_PUBLIC_RESUME;

export const animations = {
  idle: "idle",
  salute: "salute",
  clapping: "clapping",
  victory: "victory",
};
export const defaultAnimationName = "idle";

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.07 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall
      ? [3.5, -7, 0]
      : isMobile
      ? [6, -7, 0]
      : isTablet
      ? [8, -5.5, 0]
      : [9, -5.5, 0],
    reactLogoPosition: isSmall
      ? [3, 4, 0]
      : isMobile
      ? [7, 4, 0]
      : isTablet
      ? [8, 3, 0]
      : [9.5, 5, 0],
    ringPosition: isSmall
      ? [-7, 7, 0]
      : isMobile
      ? [-13, 7, 0]
      : isTablet
      ? [-18, 7, 0]
      : [-20, 8, 0],
    targetPosition: isSmall
      ? [-4.5, -10, -10]
      : isMobile
      ? [-8, -10, -10]
      : isTablet
      ? [-12, -9, -10]
      : [-14, -9, -10],
    arrowLeftPosition: isSmall
      ? [-0.15, -4.3, 0]
      : isMobile
      ? [-0.35, -4, 0]
      : isTablet
      ? [-0.65, -7, 0]
      : [-0.65, -7, 0],
    arrowRightPosition: isSmall
      ? [4, 2, 0]
      : isMobile
      ? [4.5, 4, 0]
      : isTablet
      ? [6, 3.5, 0]
      : [6, 3.5, 0],
  };
};

export const errors = {
  badRequest: [{ error: "Bad request" }, { status: 400 }],
  modelExists: [{ error: "Model already exists" }, { status: 400 }],
  unauthorized: [{ error: "Unauthorized" }, { status: 401 }],
  notFound: [{ error: "Not Found" }, { status: 404 }],
  internalServerError: [{ error: "Internal Server Error" }, { status: 500 }],
};

export const successes = {
  success: { status: 200 },
  created: { status: 201 },
};

export const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
  email: process.env.NEXT_PUBLIC_EMAILJS_EMAIL,
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
