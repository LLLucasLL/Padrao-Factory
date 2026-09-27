jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

const jwt = require('jsonwebtoken');
const autenticar = require('../backend/middlewares/authMiddleware');

function responseMock() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
}

test('deve rejeitar requisição sem token', () => {
  const req = { headers: {} };
  const res = responseMock();
  const next = jest.fn();

  autenticar(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});

test('deve aceitar token válido', () => {
  jwt.verify.mockReturnValue({ id: 10, nome: 'Lucas' });

  const req = { headers: { authorization: 'Bearer token-valido' } };
  const res = responseMock();
  const next = jest.fn();

  autenticar(req, res, next);

  expect(req.usuarioId).toBe(10);
  expect(next).toHaveBeenCalled();
});
