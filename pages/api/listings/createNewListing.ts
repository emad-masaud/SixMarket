import prisma from "@/utils/prisma";
import { Listing } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { sendEmail } from "@/utils/emailer";

async function CreateNewAd(adData: any) {
  try {
    const newAd = await prisma.listing.create({
      data: adData,
    });
    return newAd;
  } catch (error: any) {
    throw new Error(error);
  }
}

// POST '/api/listings/createNewListing'
export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: Session | null = await getServerSession(req, res, authOptions);

  // Protected
  if (session) {
    console.log("There's a session");
    if (req.method === "POST") {
      try {
        const user = await prisma.user.findUnique({
          where: {
            email: session.user?.email as string,
          },
        });

        const userId = user?.id;
        const { images, tags, ...restBody } = req.body;

        const adData: any = {
          userId,
          ...restBody,
          price: parseInt(restBody.price, 10),
        };

        if (images && images.length > 0) {
          adData.images = {
            create: images.map((url: string) => ({ url })),
          };
        }

        if (tags && tags.length > 0) {
          adData.tags = {
            connect: tags.map((id: string) => ({ id })),
          };
        }

        console.log("Data from server", adData);
        const newAd = await CreateNewAd(adData);

        if (user && user.email) {
          await sendEmail(
            user.email,
            "Your listing is live!",
            `<h1>Congratulations!</h1><p>Your listing <strong>${newAd.name}</strong> has been successfully published on Marketplace.</p>`
          );
        }

        res.status(201).json(newAd);
      } catch (error: any) {
        console.error("API error:", error); // Add this line to log the error
        res.status(500).send({ error: error.message });
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  } else {
    res.status(401).send("401 - Not Authorized");
  }
}
