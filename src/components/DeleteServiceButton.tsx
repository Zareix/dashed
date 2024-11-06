"user client";

import { TrashIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

const DeleteServiceButton = ({ id, name }: { id: number; name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const deleteServiceMutation = api.service.delete.useMutation({
    onSuccess: async () => {
      setIsOpen(false);
      toast("Service deleted");
      await utils.service.invalidate();
    },
  });

  const deleteService = () => {
    deleteServiceMutation.mutate({ id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <TrashIcon className="text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &quot;{name}&quot;</DialogTitle>
        </DialogHeader>
        <p>
          Are you absolutely sure you want to delete service &quot;{name}
          &quot;?
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={deleteService}
            disabled={deleteServiceMutation.isPending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceButton;
