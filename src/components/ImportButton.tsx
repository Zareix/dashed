import { zodResolver } from '@hookform/resolvers/zod'
import { ImportIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { api } from '~/utils/api'

const importSchema = z.object({
  yml: z.string().min(1),
})

const ImportButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const importMutation = api.category.import.useMutation({
    onSuccess: async () => {
      toast.success('Service created')
      setIsOpen(false)
      form.reset()
      await utils.category.getAll.invalidate()
    },
    onError: () => {
      toast.error('An error occurred while creating service')
    },
  })
  const form = useForm<z.infer<typeof importSchema>>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      yml: '',
    },
  })

  function onSubmit(values: z.infer<typeof importSchema>) {
    importMutation.mutate(values.yml)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ImportIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="yml"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yml</FormLabel>
                  <FormControl>
                    <Textarea placeholder="yml" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={importMutation.isPending}
              className="ml-auto"
            >
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ImportButton
