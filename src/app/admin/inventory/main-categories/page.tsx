"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/tables/data-table";
import { Plus } from "lucide-react";
import { useState } from "react";


const categories = [
  { id: 1, name: "Beverages" },
  { id: 2, name: "Snacks" },
  { id: 3, name: "Dairy Products" },
  { id: 4, name: "Fruits and Vegetables" },
  { id: 5, name: "Frozen Foods" },
  { id: 6, name: "Bakery Items" },
  { id: 7, name: "Meat and Seafood" },
  { id: 8, name: "Condiments and Sauces" },
  { id: 9, name: "Canned Goods" },
  { id: 10, name: "Grains and Pasta" },
  { id: 11, name: "Household Supplies" },
  { id: 12, name: "Personal Care" },
  { id: 13, name: "Baby Care" },
  { id: 14, name: "Pet Supplies" },
  { id: 15, name: "Health and Wellness" },
  { id: 16, name: "Office Supplies" },
  { id: 17, name: "Electronics" },
  { id: 18, name: "Automotive" },
  { id: 19, name: "Garden and Outdoor" },
  { id: 20, name: "Sports and Fitness" },
  { id: 21, name: "Toys and Games" },
  { id: 22, name: "Books and Magazines" },
  { id: 23, name: "Arts and Crafts" },
  { id: 24, name: "Party Supplies" },
  { id: 25, name: "Seasonal Items" },
  { id: 26, name: "International Foods" },
  { id: 27, name: "Organic Products" },
  { id: 28, name: "Gluten-Free Items" },
  { id: 29, name: "Vegan Products" },
  { id: 30, name: "Bulk Foods" },
  { id: 31, name: "Ready-to-Eat Meals" },
  { id: 32, name: "Breakfast Foods" },
  { id: 33, name: "Cooking Ingredients" },
  { id: 34, name: "Spices and Seasonings" },
  { id: 35, name: "Baking Supplies" },
  { id: 36, name: "Coffee and Tea" },
  { id: 37, name: "Juices and Sodas" },
  { id: 38, name: "Wine and Spirits" },
  { id: 39, name: "Energy Drinks" },
  { id: 40, name: "Water and Ice" },
  { id: 41, name: "Cleaning Supplies" },
  { id: 42, name: "Paper Products" },
  { id: 43, name: "Home Decor" },
  { id: 44, name: "Kitchen Supplies" },
  { id: 45, name: "Storage and Organization" },
  { id: 46, name: "Laundry Products" },
  { id: 47, name: "First Aid" },
  { id: 48, name: "Vitamins and Supplements" },
  { id: 49, name: "Diet and Nutrition" },
  { id: 50, name: "Specialty Foods" },
];

const MainCategoriesRoute = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Main Categories</CardTitle>
              <CardDescription className="text-muted-foreground">
                This is the main categories page for the inventory management
                system.
              </CardDescription>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" />
                  New Main Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Main Category</DialogTitle>
                  <DialogDescription>
                    Create a new main category for your inventory items.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div></div>
          </div>

          <DataTable
            data={categories}
            columns={[
              {
                header: "#",
                accessorKey: "id",
                cell: (item) =>
                  `${categories.findIndex((c) => c.id === item.id) + 1}.`,
              },
              {
                header: "Name",
                accessorKey: "name",
              },
            ]}
            actions={(item) => (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" className="ml-2">
                  Delete
                </Button>
              </div>
            )}
            title="Main Categories Report"
            searchKey="name"
            initialPageSize={10}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default MainCategoriesRoute;
