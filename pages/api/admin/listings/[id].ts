import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).end("Method Not Allowed");
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  try {
    await prisma.listing.delete({
      where: { id: id as string },
    });
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Delete listing error:", error);
    return res.status(500).json({ error: error.message });
  }
}
