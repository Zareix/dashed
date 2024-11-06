"use client";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import DeleteServiceButton from "~/components/DeleteServiceButton";

const serviceCreateSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1).url(),
  category: z.string().min(1),
});

export default function AdminPage() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const servicesQuery = api.service.getAll.useQuery();
  const utils = api.useUtils();
  const refreshIndexPageMutation = api.service.refresh.useMutation({
    onSuccess: async () => {
      toast.success("Index page refreshed");
    },
    onError: () => {
      toast.error("An error occurred while refreshing index page");
    },
  });
  const createServiceMutation = api.service.create.useMutation({
    onSuccess: async () => {
      toast.success("Service created");
      setIsCreateFormOpen(false);
      await utils.service.invalidate();
    },
    onError: () => {
      toast.error("An error occurred while creating service");
    },
  });
  const form = useForm<z.infer<typeof serviceCreateSchema>>({
    resolver: zodResolver(serviceCreateSchema),
    defaultValues: {
      name: "",
      url: "",
    },
  });

  function onSubmit(values: z.infer<typeof serviceCreateSchema>) {
    createServiceMutation.mutate(values);
  }

  const refresh = () => {
    refreshIndexPageMutation.mutate();
  };

  return (
    <main className="flex w-full flex-col items-center justify-center">
      <div className="container py-8">
        <div className="flex items-center justify-end gap-4">
          <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon />
                Add service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new service</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Service category" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Service name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="Service url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={createServiceMutation.isPending}
                    className="ml-auto"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Button onClick={refresh}>Refresh</Button>
        </div>
        {servicesQuery.isLoading ? (
          <div className="mt-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center">Loading...</div>
          </div>
        ) : servicesQuery.isError || !servicesQuery.data ? (
          <div className="mt-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center">
              An error occurred while loading services.
            </div>
          </div>
        ) : (
          <Table className="mt-4 rounded-lg border border-gray-200">
            <TableCaption>All services</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesQuery.data.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.url}</TableCell>
                  <TableCell>
                    <DeleteServiceButton id={service.id} name={service.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </main>
  );
}
