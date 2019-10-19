export default function(to, from, savedPosition) {
  if (to.hash) {
    return { selector: to.hash };
  }
  if (savedPosition) {
    return savedPosition;
  } else {
    return { x: 0, y: 0 };
  }
}
