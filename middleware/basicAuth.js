const Buffer = require('buffer').Buffer;

module.exports = function basicAuthFactory(config) {
  return function basicAuthMiddleware(req, res, next) {
    const authCfg = (config && config.auth) || { enabled: false };
    if (!authCfg.enabled) return next();

    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string') {
      res.set('WWW-Authenticate', 'Basic realm="GrandQuiz"');
      return res.status(401).send('Authentication required');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Basic') {
      res.set('WWW-Authenticate', 'Basic realm="GrandQuiz"');
      return res.status(401).send('Invalid authentication header');
    }

    let creds;
    try {
      creds = Buffer.from(parts[1], 'base64').toString('utf8');
    } catch (err) {
      res.set('WWW-Authenticate', 'Basic realm="GrandQuiz"');
      return res.status(401).send('Invalid authentication encoding');
    }

    const idx = creds.indexOf(':');
    if (idx < 0) {
      res.set('WWW-Authenticate', 'Basic realm="GrandQuiz"');
      return res.status(401).send('Invalid authentication format');
    }

    const user = creds.slice(0, idx);
    const pass = creds.slice(idx + 1);

    const users = Array.isArray(authCfg.users) ? authCfg.users : [];
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      if (u && u.user === user && u.password === pass) return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="GrandQuiz"');
    return res.status(401).send('Invalid credentials');
  };
};
