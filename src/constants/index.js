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
export const defaultAnimationName = "idle";
export const noImage = "/assets/no-image.webp";
export const noImage2 = "/assets/no-image2.jpg";

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.07 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall
      ? [6, -5, 0]
      : isMobile
      ? [6, -5, 0]
      : isTablet
      ? [8, -5, 0]
      : [9, -5.5, 0],
    reactLogoPosition: isSmall
      ? [3, 4, 0]
      : isMobile
      ? [5, 4, 0]
      : isTablet
      ? [5, 4, 0]
      : [12, 3, 0],
    ringPosition: isSmall
      ? [-7, 7, 0]
      : isMobile
      ? [-12, 9, 0]
      : isTablet
      ? [-16, 8, 0]
      : [-23, 8, 0],
    targetPosition: isSmall
      ? [-5, -10, -10]
      : isMobile
      ? [-9, -10, -10]
      : isTablet
      ? [-11, -7, -10]
      : [-13, -13, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: "MetaArt",
    pos: "Fullstack Web Developer",
    duration: "2024",
    title:
      "MetaArt is my first company where I was working as an Intern Fullstack Developer. During my internship, I gained hands-on experience with modern web technologies, worked on real-world project, and improved my problem-solving skills. This role allowed me to collaborate with a team, learn best development practices, and enhance my understanding of both frontend and backend development.",
    icon: "/assets/metaart.png",
    animation: "salute",
  },
];

export const projects = [
  {
    id: "portfolio",
    title: "Portfolio",
    url: "",
    image: "",
    description:
      "A modern web portfolio showcasing interactive 3D experiences, dynamic project displays, and seamless performance.",
    duration: "Feb 2025 - Mar 2025",
    clickable: false,
    tags: [
      {
        id: 1,
        img: "/assets/nextjs.png",
        text: "Next.js",
        color: "#000000",
        isDark: true,
      },
      {
        id: 2,
        img: "/assets/mongo.png",
        text: "MongoDB",
        color: "#013220",
        isDark: true,
      },
      {
        id: 3,
        img: "/assets/threejs.png",
        text: "Three.js",
        color: "#3f3f46",
        isDark: true,
      },
      {
        id: 4,
        img: "/assets/tailwind.png",
        text: "Tailwind CSS",
        color: "#0EA5E9",
        isDark: true,
      },
    ],
  },
  {
    id: "sportcrm",
    title: "Sport CRM System",
    url: "",
    image: "",
    description:
      "Sport CRM System is a system that automates the process of keeping records of sports clubs, coaches and club members.",
    duration: "May 2024 - Dec 2024",
    clickable: false,
    tags: [
      {
        id: 1,
        img: "/assets/nestjs.webp",
        text: "NestJS",
        color: "#E0234E",
        isDark: true,
      },
      {
        id: 2,
        img: "/assets/mysql.png",
        text: "MySQL",
        color: "#005F86",
        isDark: true,
      },
      {
        id: 3,
        img: "/assets/react.svg",
        text: "React",
        color: "#3178C6",
        isDark: true,
      },
      {
        id: 4,
        img: "/assets/mui.svg",
        text: "MaterialUI",
        color: "#0081CB",
        isDark: true,
      },
    ],
  },
  {
    id: "myestate",
    title: "MyEstate",
    url: "https://mern-estate-gvzy.onrender.com",
    image: "/assets/my-estate-project.jpeg",
    description:
      "MyEstate - MERN Stack Pet-Project about real estate marketing, that helps customers buy, rent, sell or lease out real estate.",
    duration: "May 2024",
    clickable: true,
    tags: [
      {
        id: 1,
        img: "/assets/node-js.png",
        text: "Node.js",
        color: "#333333",
        isDark: true,
      },
      {
        id: 2,
        img: "/assets/express.png",
        text: "Express.js",
        color: "#24292E",
        isDark: true,
      },
      {
        id: 3,
        img: "/assets/mongo.png",
        text: "MongoDB",
        color: "#013220",
        isDark: true,
      },
      {
        id: 4,
        img: "/assets/react.svg",
        text: "React",
        color: "#3178C6",
        isDark: true,
      },
      {
        id: 5,
        img: "/assets/tailwind.png",
        text: "Tailwind CSS",
        color: "#0EA5E9",
        isDark: true,
      },
      {
        id: 6,
        img: "/assets/vite.svg",
        text: "Vite",
        color: "#646CFF",
        isDark: true,
      },
    ],
  },
  {
    id: "spotify",
    title: "Spotify Clone",
    url: "https://oleksandr-spotify-clone.netlify.app",
    image: "/assets/spotify-project.png",
    description:
      "Spotify Clone is a static clone-page project was made using Vanilla HTML/CSS/JavaScript stack.",
    duration: "Feb 2024",
    clickable: true,
    tags: [
      {
        id: 1,
        img: "/assets/html.png",
        text: "HTML",
        color: "#E34C26",
        isDark: true,
      },
      {
        id: 2,
        img: "/assets/css.png",
        text: "CSS",
        color: "#264DE4",
        isDark: false,
      },
      {
        id: 3,
        img: "/assets/javascript.png",
        text: "JavaScript",
        color: "#F7DF1E",
        isDark: false,
      },
    ],
  },
  {
    id: "eclipse",
    title: "EclipseSound",
    url: "https://youtu.be/QIiTY5qZK7Y",
    image: "/assets/eclipse-project.svg",
    description:
      "EclipseSound - Spotify Clone that serves as IT STEP Academy graduate work for team of 5 members: 4 developers and 1 designer.",
    duration: "Dec 2023 - Mar 2024",
    video: "https://www.youtube.com/embed/QIiTY5qZK7Y",
    clickable: true,
    tags: [
      {
        id: 1,
        img: "/assets/aspnet.ico",
        text: "ASP.NET",
        color: "#512BD4",
        isDark: true,
      },
      {
        id: 2,
        img: "/assets/postgres.png",
        text: "PostgreSQL",
        color: "#336791",
        isDark: true,
      },
      {
        id: 3,
        img: "/assets/react.svg",
        text: "React",
        color: "#3178C6",
        isDark: true,
      },
      {
        id: 4,
        img: "/assets/vite.svg",
        text: "Vite",
        color: "#646CFF",
        isDark: true,
      },
    ],
  },
];

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
