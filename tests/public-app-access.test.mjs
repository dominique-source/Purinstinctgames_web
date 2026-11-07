import test from 'node:test';
import assert from 'node:assert/strict';
import middleware from '../middleware.js';

test('public APP portal and static resources work without an email session', async () => {
  for (const path of ['/app', '/app/', '/app/competitions/ecole', '/app/competitions/interscolaire/', '/app/competitions/pour-tous', '/app/activites/horizon', '/app/assets/index.js', '/app/images/competitions/ecole-verticale.png', '/app/?lang=en']) {
    for (const cookie of ['', 'pig_session=expired-or-invalid']) {
      const response = await middleware(new Request(`https://purinstinctgames.com${path}`, { headers: { cookie } }));
      assert.equal(response.headers.get('x-middleware-next'), '1', path);
      assert.equal(response.headers.get('location'), null, path);
    }
  }
});

test('organizer, projection and other private routes retain the email gate', async () => {
  for (const path of ['/app/ecole/demo-horizon/gerer', '/app/ecole/demo-horizon/gerer/participants', '/app/ecole/demo-horizon/projection', '/app/admin', '/application', '/app-private', '/concept.html', '/pur-id.html', '/app/../concept.html']) {
    const response = await middleware(new Request(`https://purinstinctgames.com${path}`));
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get('location'), 'https://purinstinctgames.com/access.html', path);
  }
  const home = await middleware(new Request('https://purinstinctgames.com/'));
  assert.equal(home.headers.get('x-middleware-next'), '1');
});
