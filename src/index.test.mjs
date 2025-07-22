import request from 'supertest';
import app from './index.mjs';

describe('API testleri', () => {
  test('GET / => Hello mesajı dönmeli', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(201);
    expect(res.body.msg).toBe('Hello!');
  });

  test('GET /api/users => tüm kullanıcıları döner', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users?filter=username&value=Melike => Melike’yi döner', async () => {
    const res = await request(app).get('/api/users?filter=username&value=Melike');
    expect(res.status).toBe(200);
    expect(res.body[0].username).toBe('Melike');
  });

  test('POST /api/users => yeni kullanıcı ekler', async () => {
    const newUser = { username: 'Ali', displayname: 'Ali Baba' };
    const res = await request(app).post('/api/users').send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('Ali');
  });

  test('GET /api/companies => şirketleri döner', async () => {
    const res = await request(app).get('/api/companies');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
  });

  test('GET /api/products => ürünleri döner', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('chicken breast');
  });

  test('GET /api/users/:id => geçerli id ile kullanıcı döner', async () => {
    const res = await request(app).get('/api/users/1');
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('Melike');
  });

  test('GET /api/users/:id => geçersiz id ile 400 döner', async () => {
    const res = await request(app).get('/api/users/abc');
    expect(res.status).toBe(400);
  });

  test('GET /api/users/:id => olmayan kullanıcı için 404 döner', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.status).toBe(404);
  });
});
