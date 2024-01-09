import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
// const CreateProject = lazy(() => import("../pages/CreateProject"));
const CreateEvent = lazy(() => import("../pages/CreateEvent"));
const CreateArticle = lazy(() => import("../pages/CreateArticle"));
// const Projects = lazy(() => import("../pages/Projects"));
const Events = lazy(() => import("../pages/Events"));
const Articles = lazy(() => import("../pages/Articles"));
const AboutPageContents = lazy(() => import("../pages/AboutContent"));
const HomeContents = lazy(() => import("../pages/HomeContent"));
const Users = lazy(() => import("../pages/Users"));

const Modals = lazy(() => import("../pages/Modals"));

const Page404 = lazy(() => import("../pages/404"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },

  {
    path: "/events",
    component: Events,
  },
  {
    path: "/articles",
    component: Articles,
  },

  {
    path: "/create-event",
    component: CreateEvent,
  },
  {
    path: "/edit-event/:id",
    component: CreateEvent,
  },
  {
    path: "/create-article",
    component: CreateArticle,
  },
  {
    path: "/edit-article/:id",
    component: CreateArticle,
  },

  {
    path: "/home-contents",
    component: HomeContents,
  },
  {
    path: "/about-contents",
    component: AboutPageContents,
  },
  {
    path: "/admin-users",
    component: Users,
  },
  {
    path: "/modals",
    component: Modals,
  },

  {
    path: "/404",
    component: Page404,
  },
];

export default routes;
