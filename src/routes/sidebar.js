/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  {
    path: "/app/dashboard", // the url
    icon: "HomeIcon", // the component being exported from icons/index.js
    name: "Dashboard", // name that appear in Sidebar
  },

  {
    path: "/app/home-contents",
    icon: "CardsIcon",
    name: "Home Content",
  },
  {
    path: "/app/about-contents",
    icon: "CardsIcon",
    name: "About Content",
  },
  {
    path: "/app/create-event",
    icon: "AddIcon",
    name: "Create Event",
  },
  {
    path: "/app/events",
    icon: "FormsIcon",
    name: "Events",
  },
  {
    path: "/app/create-article",
    icon: "AddIcon",
    name: "Create Article",
  },
  {
    path: "/app/articles",
    icon: "FormsIcon",
    name: "Articles",
  },

  {
    path: "/app/admin-users",
    icon: "PeopleIcon",
    name: "Users",
  },
];

export default routes;
