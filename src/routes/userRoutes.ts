import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// User CRUD
// Create User
router.post("/", async (req, res) => {
  const { email, name, username, bio } = req.body;
  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Username and Email should be Unique" });
  }
});

// List of Users
router.get("/", async (req, res) => {
  const allUser = await prisma.user.findMany({
    select: { id: true, name: true, image: true },
  });
  res.json(allUser);
});

// get one User
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });
  res.json(user);
});

//  Update User
router.put(":id", async (req, res) => {
  const { id } = req.params;
  const { bio, image, name } = req.body;
  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        bio,
        name,
        image,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: `Failed to update the user! ` });
  }
});

// Delete User
router.delete(":id", async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
});

export default router;
