import { Lucia } from 'lucia';
import { d as db$1, s as sessions, u as users } from './db-cvVcOA05.js';
import { D as DEV } from './prod-ssr-neY5j8Pr.js';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';

const dev = DEV;
const adapter = new DrizzleSQLiteAdapter(db$1, sessions, users);
const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: !dev
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      language: attributes.language,
      theme: attributes.theme
    };
  }
});
async function deleteExpiredSessions() {
  lucia.deleteExpiredSessions();
}

export { deleteExpiredSessions as d, lucia as l };
//# sourceMappingURL=auth-zDdazaLo.js.map
