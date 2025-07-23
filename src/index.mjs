import express, {request , response} from 'express';


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "Melike", displayname: "Gulozer" },
  { id: 2, username: "Sezin", displayname: "Bagci" },
  { id: 3, username: "Berke", displayname: "Arslan" },
  { id: 4, username: "Oktay", displayname: "Oktay" },
];

const mockCompany = [
  { id: 401, companyname: "SİGUN" },
];

const mockDevices = [
  { id: 1, brand: "Asus", model: "Zenbook", serialNumber: "123", customerId: 1 },
];

const mockIssues = [
  {
    id: 1,
    deviceId: 1,
    description: "şarj sorunu",
    status: "open",
    technicianId: 1,
    comments: [],
    history: [{ status: "open", date: new Date() }],
  },
];

const mockTechnicians = [
  { id: 1, name: "Ayşe", expertise: "Bilgisayar" },
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

app.get("/api/company", (req, res) => {
  res.send(mockCompany);
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

// Cihazlar için
app.get("/api/devices", (req, res) => {
  res.send(mockDevices);
});

app.post("/api/devices", (req, res) => {
  const newDevice = {
    id: mockDevices.length + 1,
    ...req.body,
  };
  mockDevices.push(newDevice);
  res.status(201).send(newDevice);
});

app.put("/api/devices/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockDevices.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).send({ msg: "Device not found" });
  mockDevices[index] = { id, ...req.body };
  res.send(mockDevices[index]);
});

app.delete("/api/devices/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockDevices.findIndex(d => d.id === id);
  if (index === -1) return res.status(404).send({ msg: "Device not found" });
  mockDevices.splice(index, 1);
  res.sendStatus(204);
});

//Sorunlar için 

app.get("/api/issues", (req, res) => {
  res.send(mockIssues);
});

app.post("/api/issues", (req, res) => {
  const newIssue = {
    id: mockIssues.length + 1,
    ...req.body,
    status: "open",
    comments: [],
    history: [{ status: "open", date: new Date() }],
  };
  mockIssues.push(newIssue);
  res.status(201).send(newIssue);
});

app.put("/api/issues/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockIssues.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).send({ msg: "Issue not found" });
  mockIssues[index] = { ...mockIssues[index], ...req.body };
  res.send(mockIssues[index]);
});

app.delete("/api/issues/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mockIssues.findIndex(i => i.id === id);
  if (index === -1) return res.status(404).send({ msg: "Issue not found" });
  mockIssues.splice(index, 1);
  res.sendStatus(204);
});

// Teknik Personel ekledim.
app.put("/api/issues/:id/assign", (req, res) => {
  const id = parseInt(req.params.id);
  const { technicianId } = req.body;

  const issue = mockIssues.find(i => i.id === id);
  if (!issue) return res.status(404).send({ msg: "Issue not found" });

  issue.technicianId = technicianId;
  issue.history.push({ status: "assigned", date: new Date(), technicianId });
  res.send(issue);
});

//Sorunları Güncellemek için
app.put("/api/issues/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const issue = mockIssues.find(i => i.id === id);
  if (!issue) return res.status(404).send({ msg: "Issue not found" });

  issue.status = status;
  issue.history.push({ status, date: new Date() });
  res.send(issue);
});

// Sorunlara yorum eklemek için
app.post("/api/issues/:id/comments", (req, res) => {
  const id = parseInt(req.params.id);
  const { comment } = req.body;

  const issue = mockIssues.find(i => i.id === id);
  if (!issue) return res.status(404).send({ msg: "Issue not found" });

  issue.comments.push({ comment, date: new Date() });
  res.status(201).send(issue);
});

// Çözülen sorunları bildirmek için
app.get("/api/stats/resolved", (req, res) => {
  const resolvedIssues = mockIssues.filter(i => i.status === "resolved");
  res.send({
    count: resolvedIssues.length,
    resolvedIssues,
  });
});

// Sorun çözüm sürelerinin ortalama olarak hesaplamak için
app.get("/api/stats/devices/average-resolution", (req, res) => {
  const deviceStats = mockDevices.map(device => {
    const deviceIssues = mockIssues.filter(i => i.deviceId === device.id && i.status === "resolved");

    const totalDuration = deviceIssues.reduce((acc, issue) => {
      const opened = new Date(issue.history.find(h => h.status === "open").date);
      const resolved = new Date(issue.history.find(h => h.status === "resolved").date);
      return acc + (resolved - opened);
    }, 0);

    const avgDuration = deviceIssues.length > 0 ? totalDuration / deviceIssues.length : 0;

    return {
      deviceId: device.id,
      model: device.model,
      averageResolutionMs: avgDuration
    };
  });

  res.send(deviceStats);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Running on Port ${PORT}`);
  });
}

export default app;
