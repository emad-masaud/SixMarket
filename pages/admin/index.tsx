import PrimaryLayout from "@/components/layout/primary/PrimaryLayout";
import prisma from "@/utils/prisma";
import { Button, Table, Title } from "@mantine/core";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { NextPageWithLayout } from "../page";

interface AdminProps {
  stats: {
    usersCount: number;
    listingsCount: number;
  };
  listings: Array<{
    id: string;
    name: string;
    price: number;
    userName: string;
  }>;
}

const AdminDashboard: NextPageWithLayout<AdminProps> = ({ stats, listings }) => {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete listing.");
      }
    } catch (e) {
      alert("Error deleting listing.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <Title order={1} mb="xl">Admin Dashboard</Title>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <Title order={3}>Total Users</Title>
          <p className="text-3xl font-bold text-blue-600">{stats.usersCount}</p>
        </div>
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <Title order={3}>Total Listings</Title>
          <p className="text-3xl font-bold text-green-600">{stats.listingsCount}</p>
        </div>
      </div>

      <Title order={2} mb="md">Manage Listings</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>User</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${item.price}</td>
              <td>{item.userName}</td>
              <td>
                <Button color="red" size="xs" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;

AdminDashboard.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const usersCount = await prisma.user.count();
  const listingsCount = await prisma.listing.count();
  const rawListings = await prisma.listing.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const listings = rawListings.map((l) => ({
    id: l.id,
    name: l.name,
    price: l.price || 0,
    userName: l.user.name || "Unknown",
  }));

  return {
    props: {
      stats: { usersCount, listingsCount },
      listings,
    },
  };
};
