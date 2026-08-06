import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const categories = [
    { name: "بيع وشراء", slug: "buy-and-sell", thumbnail: "https://images.pexels.com/photos/210881/pexels-photo-210881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { name: "مركبات", slug: "vehicles", thumbnail: "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg?auto=compress&cs=tinysrgb&w=1600" },
    { name: "وظايف", slug: "jobs", thumbnail: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600" },
    { name: "خدمات", slug: "services", thumbnail: "https://images.pexels.com/photos/1409215/pexels-photo-1409215.jpeg?auto=compress&cs=tinysrgb&w=1600" },
    { name: "مجتمعنا", slug: "community", thumbnail: "https://images.pexels.com/photos/609771/pexels-photo-609771.jpeg?auto=compress&cs=tinysrgb&w=1600" }
  ];

  try {
    // Delete all existing categories to wipe out the english ones
    // Note: this will fail if there are existing listings attached to them.
    // If it fails, we catch the error, but we still try to upsert the new ones below.
    try {
      await prisma.category.deleteMany({});
    } catch (e) {
      console.log("Could not delete all categories, maybe due to foreign key constraints.");
    }

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, thumbnail: cat.thumbnail },
        create: { name: cat.name, slug: cat.slug, thumbnail: cat.thumbnail }
      });
    }
    res.status(200).json({ message: "تم تحديث الأقسام بنجاح!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
