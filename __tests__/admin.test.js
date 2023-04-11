
require('dotenv').config();

test('GET /api/admin/admin@thetiptop.fr returns object with role=admin', async () => {
  const response = await fetch(`https://dsp-archiwebf22-hm-hm-at.fr/api/admin/admin@thetiptop.fr`);
  const json = await response.json();
  expect(response.status).toBe(201);
  expect(json[0]).toMatchObject({ role: 'admin' });
});

test('GET /api/admin/employe@thetiptop.fr returns object with role=employe', async () => {
  const response = await fetch(`https://dsp-archiwebf22-hm-hm-at.fr/api/admin/employe@thetiptop.fr`);
  const json = await response.json();
  expect(response.status).toBe(201);
  expect(json[0]).toMatchObject({ role: 'employe' });
});
