// Mirror the SPA's current path onto <html> so CSS can target specific paths (Twitter /home, Facebook /).
// ponytail: 500ms polling instead of history API patching — boring and survives any router.
const update = () =>
  document.documentElement.setAttribute("data-feed-blocker-path", location.pathname);
update();
setInterval(update, 500);
