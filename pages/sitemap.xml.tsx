import { GetServerSideProps } from "next";
import prisma from "@/utils/prisma";

const URL = process.env.NEXT_PUBLIC_BASE_URL || "https://meamart.com";

function generateSiteMap(listings: any[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Manual URLs -->
     <url>
       <loc>${URL}</loc>
     </url>
     <url>
       <loc>${URL}/about</loc>
     </url>
     <url>
       <loc>${URL}/categories</loc>
     </url>
     <!-- Dynamic Listings -->
     ${listings
       .map(({ id, updatedAt }) => {
         return `
       <url>
           <loc>${`${URL}/listings/${id}`}</loc>
           <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const listings = await prisma.listing.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const sitemap = generateSiteMap(listings);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
