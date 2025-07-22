import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "Melike", displayname: "Gulozer" },
  { id: 2, username: "Sezin", displayname: "Bagci" },
  { id: 3, username: "Berke", displayname: "Arslan" },
  { id: 4, username: "Oktay", displayname: "Oktay" },
];

const mockCompanies = [
  { id: 401, companyname: "Aselsan" },
  { id: 402, companyname: "Havelsan" },
  { id: 403, companyname: "Roketsan" },
  { id: 404, companyname: "FORD" },
  { id: 405, companyname: "SİGUN" },
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello!" });
});

app.get("/api/users", (req, res) => {
  const { filter, value } = req.query;
  if (filter && value) {
    return res.send(mockUsers.filter((user) => user[filter] === value));
  }
  res.send(mockUsers);
});

app.get("/api/companies", (req, res) => {
  res.send(mockCompanies);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad Request. Invalid ID." });

  const user = mockUsers.find((u) => u.id === parsedId);
  if (!user) return res.sendStatus(404);
  return res.send(user);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
});

app.put("/api/users/:id", (req, res) => {
  const { body } = req;
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const index = mockUsers.findIndex((u) => u.id === parsedId);
  if (index === -1) return res.sendStatus(404);

  mockUsers[index] = { id: parsedId, ...body };
  return res.sendStatus(200);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
  });
}

export default app;